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
        t.datetime "mirrored_at"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "boards", ["name"], name: "index_boards_1", unique: true
      add_index "boards", ["mirror"], name: "index_boards_2"

      create_table "threads", force: :cascade do |t|
        t.integer  "board_id"
        t.integer  "tid"
        t.string   "title", limit: 2047
        t.integer  "res_count"
        t.datetime "mirrored_at"
        t.datetime "created_at", null: false
        t.datetime "updated_at", null: false
      end
      add_index "threads", ["board_id", "tid"], name: "index_threads_1", unique: true
      add_index "threads", ["board_id", "res_count"], name: "index_threads_2"
    
    end

    def down
    
      raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
    
    end
  
  end