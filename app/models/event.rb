class Event < ActiveRecord::Base
  belongs_to :user
  belongs_to :ownership

  scope :recent, order("created_at desc")

  validates_presence_of   :user, :ownership, :status
  validates_inclusion_of  :status, :in => Status.all
end
