class MakeAsinNonNull < ActiveRecord::Migration
  def self.up
    Ownership.update_all("book_id = 235", "book_id = 1446")
    Book.destroy(1446)

    Ownership.update_all("book_id = 53", "book_id = 1442")
    Book.destroy(1442)

    Ownership.update_all("book_id = 247", "book_id = 1460")
    Book.destroy(1460)

    Ownership.update_all("book_id = 369", "book_id = 1464")
    Book.destroy(1464)

    Ownership.update_all("book_id = 508", "book_id = 1432")
    Book.destroy(1432)

    Ownership.update_all("book_id = 304", "book_id = 1440")
    Book.destroy(1440)

    Ownership.update_all("book_id = 300", "book_id = 1477")
    Book.destroy(1477)

    Ownership.update_all("book_id = 1032", "book_id = 1453")
    Book.destroy(1453)

    Ownership.update_all("book_id = 55", "book_id = 1476")
    Book.destroy(1476)

    Ownership.update_all("book_id = 492", "book_id = 1424")
    Book.destroy(1424)

    Ownership.update_all("book_id = 81", "book_id = 1439")
    Book.destroy(1439)

    Ownership.update_all("book_id = 119", "book_id = 1437")
    Book.destroy(1437)

    Ownership.update_all("book_id = 15", "book_id = 1465")
    Book.destroy(1465)

    Ownership.update_all("book_id = 169", "book_id = 1463")
    Book.destroy(1463)

    Ownership.update_all("book_id = 111", "book_id = 1469")
    Book.destroy(1469)

    Ownership.update_all("book_id = 556", "book_id = 1445")
    Book.destroy(1445)

    Ownership.update_all("book_id = 535", "book_id = 1444")
    Book.destroy(1444)

    Ownership.update_all("book_id = 900", "book_id = 1456")
    Book.destroy(1456)

    Ownership.update_all("book_id = 926", "book_id = 1461")
    Book.destroy(1461)

    change_column :books, :asin, :string, :null => false
  end

  def self.down
    change_column :books, :asin, :string
  end
end
