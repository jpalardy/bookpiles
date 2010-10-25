class CreateBooks < ActiveRecord::Migration
  def self.up
    create_table :books do |t|
      t.string  :title,            :null => false
      t.string  :authors,          :null => false
      t.string  :isbn,             :null => false
      t.string  :s3_image_url,     :null => false
      t.string  :amazon_image_url, :null => false
      t.string  :published_on,     :null => false
      t.integer :pages,            :null => false, :default => 0

      t.timestamps
    end
  end

  def self.down
    drop_table :books
  end
end
