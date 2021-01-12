class CreateSupports < ActiveRecord::Migration[4.2]
    def self.up
      create_table :supports do |t|
        t.string   :unique_id
        t.string   :sup_type
        t.string   :board_name
        t.string   :tid
        t.text     :extra_info
        t.datetime :created_at, null: false
        t.datetime :updated_at, null: false
      end
    end
  
    def self.down
      drop_table :supports
    end
  end