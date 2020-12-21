# Move to crono gem
# see /config/cronotab.rb

# To run:
# bundle exec whenever -i

require File.expand_path(File.dirname(__FILE__) + "/environment")
rails_env = ENV['RAILS_ENV'] || :development
set :environment, rails_env

#set :output, "#{Rails.root}/log/cron.log"

#very 5.minutes do
#  rake "task:test"
#end