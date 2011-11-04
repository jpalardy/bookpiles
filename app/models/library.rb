class Library
  def self.books_by_query(query, page)
    Rails.logger.info "**** amazon: #{query}"
    results = Amazon::Ecs.item_search(query, :response_group => 'Medium', :item_page => page, :search_index => "Books")

    results.items.map do |result|
      book = Book.new        :title => result.get('ItemAttributes/Title'),
                           :authors => result.get_array('ItemAttributes/Author').join(', '),
                              :isbn => result.get('ItemAttributes/ISBN'),
                              :asin => result.get('ASIN'),
                             :pages => result.get('ItemAttributes/NumberOfPages').to_i,
                      :published_on => result.get('ItemAttributes/PublicationDate'),
                  :amazon_image_url => result.get('MediumImage/URL')

      Rails.logger.info "book: #{book.to_json}"

      book.authors      = '-' if book.authors.blank?
      book.published_on = '-' if book.published_on.blank?
      book
    end.reject { |book| [book.isbn, book.asin, book.image_url].any?(&:nil?) }
  end

  def self.book_by_asin(asin)
    books_by_query(asin, 1).detect {|book| book.asin == asin}
  end
end
