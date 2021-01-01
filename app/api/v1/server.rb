################################################################################
module V1

  ##############################################################################
  
  class ServerEntity < Grape::Entity
      format_with(:iso_timestamp) { |dt| dt.iso8601 }
      expose :id
      expose :name
      expose :title
      expose :mirror
      with_options(format_with: :iso_timestamp) do
        expose :created_at
        expose :updated_at
      end
  end

  class ServersEntity < Grape::Entity
    expose :page
    expose :per_page
    expose :total_pages
    expose :total  
    expose :data, using: ServerEntity
  end

  ##############################################################################
  class Server < V1::Root
  
    ############################################################################

    helpers do

    end

    ############################################################################
    
    resource :server do
  
      ##########################################################################

      get do
        servers = FiveCh::Server.all.order(id: "ASC")
        servers = ransack_index(servers)
        present servers, with: ServersEntity
      end

    end

  end
  
  ##############################################################################
  
end
  
################################################################################