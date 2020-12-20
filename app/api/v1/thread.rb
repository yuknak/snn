################################################################################
module V1

  ##############################################################################

  ##############################################################################
  # GeneralThread includes each thread's board info(only name).

  class GeneralThreadServerEntity < Grape::Entity
    expose :name
  end
  class GeneralThreadBoardEntity < Grape::Entity
    expose :name
    expose :server, using: GeneralThreadServerEntity #=>
  end
  class GeneralThreadEntity < Grape::Entity
    format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
    expose :id
    expose :board_id
    expose :board, using: GeneralThreadBoardEntity # special =>
    expose :tid
    expose :title
    expose :mirror_ver
    expose :mirror_order
    with_options(format_with: :iso_timestamp) do
      expose :mirrored_at
    end
    expose :res_cnt
    expose :res_added
    expose :res_speed
    expose :res_percent
    with_options(format_with: :iso_timestamp) do
      expose :created_at
      expose :updated_at
    end
  end
  class GeneralThreadsEntity < Grape::Entity
    expose :page
    expose :per_page
    expose :total_pages
    expose :total  
    expose :data, using: GeneralThreadEntity # index =>
  end

  ##############################################################################
  # The below includes ONE board info in the index data structure,
  # for getting A board index specified in param
  class ThreadEntity < Grape::Entity
    format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
    expose :id
    expose :board_id
    expose :tid
    expose :title
    expose :mirror_ver
    expose :mirror_order
    with_options(format_with: :iso_timestamp) do
      expose :mirrored_at
    end
    expose :res_cnt
    expose :res_added
    expose :res_speed
    expose :res_percent
    with_options(format_with: :iso_timestamp) do
      expose :created_at
      expose :updated_at
    end
  end
  class ThreadBoardEntity < Grape::Entity
    format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
    expose :id
    expose :name
    expose :title
    with_options(format_with: :iso_timestamp) do
      expose :mirrored_at
    end
    expose :res_added
    expose :res_speed
  end
  class ThreadsEntity < Grape::Entity
    expose :page
    expose :per_page
    expose :total_pages
    expose :total  
    expose :board, using: ThreadBoardEntity # special =>
    expose :data, using: ThreadEntity # index =>
  end

  ##############################################################################
  class Thread < Grape::API
  
    ############################################################################

    helpers do

      def get_board(name)
        FiveCh::Board.find_by(name: name)
      end

    end

    ############################################################################
    
    resource :thread do
  
      ##########################################################################

      get ':id' do
        board_name = params[:id]
        if (board_name == 'latest'||
          board_name == 'today'||
          board_name == 'yesterday'||
          board_name == 'festival') then
          threads = FiveCh::Thread.all.includes([board: :server])
            .order(tid: 'DESC').limit(50)
          threads = ransack_index(threads)
          present threads, with: GeneralThreadsEntity  

        elsif board_name == 'top' then
          threads = FiveCh::Thread.all.includes([board: :server])
            .order(tid: 'DESC').limit(50)
          threads = ransack_index(threads)
          present threads, with: GeneralThreadsEntity  

        else
          board = get_board(board_name)
          threads = FiveCh::Thread.where(
            board_id: board.id, mirror_ver: board.mirror_ver)
              .order(res_speed: 'DESC', mirror_order: 'ASC').limit(50)
          threads = ransack_index(threads)
          threads[:board] = board
          #puts threads.to_json
          present threads, with: ThreadsEntity
        end
      end

    end

  end
  
  ##############################################################################
  
end
  
################################################################################