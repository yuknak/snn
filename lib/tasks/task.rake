namespace :task do

  task test: :environment do |task, args|

    Snn::Mirror.test3()

  end

end