################################################################################
module V1

  ##############################################################################
  
  class BoardEntity < Grape::Entity
      format_with(:iso_timestamp) { |dt| dt.nil? ? nil : dt.iso8601 }
      expose :server_id
      expose :name
      expose :title
      expose :mirror
      expose :mirror_ver
      with_options(format_with: :iso_timestamp) do
        expose :mirrored_at
      end
      expose :res_added
      expose :res_speed
      with_options(format_with: :iso_timestamp) do
        expose :created_at
        expose :updated_at
      end
  end

  class BoardsEntity < Grape::Entity
    expose :page
    expose :per_page
    expose :total_pages
    expose :total  
    expose :data, using: BoardEntity
  end

  ##############################################################################
  class Board < Grape::API
  
    ############################################################################

    helpers do

    end

    ############################################################################
    
    resource :board do
  
      ##########################################################################

      get do
        boards = FiveCh::Board.all.order(id: "ASC")
        boards = ransack_index(boards)
        present boards, with: BoardsEntity
      end

    end

  end
  
  ##############################################################################
  
end
  
################################################################################