namespace :task do

  task test: :environment do |task, args|

    Snn::Mirror.test3()

  end

  task set_inproper: :environment do |task, args|

    Snn::Mirror.set_inproper()

  end

  task reset_inproper: :environment do |task, args|

    Snn::Mirror.reset_inproper()

  end

end