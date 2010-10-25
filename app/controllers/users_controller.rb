class UsersController < ApplicationController
  def create
    username = params[:username]
    openid = params[:openid]

    user = User.new(:username => username, :openid => openid)

    unless user.valid?
      flash[:error] = user.errors.full_messages.first
      redirect_back_or_default root_path
      return
    end

    # will be used to actually create the user on the way back
    session[:picked_username] = username

    begin
      request = openid_consumer.begin(user.openid)
    rescue
      flash[:error] = 'Invalid OpenID URL.'
      redirect_back_or_default root_path
      return
    end

    if request.send_redirect?(root_url, complete_openid_url)
      redirect_to request.redirect_url(root_url, complete_openid_url)
      return
    end
  end
end
