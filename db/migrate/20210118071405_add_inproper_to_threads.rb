class AddInproperToThreads < ActiveRecord::Migration[6.0]
  def change
    add_column :threads, :inproper, :integer, default: 0, null: false
  end
end
