module Services
  def self.add_book(user, asin, status)
    book = Book.where(:asin => asin).first || amazon_find_one_book(asin)

    if book.nil?
      return [:error, "Book was not found."]
    end

    if book.new_record?
      book.s3_image_url = cache_on_s3(book.image_url, book.asin)
    end

    Ownership.transaction do
      ownership = user.ownerships.build(:user => user, :book => book, :status => status)
      if ownership.save
        user.events.create(:status => status, :ownership => ownership)
      else
        type, message = ownership.errors.first

        case type
        when :book_id
          ownership = user.ownerships.where(:book_id => book.id).first
          return [:notice, "Book already in #{ownership.status.inspect}."]
        when :status
          return [:error, "Invalid pile: #{status}."]
        else
          return [:error, "Could not add book."]
        end
      end
    end

    return [:success, "Book added to #{status.inspect}."]
  end

  def self.update_book(user, asin, status)
    book = Book.where(:asin => asin).first
    ownership = user.ownerships.where(:book_id => book.id).first

    if ownership.nil?
      return [:error, "Book was not found."]
    end

    Ownership.transaction do
      ownership.status = status
      if !ownership.changed?
        return [:notice, "Book already in #{status.inspect}."]
      end

      if ownership.save
        user.events.create(:status => status, :ownership => ownership)
      else
        type, message = ownership.errors.first

        case type
        when :status
          return [:error, "Invalid pile: #{status}."]
        else
          return [:error, "Could not move book."]
        end
      end
    end

    return [:success, "Book moved to #{status.inspect}."]
  end

  def self.delete_book(user, asin)
    book = Book.where(:asin => asin).first
    ownership = user.ownerships.where(:book_id => book.id).first

    if ownership.nil?
      return [:error, "Book was not found."]
    end

    events = ownership.events

    Ownership.transaction do
      ownership.destroy
      events.each(&:destroy)
    end

    return [:success, "Book deleted."]
  end

  def self.cache_on_s3(image_url, asin)
    ext = File.extname(image_url)
    filename = "#{asin}#{ext}"
    filename_with_path = File.join(*[S3_PREFIX, filename].compact)

    unless AWS::S3::S3Object.exists?(filename, S3_BUCKET)
      open(image_url) do |image|
        AWS::S3::S3Object.store(filename_with_path, image, S3_BUCKET, :access => :public_read, :cache_control => "max-age=2592000")
      end
    end

    # Cloudfront: the location where I put the file might have a Cloudfront URL, check config
    File.join(S3_ASSET_URL, filename)
  end

  def self.amazon_find_all_books(query, page)
    books = Library.books_by_query(query, page)

    books.each do |book|
      Rails.cache.write("amazon:book:#{book.asin}", book.to_json)
    end

    books
  end

  def self.amazon_find_one_book(asin)
    json = Rails.cache.fetch("amazon:book:#{asin}") do
      Library.book_by_asin(asin).to_json
    end

    begin
      Book.new(JSON.parse(json))
    rescue JSON::ParserError
      nil
    end
  end
end
