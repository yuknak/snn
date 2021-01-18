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

ActiveRecord::Schema.define(version: 2021_01_18_071405) do

  create_table "boards", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "server_id"
    t.string "name"
    t.string "title", limit: 2047
    t.boolean "mirror", default: false
    t.integer "mirror_ver"
    t.datetime "mirrored_at"
    t.integer "prev_epoch"
    t.integer "res_added"
    t.float "res_speed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_boards_1", unique: true
  end

  create_table "crono_jobs", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "job_id", null: false
    t.text "log", size: :long
    t.datetime "last_performed_at"
    t.boolean "healthy"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_id"], name: "index_crono_jobs_on_job_id", unique: true
  end

  create_table "servers", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.string "title", limit: 2047
    t.boolean "mirror", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_servers_1", unique: true
  end

  create_table "supports", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "unique_id"
    t.string "sup_type"
    t.string "board_name"
    t.string "tid"
    t.text "extra_info"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "threads", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "board_id"
    t.integer "tid"
    t.string "title", limit: 2047
    t.integer "mirror_ver"
    t.integer "mirror_order"
    t.datetime "mirrored_at"
    t.integer "prev_epoch"
    t.integer "prev_res_cnt"
    t.integer "res_cnt"
    t.integer "res_added"
    t.float "res_speed"
    t.float "res_speed_max"
    t.float "res_percent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "inproper", default: 0, null: false
    t.index ["board_id", "mirror_ver", "res_speed"], name: "index_threads_2"
    t.index ["board_id", "tid"], name: "index_threads_1", unique: true
    t.index ["tid", "res_speed_max"], name: "index_threads_3"
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "ip"
    t.string "ip_country"
    t.string "application_name"
    t.string "brand"
    t.string "bundle_id"
    t.string "build_number"
    t.string "device_id"
    t.string "device_type"
    t.string "readable_version"
    t.string "system_name"
    t.string "system_version"
    t.string "unique_id"
    t.string "version"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["unique_id"], name: "index_users_1", unique: true
  end

end
