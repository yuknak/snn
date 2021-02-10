# == Route Map
#
#     Prefix Verb URI Pattern      Controller#Action
#       root GET  /                top#index
#        api      /api             Api
# admin_root GET  /admin(.:format) admin/top#index
#            GET  /:id(.:format)   top#index

Rails.application.routes.draw do
  root 'top#index'
  mount Api => '/api'
  #get '/about', to: 'about#index'
  namespace :admin do
    root 'top#index'
  #  get '/log', to: 'log#index'
  #  resources :daily_weights
  end
  get '/:id', to: 'top#index'
end
