class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'application'

  protected
    helper_method :logged_in?, :current_user

    def logged_in?
      session[:id] != nil
    end

    def current_user
      @current_user ||= User.find(session[:id]) if logged_in?
    end

    def openid_consumer
      @openid_consumer ||= OpenID::Consumer.new(session, OpenID::Store::Filesystem.new("#{Rails.root}/tmp/openid"))
    end

    def redirect_back_or_default(default)
      redirect_to(request.referer || default)
    end

    # if flash.empty? is there to deal with situations such as
    # /amazon/books -> logout -> /amazon/books -> root
    # (double redirects)
    def must_be_logged_in
      if current_user.nil?
        if flash.empty?
          flash[:notice] = "You must login first."
        else
          flash.keep
        end

        redirect_to root_path
      end
    end
end
