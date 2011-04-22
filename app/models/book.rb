class Book < ActiveRecord::Base
  has_many :ownerships

  validates_presence_of   :title, :authors, :isbn, :asin, :amazon_image_url, :published_on, :pages
  validates_uniqueness_of :asin

  def image_url
    s3_image_url || amazon_image_url
  end

  def image_url=(url)
    self.amazon_image_url = url
  end

  def as_json(options=nil)
    { :isbn         => isbn,
      :asin         => asin,
      :title        => title,
      :image_url    => image_url,
      :authors      => authors,
      :pages        => pages,
      :published_on => published_on }
  end
end
