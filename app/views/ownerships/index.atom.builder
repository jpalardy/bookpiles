atom_feed do |feed|
  feed.title "#{@user.username}'s events"
  feed.updated(@events.empty? ? Time.now : @events.first.created_at)

  @events.each do |event|
    feed.entry(event, :url => ownerships_url(@user.username, :anchor => event.status)) do |entry|
      entry.title "[#{event.status}] #{event.ownership.book.title}"
      entry.content render(:partial => "book.html", :locals => {:book => event.ownership.book, :user => @user, :status => event.status}), :type => 'html'
      entry.author { |author| author.name @user.username }
    end
  end
end
