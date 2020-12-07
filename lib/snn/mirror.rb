require 'kconv'

module Snn

  class Mirror

    include FiveCh

    #########################################################################

    @@default_mirrored_boards = [
      "newsplus",
      "mnewsplus", "news4plus",
      "bizplus", "seijinewsplus", "news5plus",
      "scienceplus", "femnewsplus", "moeplus",
      "idolplus", "dqnplus"
    ]

    #########################################################################

    def self.servers_and_boards
      puts "Start servers_and_boards"
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
          unless (@@default_mirrored_boards.include?(board_name)) then
            next
          end
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
      puts "End servers_and_boards"

    end

    #########################################################################

    def self.threads_proc_res_count(epoch, thread)
      thread_res_count =
        ThreadResCount.where(thread_id: thread.id).order(epoch: 'desc').first
      if (thread_res_count.present?) then
        prev_count = thread_res_count.new_cnt
        prev_epoch = thread_res_count.epoch
        # calc thread speed
        diff_sec = epoch - prev_epoch
        diff_cnt = thread.res_cnt - prev_count
        thread.res_added = diff_cnt
        thread.res_speed = (diff_cnt.to_f / diff_sec.to_f) * 3600
        thread.save! #TODO: duplicated call
        if (thread.res_cnt > thread_res_count.new_cnt) then
          thread_res_count = ThreadResCount.new
          thread_res_count.thread_id = thread.id
          thread_res_count.new_cnt = thread.res_cnt
          thread_res_count.epoch = epoch
          thread_res_count.save!
        end
      else
        thread_res_count = ThreadResCount.new
        thread_res_count.thread_id = thread.id
        thread_res_count.new_cnt = thread.res_cnt
        thread_res_count.epoch = epoch
        thread_res_count.save!
      end
    end

    #########################################################################

    def self.boards_proc_res_count(epoch, board)
      board_res_count =
        BoardResCount.where(board_id: board.id).order(epoch: 'desc').first
      if (board_res_count.present?) then
        prev_epoch = board_res_count.epoch
        # calc board speed
        diff_sec = epoch - prev_epoch
        board.res_speed = (board.res_added.to_f / diff_sec.to_f) * 3600
        board.save! #TODO: duplicated call
      end
      board_res_count = BoardResCount.new
      board_res_count.board_id = board.id
      board_res_count.new_cnt = board.res_added
      board_res_count.epoch = epoch
      board_res_count.save!
    end

    #########################################################################
    
    def self.threads(board_name)
      puts "Start threads: #{board_name}"
      epoch = Time.now.to_i
      now = Time.now
      board = Board.find_by(name: board_name)
      if (board.nil?) then
        puts "Board not found: #{board_name}."
        return
      end
      board.mirror_ver = board.mirror_ver.to_d + 1
      #unless (board.mirror) then
      #  puts "Board is set to be UN-mirrored: #{board_name}."
      #  return
      #end
      server = Server.find_by(id: board.server_id)
      if (server.nil?) then
        puts "Server not found: id:#{board.server_id}."
        return
      end
      unless (server.mirror) then
        puts "Server is set to be UN-mirrored: #{server_name}."
        return
      end
      url = "https://#{server.name}/#{board_name}/subback.html"
      charset = nil
      html = URI.open(url, "r:binary") do |f|
        charset = f.charset; f.read
      end
      mirror_order = 0
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
            res_cnt = $2
            thread = Thread.where(board_id: board.id, tid: tid).first
            if (thread.blank?) then
              thread = Thread.new
              thread.board_id = board.id
              thread.tid = tid.to_d
              thread.title = title
            end
            mirror_order += 1
            thread.mirror_order = mirror_order
            thread.res_cnt = res_cnt.to_d
            thread.mirror_ver = board.mirror_ver
            thread.mirrored_at = now
            thread.save!
            threads_proc_res_count(epoch, thread) # ==> sub
          end
        end
      end
      # TODO: when db exception occurs
      board.mirrored_at = now
      board.save!
      puts "End threads: #{board_name}"
    end
    
    #########################################################################
    
    def self.calc(board_name)
      puts "Start calc: #{board_name}"
      board = Board.find_by(name: board_name)
      if (board.nil?) then
        puts "Board not found: #{board_name}."
        return
      end
      board_res_added = 0
      Thread.where(board_id: board.id,
      mirror_ver: board.mirror_ver).each do | thread |
        if (thread.res_added) then
          board_res_added += thread.res_added
        end
      end
      board.res_added = board_res_added
      board.save!
      epoch = Time.now.to_i
      boards_proc_res_count(epoch, board)
      Thread.where(board_id: board.id,
      mirror_ver: board.mirror_ver).each do | thread |
        if (thread.res_added.present? && board_res_added > 0) then
          thread.res_percent = thread.res_added.to_f / board_res_added.to_f
          thread.save!
        end
      end
      puts "End calc: #{board_name}"
    end

    #########################################################################

    def self.test3

      #servers_and_boards

      Board.all.each do |board|
        threads(board.name)
      end

      Board.all.each do |board|
        calc(board.name)
      end

    end

    #########################################################################

  end
end