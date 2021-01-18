################################################################################
module V1

  ##############################################################################
  # IMPORTANT NOTICE)
  # 1)
  # About cache(Rails.cache.fetch)
  # DB function behaviors are defenitely
  # DIFFERENT if they are in Rails.cache.fetch block!!!
  # because of Rails optimization.
  # This is a known problem. Generally, we avoid this by using
  # serialization (JSON).
  # Here, our problem seems ransack_index does not load
  # relation tables properly.
  # So, finally, as a result, Entities* are totally disposed --;
  # because we have to do dynamic JSON generation.
  # 2)
  # And you HAVE TO do "rails dev:cache" to enable(toggle) cache.
  # (under development mode)
  # $ rails dev:cache
  # Development mode is now being cached.
  # $ rails dev:cache
  # Development mode is no longer being cached.  
  ##############################################################################

  class ThreadServerNameEntity < Grape::Entity
    expose :name
  end
  class ThreadBoardNameEntity < Grape::Entity
    expose :name
    expose :server, using: ThreadServerNameEntity #=>
  end
  class ThreadWithBoardNameEntity < Grape::Entity
    format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
    expose :board, using: ThreadBoardNameEntity # =>
    expose :tid
    expose :title
    with_options(format_with: :iso_timestamp) do
      expose :mirrored_at
    end
    expose :res_cnt
    expose :res_added
    expose :res_speed
    expose :res_speed_max
    expose :res_percent
  end
  class ThreadBoardEntity < Grape::Entity
    format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
    expose :name
    expose :server, using: ThreadServerNameEntity #=>
    expose :title
    with_options(format_with: :iso_timestamp) do
      expose :mirrored_at
    end
    expose :res_added
    expose :res_speed
  end
  class ThreadsWithPagingEntity < Grape::Entity
    expose :page
    expose :per_page
    expose :total_pages
    expose :total  
    expose :board, using: ThreadBoardEntity # =>
    expose :data, using: ThreadWithBoardNameEntity # data[] array =>
  end

  ##############################################################################
  class ThreadEntity < Grape::Entity
    format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
    expose :tid
    expose :title
    with_options(format_with: :iso_timestamp) do
      expose :mirrored_at
    end
    expose :res_cnt
    expose :res_added
    expose :res_speed
    expose :res_speed_max
    expose :res_percent
  end
  class ThreadsEntity < Grape::Entity
    expose :board, using: ThreadBoardEntity # =>
    expose :data, using: ThreadEntity # data[] array =>
  end
  class ThreadTopEntity < Grape::Entity
    expose :data, using: ThreadsEntity # data[] array =>
  end

  ##############################################################################
  class Thread < V1::Root
 
    ############################################################################

    helpers do

      def epoch_today
        t = Time.now
        Time.local(0,0,0,t.day,t.mon,t.year,nil,nil,false,nil).to_i
      end

      def epoch_yesterday
        t = Time.now.yesterday
        Time.local(0,0,0,t.day,t.mon,t.year,nil,nil,false,nil).to_i
      end

      def epoch_aweekago
        t = Time.now.ago(1.week)
        Time.local(0,0,0,t.day,t.mon,t.year,nil,nil,false,nil).to_i
      end

      ##########################################################################
      # Process thread records in order to be placed in
      # Rails.cache.fetch block
      def proc_threads(threads)
        threads = ransack_index(threads)
        threads = JSON.parse(threads.to_json)
        data = []
        threads['data'].each do |thread_data|
          board = FiveCh::Board.find(thread_data['board_id'])
          server = FiveCh::Server.find(board['server_id'])
          thread = JSON.parse(thread_data.to_json)
          board = JSON.parse(board.to_json)
          board['server'] = { name: server['name'] }
          thread['board'] = board
          data.push(thread)
        end
        threads['data'] = data
        threads        
      end

      ##########################################################################

      def get_latest
        # get from a week ago
        threads = FiveCh::Thread.where(
          'inproper != 1 AND tid >= ?', epoch_aweekago).includes([board: :server])
            .order(tid: 'DESC')
        proc_threads(threads)
        #present threads, with: ThreadsWithPagingEntity
      end

      def cache_latest
        Rails.cache.fetch("/latest", expires_in: 20.seconds) do
          get_latest
        end
      end

      ##########################################################################

      def get_today
        threads = FiveCh::Thread.where(
          'inproper != 1 AND tid >= ?', epoch_today).includes([board: :server])
            .order(res_speed_max: 'DESC', tid: 'ASC')
        proc_threads(threads)
        #present threads, with: ThreadsWithPagingEntity  
      end

      def cache_today
        Rails.cache.fetch("/today", expires_in: 20.seconds) do
          get_today
        end
      end

      ##########################################################################

      def get_yesterday
        threads = FiveCh::Thread.where(
          'inproper != 1 AND tid >= ? AND tid < ?', epoch_yesterday, epoch_today).includes([board: :server])
            .order(res_speed_max: 'DESC', tid: 'ASC')
        proc_threads(threads)
        #present threads, with: ThreadsWithPagingEntity  
      end

      def cache_yesterday
        Rails.cache.fetch("/yesterday", expires_in: 20.seconds) do
          get_yesterday
        end
      end

      ##########################################################################

      def get_week
        threads = FiveCh::Thread.where(
          'inproper != 1 AND tid >= ?', epoch_aweekago).includes([board: :server])
            .order(res_speed_max: 'DESC', tid: 'ASC')
        proc_threads(threads)
        #present threads, with: ThreadsWithPagingEntity  
      end

      def cache_week
        Rails.cache.fetch("/week", expires_in: 20.seconds) do
          get_week
        end
      end

      ##########################################################################

      def get_category(board_name)
        board = FiveCh::Board.find_by(name: board_name)
        threads = FiveCh::Thread.where(
          'inproper != 1 AND board_id = ? AND mirror_ver = ?',
          board.id, board.mirror_ver)
            .order(res_percent: 'DESC', mirror_order: 'ASC')
          .includes([board: :server])
        threads = proc_threads(threads)
        threads['board'] = JSON.parse(board.to_json)
        threads
        #present threads, with: ThreadsWithPagingEntity
      end

      def cache_category(board_name)
        Rails.cache.fetch("/category/#{board_name}", expires_in: 20.seconds) do
          get_category(board_name)
        end
      end
      
      ##########################################################################
        
      @@top_boards = [
        { name: "newsplus", count: 8},
        { name: "mnewsplus", count: 5},
        { name: "news4plus", count: 5},
        { name: "bizplus", count: 5},
        { name: "seijinewsplus", count:5},
        { name: "scienceplus", count:4},
        { name: "news5plus", count:2},
        { name: "femnewsplus", count:2},
        { name: "moeplus", count:2},
      ]

      def get_top
        data = []
        @@top_boards.each do |top_board|
          board = FiveCh::Board.find_by(name: top_board[:name])
          server = FiveCh::Server.find(board.server_id)
          params[:per_page] = top_board[:count]
          threads = FiveCh::Thread.where(
            'inproper != 1 AND board_id = ? AND mirror_ver = ?',
            board.id, board.mirror_ver)
              .includes([board: :server])
              .order(res_percent: 'DESC', mirror_order: 'ASC')
          threads = ransack_index(threads)
          threads = JSON.parse(threads.to_json)
          board = JSON.parse(board.to_json)
          board[:server] = { name: server['name'] }
          threads[:board] = board
          data.push(threads)
        end
        top_data = {}
        top_data[:data] = data
        top_data
        #present top_data, with: ThreadTopEntity
      end

      def cache_top
        Rails.cache.fetch("/top", expires_in: 20.seconds) do
          get_top
        end
      end
      
      ##########################################################################

      def get_search
        q_str = "%#{params[:q]}%"
        threads = FiveCh::Thread.where(
          'inproper != 1 AND title like ?',q_str).includes([board: :server])
            .order(tid: 'DESC')
        threads = ransack_index(threads)
        present threads, with: ThreadsWithPagingEntity  
      end

    end

    ############################################################################
    
    resource :thread do
  
      ##########################################################################

      params do
        requires :q, type: String
      end
      get 'search' do

        get_search

      end

      ##########################################################################

      params do
        requires :id, type: String
      end
      get ':id' do

        board_name = params[:id]
        page = params.dig(:page)

        # process special screens
        if (board_name == 'latest' && page.present?) then
          present get_latest
        elsif (board_name == 'latest') then
          present cache_latest
        elsif (board_name == 'today' && page.present?) then
          present get_today
        elsif (board_name == 'today') then
          present cache_today
        elsif (board_name == 'yesterday' && page.present?) then
          present get_yesterday
        elsif (board_name == 'yesterday') then
          present cache_yesterday
        elsif (board_name == 'week' && page.present?) then
          present get_week
        elsif (board_name == 'week') then
          present cache_week

        # for top page, having special data strucure
        elsif board_name == 'top' then
          # always no param(no page info)
          present cache_top

        # process each board, normal pattern
        elsif (page.present?) then
          present get_category(board_name)
        else
          present cache_category(board_name)
        end
      end

    end

  end
  
  ##############################################################################
  
end
  
################################################################################