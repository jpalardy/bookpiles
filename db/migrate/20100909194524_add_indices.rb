class AddIndices < ActiveRecord::Migration
  def self.up
    change_table :books do |t|
      t.index :isbn
    end

    change_table :users do |t|
      t.index :openid
      t.index :username
    end

    change_table :ownerships do |t|
      t.index [:user_id, :isbn]
    end

    change_table :events do |t|
      t.index [:user_id, :status]
    end
  end

  def self.down
    change_table :books do |t|
      t.remove_index :isbn
    end

    change_table :users do |t|
      t.remove_index :openid
      t.remove_index :username
    end

    change_table :ownerships do |t|
      t.remove_index [:user_id, :isbn]
    end

    change_table :events do |t|
      t.remove_index [:user_id, :status]
    end
  end
end
