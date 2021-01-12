################################################################################
module V1

  ##############################################################################

  class Root < Grape::API
    
    format :json
    version 'v1'

    ############################################################################
    # Catch all server-side exceptions,
    # and make it as JSON return. Exceptions are also printed out to STDOUT
    
    # All unmatched routes (but except for /)
    # https://stackoverflow.com/questions/23486871/
    # rails-4-grape-api-actioncontrollerroutingerror
    route :any, '*path' do
      puts "Not Found '#{request.request_method} #{request.path}'"
      error!({ errmode: 'grape', status: 404,
        error:"Not Found '#{request.request_method} #{request.path}'" }, 404)
    end

    # Grape exception returns 400
    rescue_from Grape::Exceptions::Base do |e|
      puts "#{e.message}"
      error!({errmode: 'grape', status: 400,
        error: e.message}, 400)
    end

    # Other exception 500
    rescue_from :all do |e|
      puts "#{e.message} #{e.backtrace[0]}"
      error!({errmode: 'grape', status: 500,
        error: "#{e.message} #{e.backtrace[0]}"}, 500)
    end

    #####################
    # Easy basic auth 401
    
    http_basic do |username, password|
      chk = username + ':' + password
      if (!ActiveSupport::SecurityUtils.secure_compare(
        chk, "ilcaqtkr:Of7pWFTt")) then
        puts "Unauthorized"
        error!({errmode: 'grape', status: 401,
          error: 'Unauthorized'}, 401)
      end
      true
    end

    ############################################################################
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
    mount V1::Support

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