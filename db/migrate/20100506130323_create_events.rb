class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events do |t|
      t.string :status,        :null => false
      t.integer :user_id,      :null => false
      t.integer :ownership_id, :null => false

      t.datetime :created_at
    end
  end

  def self.down
    drop_table :events
  end
end
