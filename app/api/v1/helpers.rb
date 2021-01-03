################################################################################
module V1

  ##############################################################################

  module Helpers
    
    ##############################################################################
    # By using kaminari(paging, sorting) and ransack(searching) gems, 
    # returns React material-table style remote fetch JSON
    # Please see kaminari and ransack documents
    # to understand available params
    # See also : https://gist.github.com/be9/6446051
    
    def ransack_index(scope, default_per_page = 50)
      collection = scope.ransack(params[:q]).result.page(
        params[:page]).per((params[:per_page] || default_per_page).to_i)
      current, total, per_page =
        collection.current_page, collection.total_pages, collection.limit_value
    return {
        page:  current,
        per_page: per_page,
        total_pages:    total,
        total: collection.total_count,
        data: collection
    }
    end

    ##############################################################################

  end

end

################################################################################