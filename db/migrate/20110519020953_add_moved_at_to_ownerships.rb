class AddMovedAtToOwnerships < ActiveRecord::Migration
  def self.up
    add_column    :ownerships, :moved_at, :timestamp

    Ownership.update_all("moved_at = updated_at")

    change_column :ownerships, :moved_at, :timestamp, :null => false
  end

  def self.down
    remove_column :ownerships, :moved_at
  end
end
