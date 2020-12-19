class TopController < ApplicationController

  def get_board(name)
    FiveCh::Board.find_by(name: name)
  end

  def get_threads(board_name, limit)
    board = get_board(board_name)
    threads = FiveCh::Thread.where(board_id: board.id, mirror_ver: board.mirror_ver)
    .order(res_speed: 'DESC', mirror_order: 'ASC').limit(limit)
  end

  helper_method :get_board
  helper_method :get_threads

  def index

    @id = params[:id]

    @last_updated_at = FiveCh::Thread
      .all.order(id: 'DESC').first.updated_at
    
    render "index"
    
  end
end
