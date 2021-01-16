################################################################################
module V1

    ##############################################################################
    
    class UserCheckEntity < Grape::Entity
        expose :show_msgbox   # REQUIRED) true/false
        expose :hp_url        # REQUIRED) used in app
        expose :tutorial_url  # REQUIRED) used in app
        expose :privacy_url   # REQUIRED) used in app
        expose :contract_url  # REQUIRED) used in app
        expose :msg_title     # if show_msgbox is true, 
        expose :msg_body      # msg box popup(everytime, forcibly)
        expose :do_redir      # if msgbox showen, and after user press ok,
        expose :redir_url_ios # if (do_redir=true) open external browser and jump
        expose :redir_url_android #
    end
  
    ##############################################################################
    class User < V1::Root
    
      ############################################################################
  
      helpers do
  
        def get_remote_ip
          #pp headers
          if (headers['CF-Connecting-IP'].present?) then
            return headers['CF-Connecting-IP']
          end
          if (headers['X-Forwarded-For'].present?) then
            return headers['X-Forwarded-For']
          end
          if (headers['X-Real-Ip'].present?) then
            return headers['X-Real-Ip']
          end
          nil
        end

        def get_ip_country
          #pp headers
          if (headers['Cf-Ipcountry'].present?) then
            return headers['Cf-Ipcountry']
          end
          nil
        end

        def notice()

					check = {}
          check[:show_msgbox]=false
          # disable cache by uuid
          check[:hp_url]="https://snn.tetraserve.biz/index.html?"+SecureRandom.uuid
          check[:tutorial_url]="https://snn.tetraserve.biz/tutorial.html?"+SecureRandom.uuid
          check[:privacy_url]="https://snn.tetraserve.biz/contract.html?"+SecureRandom.uuid # -1.0.1 contact.html
          check[:contract_url]="https://snn.tetraserve.biz/contract.html?"+SecureRandom.uuid # 1.0.3-
          
          if (!check[:show_msgbox]) then
            # no notice
            check[:msg_title]=''
            check[:msg_body]=''
					  check[:do_redir]=true
            check[:redir_url_ios]=''
            check[:redir_url_android]=''
          else
            # example
            check[:msg_title]='お知らせ'
            check[:msg_body]=
              'このアプリの新しいバージョンが公開されています.アップデートを行ってください.'
					  check[:do_redir]=true
            check[:redir_url_ios]=
              "https://supernn.net/index.html?"+SecureRandom.uuid
            check[:redir_url_android]=
              "https://play.google.com/store/apps/details?id=biz.tetraserve.snncli?"+SecureRandom.uuid
          end
          
          pp check
          
          present check, with: UserCheckEntity
        end

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

          return notice
          
          # Get from client system info
          # everytime client restarts
          info = params.dig(:info)
          info = URI.decode_www_form_component(info)
          info = JSON.parse(info)
          pp info

          # Write into DB
          user = FiveCh::User.where(unique_id: info['uniqueId']).first
          if (user.blank?) then
            user = FiveCh::User.new
            user.unique_id = info['uniqueId']
          else
            #
          end

          user.ip = get_remote_ip
          user.ip_country = get_ip_country

          user.application_name = info['applicationName']
          user.brand = info['brand']
          user.bundle_id = info['bundleId']
          user.build_number = info['buildNumber']
          user.device_id = info['deviceId']
          user.device_type = info['deviceType']
          user.readable_version = info['readableVersion']
          user.system_name = info['systemName']
          user.system_version = info['systemVersion']
          user.version = info['version']
          user.save!
          pp user

          # Send boot time notice to client
          notice
        end
  
      end
  
    end
    
    ##############################################################################
    
  end
    
  ################################################################################