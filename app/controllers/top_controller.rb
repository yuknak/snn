class TopController < ApplicationController
  

  def index
    
    @last_updated_at = FiveCh::Thread.all.order(id: 'DESC').first.updated_at
    @board = FiveCh::Board.where(id: 11).first
    @threads = FiveCh::Thread.where(board_id: 11).order(res_speed: 'DESC').limit(50)

    render "index"
    
  end
end
