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

      def get_top
        data = []
        params[:per_page] = 3
        FiveCh::Board.all.each do |board|
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