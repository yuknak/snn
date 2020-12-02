require 'kconv'

module Snn
  class Mirror

    include FiveCh

    def self.servers_and_boards
      url = "https://menu.5ch.net/bbstable.html"
      charset = nil
      html = URI.open(url, "r:binary") do |f|
        charset = f.charset; f.read
      end
      html.scan(/<A HREF.+?>.+?A>/).each do |e|
        e = Kconv.toutf8(e)
        if (e.match('<A HREF=https://(.+?)/(.+?)/>(.+?)</A>')) then
          server_name = $1
          board_name = $2
          board_title = $3
          server = Server.find_by(name: server_name)
          if (server.nil?) then
            server = Server.new
            server.name = server_name
            server.save!
          end
          board = Board.find_by(name: board_name)
          if (board.nil?) then
            board = Board.new
            board.server_id = server.id
            board.name = board_name
            board.title = board_title
            board.save!
          end
        end
      end
    end

    def self.threads(server_name, board_name)
      server = Server.find_by(name: server_name)
      if (server.nil?) then
        puts "Server not found: #{server_name}."
        return
      end
      board = Board.find_by(name: board_name)
      if (board.nil?) then
        puts "Board not found: #{board_name}."
        return
      end
      unless (server.mirror) then
        puts "Server is set to be UN-mirrored: #{server_name}."
        return
      end
      #unless (board.mirror) then
      #  puts "Board is set to be UN-mirrored: #{board_name}."
      #  return
      #end
      url = "https://#{server_name}/#{board_name}/subback.html"
      charset = nil
      html = URI.open(url, "r:binary") do |f|
        charset = f.charset; f.read
      end
      board_updated = false
      html.scan(/<a href=".+?l50">.+?a>/).each do |e|
        e = Kconv.toutf8(e)
        if (e.match('<a href="(.+?)/l50">.+?: (.+?)</a>')) then
          tid = $1
          if (tid.to_d >= 9000000000) then # some special data
            next
          end
          title = $2
          if (title.match('^(.+) \((\d+)\)$')) then
            title = $1
            res_count = $2
            thread = Thread.where(board_id: board.id, tid: tid)
            if (thread.present?) then
              if (thread.res_count < res_count.to_d) then
                thread.res_count = res_count.to_d
                thread.mirrored_at = Time.now
                thread.save!
                board_updated = true
              end
            else
              thread = Thread.new
              thread.board_id = board.id
              thread.tid = tid.to_d
              thread.title = title
              thread.res_count = res_count.to_d
              thread.mirrored_at = Time.now
              thread.save!
              board_updated = true
            end
          end
        end
      end
      if (board_updated) then # TODO: when db exception occurs
        board.mirrored_at = Time.now
        board.save!
      end
    end

    def self.test3

      servers_and_boards
      threads('hayabusa9.5ch.net','news')
    end

  end
end