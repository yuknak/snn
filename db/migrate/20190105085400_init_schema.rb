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

      create_table "boards", force: :cascade do |t|
        t.integer  "server_id"
        t.string   "name", limit: 255
        t.string   "title", limit: 2047
        t.boolean  "mirror", default: false
        t.integer  "mirror_ver"
        t.datetime "mirrored_at"
        t.integer  "prev_epoch"
        t.integer  "res_added"
        t.float    "res_speed"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "boards", ["name"], name: "index_boards_1", unique: true

      create_table "threads", force: :cascade do |t|
        t.integer  "board_id"
        t.integer  "tid"
        t.string   "title", limit: 2047
        t.integer  "mirror_ver"
        t.integer  "mirror_order"
        t.datetime "mirrored_at"
        t.integer  "prev_epoch"
        t.integer  "prev_res_cnt"
        t.integer  "res_cnt"
        t.integer  "res_added"
        t.float    "res_speed"
        t.float    "res_speed_max"
        t.float    "res_percent"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "threads", ["board_id", "tid"], name: "index_threads_1", unique: true
      add_index "threads", ["board_id", "mirror_ver", "res_speed"], name: "index_threads_2"
      add_index "threads", ["tid", "res_speed_max"], name: "index_threads_3"

    end

    def down
    
      raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
    
    end
  
  end