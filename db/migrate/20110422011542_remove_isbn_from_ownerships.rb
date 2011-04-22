class RemoveIsbnFromOwnerships < ActiveRecord::Migration
  def self.up
    remove_column :ownerships, :isbn
    remove_index  :ownerships, [:user_id, :isbn]
  end

  def self.down
    add_column :ownerships, :isbn, :string
    add_index  :ownerships, [:user_id, :isbn]
  end
end
