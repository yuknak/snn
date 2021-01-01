################################################################################
module V1

    ##############################################################################
    
    class UserCheckEntity < Grape::Entity
        expose :show_msgbox # true/false
        expose :msg_title   # if flg is true, msg box popup(everytime, forcibly)
        expose :msg_body    #
        expose :do_redir    # if msgbox showen, and after user press ok,
        expose :redir_url_ios # if (do_redir=true) open external browser and jump
        expose :redir_url_android
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
          info = URI.decode_www_form_component(info)
          pp info
					check = {}
					check[:show_msgbox]=false
					check[:msg_title]='お知らせ'
					check[:msg_body]='このアプリの新しいバージョンが公開されています.アップデートを行ってください.'
					check[:do_redir]=true
					check[:redir_url_ios]='https://apps.apple.com/jp/app/id363992049'
          check[:redir_url_android]='https://play.google.com/store/apps/details?id=jp.co.airfront.android.a2chMate'
          pp check
          present check, with: UserCheckEntity
        end
  
      end
  
    end
    
    ##############################################################################
    
  end
    
  ################################################################################