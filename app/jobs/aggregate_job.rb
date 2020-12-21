class AggregateJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    # require 'byebug'; byebug
    #jobLogger.info '*** start aggregate ***'
    Snn::Mirror.test3()
  end
  
end
