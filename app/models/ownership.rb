class Ownership < ActiveRecord::Base
  belongs_to :user
  belongs_to :book
  has_many :events

  scope :recent, order("updated_at desc")

  validates_presence_of   :user, :book, :status, :isbn
  validates_inclusion_of  :status, :in => Status.all
  validates_uniqueness_of :book_id, :scope => :user_id, :message => "is already in your books"

  def as_json(options=nil)
    book.as_json.merge(:status => status)
  end
end
