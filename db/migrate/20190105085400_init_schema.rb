# encoding: UTF-8
# frozen_string_literal: true

class InitSchema < ActiveRecord::Migration[4.2]

    def up

      create_table "servers", force: :cascade do |t|
        t.string   "name", limit: 255
        t.string   "title", limit: 2047
        t.boolean  "mirror", default: true
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "servers", ["name"], name: "index_servers_1", unique: true
      add_index "servers", ["mirror"], name: "index_servers_2"

      create_table "boards", force: :cascade do |t|
        t.integer  "server_id"
        t.string   "name", limit: 255
        t.string   "title", limit: 2047
        t.boolean  "mirror", default: false
        t.integer  "mirror_ver"
        t.datetime "mirrored_at"
        t.integer  "res_added"
        t.integer  "res_speed"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "boards", ["name"], name: "index_boards_1", unique: true
      add_index "boards", ["mirror"], name: "index_boards_2"

      create_table "threads", force: :cascade do |t|
        t.integer  "board_id"
        t.integer  "tid"
        t.string   "title", limit: 2047
        t.integer  "mirror_ver"
        t.integer  "mirror_order"
        t.datetime "mirrored_at"
        t.integer  "res_cnt"
        t.integer  "res_added"
        t.integer  "res_speed"
        t.float    "res_percent"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "threads", ["board_id", "tid"], name: "index_threads_1", unique: true
      add_index "threads", ["board_id", "mirror_ver"], name: "index_threads_2"
    
      create_table "thread_res_counts", force: :cascade do |t|
        t.integer  "thread_id"
        t.integer  "epoch"
        t.integer  "new_cnt"
      end
      add_index "thread_res_counts", ["thread_id", "epoch"], name: "index_thread_res_counts_1", unique: true

      create_table "board_res_counts", force: :cascade do |t|
        t.integer  "board_id"
        t.integer  "epoch"
        t.integer  "new_cnt"
      end
      add_index "board_res_counts", ["board_id", "epoch"], name: "index_board_res_counts_1", unique: true

    end

    def down
    
      raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
    
    end
  
  end