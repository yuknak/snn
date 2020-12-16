################################################################################
module V1

  ##############################################################################
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

  class ThreadsEntity < Grape::Entity
    expose :page
    expose :per_page
    expose :total_pages
    expose :total  
    expose :data, using: ThreadEntity
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

      get do

        board = get_board('newsplus')
        threads = FiveCh::Thread.where(board_id: board.id)
          .order(res_speed: 'DESC', mirror_order: 'ASC').limit(25)
        #threads = FiveCh::Thread.all.order(id: "ASC")
        threads = ransack_index(threads)
        present threads, with: ThreadsEntity
      end

    end

  end
  
  ##############################################################################
  
end
  
################################################################################