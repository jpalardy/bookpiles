class User < ActiveRecord::Base
  has_many :ownerships
  has_many :events

  validates_presence_of   :username, :openid
  validates_length_of     :username, :in => 4..32
  validates_format_of     :username, :with => /\A[a-z_][a-z_0-9]*\Z/i
  validates_uniqueness_of :username
end
