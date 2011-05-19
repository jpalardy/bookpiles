class AddNotesToOwnership < ActiveRecord::Migration
  def self.up
    add_column    :ownerships, :notes, :text
  end

  def self.down
    remove_column :ownerships, :notes
  end
end
