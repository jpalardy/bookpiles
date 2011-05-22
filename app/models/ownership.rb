class Ownership < ActiveRecord::Base
  belongs_to :user
  belongs_to :book
  has_many :events

  before_save :update_moved_at

  validates_presence_of   :user, :book, :status
  validates_inclusion_of  :status,  :in => Status.all
  validates_uniqueness_of :book_id, :scope => :user_id
  validates_length_of     :notes,   :maximum => 5000

  def as_json(options=nil)
    book.as_json.merge(:status => status, :notes => notes.to_s)
  end

  private
    def update_moved_at
      self.moved_at = Time.now if status_changed?
    end
end
