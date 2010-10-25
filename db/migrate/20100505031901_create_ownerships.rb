class CreateOwnerships < ActiveRecord::Migration
  def self.up
    create_table :ownerships do |t|
      t.integer :user_id, :null => false
      t.integer :book_id, :null => false
      t.string  :status,  :null => false
      t.string  :isbn,    :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :ownerships
  end
end
