################################################################################
module V1

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
  class Thread < Grape::API
  
    ############################################################################

    helpers do

      def get_board(name)
        FiveCh::Board.find_by(name: name)
      end

      def epoch_today
        t = Time.now
        Time.local(0,0,0,t.day,t.mon,t.year,nil,nil,false,nil).to_i
      end

      def epoch_yesterday
        t = Time.now.yesterday
        Time.local(0,0,0,t.day,t.mon,t.year,nil,nil,false,nil).to_i
      end

      ##########################################################################

      def get_latest
        params[:per_page] = 50
        threads = FiveCh::Thread.all.includes([board: :server])
          .order(tid: 'DESC')
        threads = ransack_index(threads)
        present threads, with: ThreadsWithPagingEntity  
      end

      def get_today
        params[:per_page] = 50
        threads = FiveCh::Thread.where(
          'tid >= ?', epoch_today).includes([board: :server])
            .order(tid: 'DESC')
        threads = ransack_index(threads)
        present threads, with: ThreadsWithPagingEntity  
      end

      def get_yesterday
        params[:per_page] = 50
        threads = FiveCh::Thread.where(
          'tid >= ? AND tid < ?', epoch_yesterday, epoch_today).includes([board: :server])
            .order(tid: 'DESC')
        threads = ransack_index(threads)
        present threads, with: ThreadsWithPagingEntity  
      end

      def get_festival
        params[:per_page] = 50
        threads = FiveCh::Thread.all.includes([board: :server])
          .order(res_speed: 'DESC', mirror_order: 'ASC')
        threads = ransack_index(threads)
        present threads, with: ThreadsWithPagingEntity  
      end

      ##########################################################################
=begin
      <%= render partial: 'layouts/articles', locals:
				{board: get_board('newsplus'), threads: get_threads('newsplus', 8) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('mnewsplus'), threads: get_threads('mnewsplus', 5) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('news4plus'), threads: get_threads('news4plus', 5) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('bizplus'), threads: get_threads('bizplus', 5) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('seijinewsplus'), threads: get_threads('seijinewsplus', 5) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('scienceplus'), threads: get_threads('scienceplus', 4) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('news5plus'), threads: get_threads('news5plus', 2) } %>
			<%= render partial: 'layouts/articles', locals:
				{board: get_board('femnewsplus'), threads: get_threads('femnewsplus', 2) } %>
			<%= render partial: 'layouts/articles', locals:
        {board: get_board('moeplus'), threads: get_threads('moeplus', 2) } %>
=end
        
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
        #FiveCh::Board.all.each do |board|
        @@top_boards.each do |top_board|
          board = get_board(top_board[:name])
          params[:per_page] = top_board[:count]
          threads = FiveCh::Thread.where(
            board_id: board.id, mirror_ver: board.mirror_ver)
              .includes([board: :server])
              .order(res_speed: 'DESC', mirror_order: 'ASC')
          threads = ransack_index(threads)
          threads[:board] = board
          data.push(threads)
        end
        top_data = {}
        top_data[:data] = data
        present top_data, with: ThreadTopEntity
      end

    end

    ############################################################################
    
    resource :thread do
  
      ##########################################################################

      get ':id' do

        board_name = params[:id]

        # process special screens
        if (board_name == 'latest') then
          get_latest
        elsif (board_name == 'today') then
          get_today
        elsif (board_name == 'yesterday') then
          get_yesterday
        elsif (board_name == 'festival') then
          get_festival

        # a special data structure
        elsif board_name == 'top' then
          get_top
          #get_latest

        # process each board
        else
          params[:per_page] = 50

          board = get_board(board_name)
          threads = FiveCh::Thread.where(
            board_id: board.id, mirror_ver: board.mirror_ver)
              .order(res_speed: 'DESC', mirror_order: 'ASC')
            .includes([board: :server])
          threads = ransack_index(threads)
          threads[:board] = board
          #puts threads.to_json
          present threads, with: ThreadsWithPagingEntity
        end
      end

    end

  end
  
  ##############################################################################
  
end
  
################################################################################