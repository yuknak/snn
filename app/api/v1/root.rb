################################################################################
module V1

  ##############################################################################

  class Root < Grape::API
    
    format :json
    version 'v1'

    # All unmatched routes (but except for /)
    # https://stackoverflow.com/questions/23486871/
    # rails-4-grape-api-actioncontrollerroutingerror
    route :any, '*path' do
      error!({ error:"Not Found '#{request.request_method} #{request.path}'" }, 404)
    end

    # Grape exception returns 400 
    rescue_from Grape::Exceptions::Base do |e|
      error!(e.message, 400)
    end

    # Other exception 500
    rescue_from :all do |e|
      error!({error: e.message, backtrace: e.backtrace[0]}, 500)
    end

    # Cound not place grape_devise_token_auth stuff here
    # because of add_swagger_documentation error.
    # (this happens only on non-API(normal) rail smode)
    #
    #auth :grape_devise_token_auth, resource_class: :user
    #helpers GrapeDeviseTokenAuth::AuthHelpers

    helpers V1::Helpers
    
    mount V1::User
    mount V1::Server
    mount V1::Board
    mount V1::Thread

    #add_swagger_documentation(
    #  doc_version: '1.0.0',
    #  info: {
    #    title: 'API 1.0',
    #    description: 'API specification document'
    #  }
    #)

  end

  ##############################################################################

end

################################################################################