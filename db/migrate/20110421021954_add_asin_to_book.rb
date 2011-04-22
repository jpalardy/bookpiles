class AddAsinToBook < ActiveRecord::Migration
  def self.up
    remove_index :books, :isbn

    add_column :books, :asin, :string
    add_index  :books, :asin
  end

  def self.down
    remove_index  :books, :asin
    remove_column :books, :asin
  end
end
