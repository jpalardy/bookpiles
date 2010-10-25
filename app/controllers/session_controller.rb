class SessionController < ApplicationController
  def create
    if params[:username].blank?
      flash[:error] = "Please enter your username."
      redirect_back_or_default root_path
      return
    end

    user = User.where(:username => params[:username]).first

    unless user
      flash[:error] = "User #{params[:username].inspect} does not exist."
      redirect_back_or_default root_path
      return
    end

    request = openid_consumer.begin(user.openid)

    if request.send_redirect?(root_url, complete_openid_url)
      redirect_to request.redirect_url(root_url, complete_openid_url)
    end
  end

  def complete
    response = openid_consumer.complete(params.reject{ |k,v| request.path_parameters[k.to_sym] }, complete_openid_url)

    if response.status == OpenID::Consumer::SUCCESS
      user = User.where(:openid => response.identity_url).first

      unless user
        if session[:picked_username]
          user = User.create(:username => session[:picked_username], :openid => response.identity_url)
          flash[:success] = "Created user #{user.username.inspect}."
        else
          flash[:error] = "No user associated with that OpenID account."
          redirect_to home_path
          return
        end
      end

      session[:id] = user.id
      flash[:success] ||= 'Logged in.'
      redirect_to ownerships_path(user.username)
      return
    end

    flash[:error] = 'Could not log on with your OpenID.'
    redirect_to root_path
  end

  def destroy
    redirect_back_or_default root_path
    reset_session

    flash[:success] = 'Logged out.'
  end
end
