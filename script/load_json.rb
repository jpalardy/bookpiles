
json = JSON.parse(File.read("/tmp/booklife.json"))

#-------------------------------------------------

json["users"].each do |user|
  User.create(user)
end

json["books"].each do |book|
  Book.create(book.merge(:amazon_image_url => book.delete("image_url")))
end

json["ownerships"].each do |ownership|
  book_id = Book.where(:isbn => ownership["isbn"]).first.id
  user_id = User.where(:username => ownership.delete("username")).first.id

  Ownership.create(ownership.merge(:book_id => book_id, :user_id => user_id))
end

json["events"].each do |event|
  user_id = User.where(:username => event.delete("username")).first.id
  ownership_id = Ownership.where(:user_id => user_id, :isbn => event.delete("isbn")).first.id

  Event.create(event.merge(:ownership_id => ownership_id, :user_id => user_id))
end
