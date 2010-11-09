class Library
  def self.books_by_query(query, page)
    Rails.logger.info "**** amazon: #{query}"
    results = Amazon::Ecs.item_search(query, :response_group => 'Medium', :item_page => page, :search_index => "Books")

    results.items.map do |result|
      book = Book.new        :title => result.get('title'),
                           :authors => result.get_array('author').join(', '),
                              :isbn => result.get('isbn'),
                             :pages => result.get('numberofpages').to_i,
                      :published_on => result.get('publicationdate').to_s,
                  :amazon_image_url => result.get_hash('mediumimage').andand[:url]

      Rails.logger.info "book: #{book.to_json}"

      book.authors = '-' if book.authors.blank?
      book
    end.reject { |book| book.isbn.nil? || book.image_url.nil? }
  end

  def self.book_by_isbn(isbn)
    books_by_query(isbn, 1).find {|book| book.isbn == isbn}
  end
end
