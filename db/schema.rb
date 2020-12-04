# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_01_05_085400) do

  create_table "board_res_counts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "board_id"
    t.integer "epoch"
    t.integer "new_cnt"
    t.index ["board_id", "epoch"], name: "index_board_res_counts_1", unique: true
  end

  create_table "boards", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "server_id"
    t.string "name"
    t.string "title", limit: 2047
    t.boolean "mirror", default: false
    t.integer "mirror_ver"
    t.datetime "mirrored_at"
    t.integer "res_added"
    t.integer "res_speed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["mirror"], name: "index_boards_2"
    t.index ["name"], name: "index_boards_1", unique: true
  end

  create_table "servers", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "title", limit: 2047
    t.boolean "mirror", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["mirror"], name: "index_servers_2"
    t.index ["name"], name: "index_servers_1", unique: true
  end

  create_table "thread_res_counts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "thread_id"
    t.integer "epoch"
    t.integer "new_cnt"
    t.index ["thread_id", "epoch"], name: "index_thread_res_counts_1", unique: true
  end

  create_table "threads", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "board_id"
    t.integer "tid"
    t.string "title", limit: 2047
    t.integer "mirror_ver"
    t.datetime "mirrored_at"
    t.integer "res_cnt"
    t.integer "res_added"
    t.integer "res_speed"
    t.float "res_percent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id", "mirror_ver"], name: "index_threads_2"
    t.index ["board_id", "tid"], name: "index_threads_1", unique: true
  end

end
