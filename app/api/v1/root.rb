################################################################################
module V1

  ##############################################################################

  class Root < Grape::API
    
    format :json
    version 'v1'

    # Cound not place grape_devise_token_auth stuff here
    # because of add_swagger_documentation error.
    # (this happens only on non-API(normal) rail smode)
    #
    #auth :grape_devise_token_auth, resource_class: :user
    #helpers GrapeDeviseTokenAuth::AuthHelpers

    helpers V1::Helpers
    
    mount V1::Server
    #mount V1::Item
    #mount V1::ItemFile
    #mount V1::Transfer
    #mount V1::Provenance

    #add_swagger_documentation(
    #  doc_version: '1.0.0',
    #  info: {
    #    title: 'TAKUMI 匠 API 1.0',
    #    description: 'TAKUMI 匠 API specification document'
    #  }
    #)

  end

  ##############################################################################

end

################################################################################