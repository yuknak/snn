class CreateUsers < ActiveRecord::Migration[4.2]
    def self.up
      create_table :users do |t|
        t.string   :ip
        t.string   :ip_country
        t.string   :application_name
        t.string   :brand
        t.string   :bundle_id
        t.string   :build_number
        t.string   :device_id
        t.string   :device_type
        t.string   :readable_version
        t.string   :system_name
        t.string   :system_version
        t.string   :unique_id
        t.string   :version
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end
      add_index :users, [:unique_id], name: :index_users_1, unique: true
    end
  
    def self.down
      drop_table :users
    end
  end