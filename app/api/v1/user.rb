################################################################################
module V1

    ##############################################################################
    
    class UserCheckEntity < Grape::Entity
        expose :show_msgbox # true/false
        expose :msg_title   # if flg is true, msg box popup(everytime, forcibly)
        expose :msg_body    #
        expose :do_redir    # if msgbox showen, and after user press ok,
        expose :redir_url   # if (do_redir=true) open external browser and jump
    end
  
    ##############################################################################
    class User < V1::Root
    
      ############################################################################
  
      helpers do
  
      end
  
      ############################################################################
      
      resource :user do
    
        ##########################################################################
        # Called everytime client startup(but when sleep wakeup, not called)
        # 1. Get client system info. and put it into db table
        # 2. Force user to update if he has a lower version
        #    or notify him the termination of the service, for ex!

        params do
          requires :info
        end
        post 'check' do
          info = params.dig(:info)

          info = URI.decode_www_form_component()
          pp info
					check = {}
					check[:show_msgbox]=true
					check[:msg_title]='おしらせ'
					check[:msg_body]='新しいバージョンが公開されています'
					check[:do_redir]=true
					check[:redir_url]='https://www.yahoo.co.jp/'
          present check, with: UserCheckEntity
        end
  
      end
  
    end
    
    ##############################################################################
    
  end
    
  ################################################################################