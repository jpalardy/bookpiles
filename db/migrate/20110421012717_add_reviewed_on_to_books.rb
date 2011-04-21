class AddReviewedOnToBooks < ActiveRecord::Migration
  def self.up
    add_column :books, :reviewed_on, :date

    Book.update_all ["reviewed_on = ?", Date.today]
  end

  def self.down
    remove_column :books, :reviewed_on
  end
end
