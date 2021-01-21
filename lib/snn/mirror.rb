require 'kconv'
require 'open-uri'

module Snn

  class Mirror

    include FiveCh
    
    #########################################################################
    @@inproper_words = [
      # セックス・下品
      "セックス", "マンコ", "チンコ","オメコ", "レイプ","チンチン","ポコチン",
      "せっくす", "まんこ", "ちんこ", "おめこ", "れいぷ","ちんちん","ぽこちん",
      "嬲", "姦", "性交", "性行", "女暴", "犯す", "犯せ", "犯そ", "犯さ", "犯し",
      "児ポ", "ロリコン", "ポルノ", "炉利","膣","尻穴","陰部", "陰唇",
      "ケツ毛","マン毛","パイ毛","チン毛","モロ出","陰毛","まぐわう","まぐわい",
      "クリトリス","チンポ","ペニス","陵辱","凌辱","辱める","SMプレイ",
      "肉棒","勃起","射精","ザーメン","性的","性奴","即尺","素股",
      "SEX", "sex", "体位","アナル","自慰","マスターベーション",
      "ラブホテル","ラブホ", "クンニ", "フェラ","まんぐり","ホテヘル",
      "ラブドール","ダッチワイフ","オナホール","オナホ","デリヘル","包茎","性器","乱交",
      "おしり", "お尻", "巨乳", "爆乳", "貧乳", "お乳","乳首","下乳",
      "肛門", "金玉", "きんたま", "キンタマ", "たまきん","タマキン",
      "童貞","馬鹿","ファック","処女","足コキ","イメクラ","顔射","顔面騎乗","騎乗位",
      "口内発射","玉舐め","ローションプレイ",
      "乳房", "おっぱい", "オッパイ", "パイオツ", "ノーブラ","手コキ","手マン",
      "孕む", "孕め", "セクハラ","オナニー","オナ猿","アダルト",
      "中出し", "中だし", "調教", "腐女", "痴", "変態","雌豚", "牝豚",
      "にっかつ", "鬼畜","リョナ", "パンティー", "ブラジャー", "パンツ", "下着泥",
      "糞", "うんこ", "ウンコ", "ウンチ", "うんち", "大便", "小便","便器","下痢便",
      "オシッコ", "おしっこ", "尿", "排便", "排泄", "スカトロ","女子トイレ",
      "ヌード", "裸","露出","覗き", "盗撮", "音量注意", "エロゲ",
      "おなら", "屁", "下卑", "ハーレム", "風俗", "ニューハーフ", "オカマ",
      "人妻", "熟女", "パイズリ", "センズリ","ナンパ","セクキャバ","ピンサロ","ソープ",
      "股間","拉致監", "売春","買春","緊縛","パイパン","みだら","風★",
      # 暴力
      "殺そ", "殺す", "殺せ", "死ね", "氏ね", "師ね",
      # 政治、宗教
      "アメ公","イタ公","穢多","露助",
      "大麻", "覚醒剤", "コカイン", "ヘロイン","麻薬","キムチ臭",
      "気違い","マンセー", "厨", "池沼","火病",
      "ヘイト", "在日", "鮮人", "総連", "民団","民譚","尊師","ダーキニー",
      "キチガイ", "支那", "土人",  "アル中","乞食","きちがい","基地外",
      "かたわ","あんま", "あん摩", "按摩","片輪","カタワ",
      "部落", "解放同盟", "解同","アレフ", "創価学", "空耳", "ファビョ", "淫", "野獣", "煽",
      "天安門", "反日", "ネトウヨ", "ニダ",
      "トンスル", "特ア", "特定アジア", "南京", "大虐殺",
      "嫌韓", "五毛", "汚鮮", "汚沢",
    ]
    def self.set_inproper
      puts "Thread total=#{Thread.all.count}"
      ac = 0
      tc = 0
      Thread.all.each do | thread |
        @@inproper_words.each do |word|
          if (thread.title.include?(word)) then
            ac += 1
            print "#{ac} "
            thread.inproper = 1
            thread.save!
            break
          end
        end
        tc += 1
        if (tc % 1000 == 0) then
          print "\nThread count=#{tc}\n"
        end
      end
      print "\n"
      puts "Total=#{Thread.all.count},Banned=#{ac}"
    end
      
    def self.reset_inproper
      puts "Thread total=#{Thread.all.count}"
      ac = 0
      Thread.all.each do | thread |
        ac += 1
        if (ac % 100 == 0) then
          print "#{ac} "
        end
        thread.inproper = 0
        thread.save!
      end
      print "\n"
      puts "Total=#{Thread.all.count}"
    end

    def self.is_inproper(title)
      #@@inproper_words.each do |word|
      #  if (title.include?(word)) then
      #    return true
      #  end
      #end
      false 
    end

    #########################################################################

    @@default_mirrored_boards = [
      "newsplus",
      "mnewsplus", "news4plus",
      "bizplus", "seijinewsplus", "news5plus",
      "scienceplus", "femnewsplus", "moeplus",
      "idolplus", "dqnplus"
    ]

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
            board.prev_epoch = 0
            board.res_added = 0
            board.res_speed = 0
            board.save!
          end
        end
      end
      puts "End servers_and_boards"

    end

    #########################################################################

    @@overwrite_mirrored_board_names = [
      { name: "newsplus", title: "ニュー速"},
      { name: "mnewsplus", title: "芸スポ"},
      { name: "news4plus", title: "東アジア"},
      { name: "bizplus", title: "ビジネス"},
      { name: "seijinewsplus", title: "政治"},
      { name: "news5plus", title: "国際"},
      { name: "scienceplus", title: "科学"},
      { name: "femnewsplus", title: "ローカル"},
      { name: "moeplus", title: "萌え"},
      { name: "idolplus", title: "アイドル"},
      { name: "dqnplus", title: "痛い"},
    ]

    def self.overwrite_board_names
      puts "Start overwrite_board_names"
      Board.all.each do | board |
        overwrite_title = @@overwrite_mirrored_board_names
            .find{|b| b[:name]==board.name}[:title]
        if (overwrite_title.present?) then
          puts "Renamed from '#{board.title}' to '#{overwrite_title}'"
          board.title = overwrite_title
          board.save!
        end
      end
      puts "End overwrite_board_names"
    end

    #########################################################################

    def self.threads_proc_res_count(epoch, thread)
      if (thread.prev_epoch != 0 &&
          thread.prev_res_cnt < thread.res_cnt) then
        diff_sec = epoch - thread.prev_epoch
        diff_cnt = thread.res_cnt - thread.prev_res_cnt
        speed = (diff_cnt.to_f / diff_sec.to_f) * 3600.0
        thread.res_speed_max = [speed, thread.res_speed].max
        thread.res_speed = speed
        thread.prev_res_cnt = thread.res_cnt
        thread.prev_epoch = epoch
      elsif (thread.prev_epoch == 0) then
        thread.prev_res_cnt = thread.res_cnt
        thread.prev_epoch = epoch
      end
    end

    #########################################################################

    def self.boards_proc_res_count(epoch, board)
      if (board.prev_epoch != 0) then
        diff_sec = epoch - board.prev_epoch
        speed = (board.res_added.to_f / diff_sec.to_f) * 3600.0
        board.res_speed = speed
        board.prev_epoch = epoch
      end
      board.prev_epoch = epoch
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
          if (title.include?("スレッド")) then
            if (title.include?("作成")) then
              puts ("Skipped:" + title)
              next
            end
            if (title.include?("依頼")) then
              puts ("Skipped:" + title)
              next
            end
          end
          if (title.match('^(.+) \((\d+)\)$')) then
            title = $1
            res_cnt = $2
            thread = Thread.where(board_id: board.id, tid: tid).first
            if (thread.blank?) then
              thread = Thread.new
              thread.board_id = board.id
              thread.tid = tid.to_d
              thread.title = title
              thread.prev_epoch = 0
              thread.prev_res_cnt = 0
              thread.res_cnt = 0
              thread.res_added = 0
              thread.res_percent = 0
              thread.res_speed = 0
              thread.res_speed_max = 0
              thread.inproper = 0
              if (is_inproper(title)) then
                thread.inproper = 1
              end
            else
              thread.res_added = (res_cnt.to_d - thread.res_cnt)
            end
            mirror_order += 1
            thread.mirror_order = mirror_order
            thread.res_cnt = res_cnt.to_d
            thread.mirror_ver = board.mirror_ver
            thread.mirrored_at = now
            threads_proc_res_count(epoch, thread) # ==> sub
            thread.save!
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
      epoch = Time.now.to_i
      boards_proc_res_count(epoch, board)
      board.save!
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

      if (Server.all.count <= 0) then
        servers_and_boards
        overwrite_board_names
      end

      now = Time.now
      Board.all.each do |board|
        exec_flg = false
        if (board.mirrored_at.nil?) then
          diff = 1800
        else
          diff = (now - board.mirrored_at).to_i
        end
        #puts "#{exec_flg} #{diff}"
        if ((board.name == 'newsplus') && (diff >= 120)) then
          exec_flg = true
        elsif ((board.name == 'mnewsplus') && (diff >= 180)) then
          exec_flg = true
        elsif ((board.name == 'news4plus') && (diff >= 240)) then
          exec_flg = true
        elsif ((board.name == 'bizplus') && (diff >= 600)) then
          exec_flg = true
        elsif ((board.name == 'seijinewsplus') && (diff >= 600)) then
          exec_flg = true
        elsif ((board.name == 'news5plus') && (diff >= 900)) then
          exec_flg = true
        elsif ((board.name == 'scienceplus') && (diff >= 900)) then
          exec_flg = true
        elsif ((board.name == 'femnewsplus') && (diff >= 900)) then
          exec_flg = true
        elsif ((board.name == 'moeplus') && (diff >= 900)) then
          exec_flg = true
        elsif ((board.name == 'idolplus') && (diff >= 900)) then
          exec_flg = true
        elsif ((board.name == 'dqnplus') && (diff >= 900)) then
          exec_flg = true
        else
          #
        end
        #puts "#{board.name} #{diff} #{exec_flg}"
        if (exec_flg) then
          threads(board.name)
          calc(board.name)
        end
      end

    end

    #########################################################################

  end
end