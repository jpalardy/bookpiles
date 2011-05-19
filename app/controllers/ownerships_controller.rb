class OwnershipsController < ApplicationController
  before_filter :get_user
  before_filter :check_user, :except => [:index]

  def index
    respond_to do |format|
      format.html
      format.json do
        ownerships = @user.ownerships.recent.includes(:book)
        render :json => ownerships.all
      end
      format.atom do
        @events = @user.events.recent.limit(params[:limit] || 20).includes(:ownership => [:book])
        @events = @events.where(:status => params[:statuses]) if params[:statuses]
        @events = @events.all
      end
    end
  end

  def create
    status, message = Services.add_book(@user, params[:asin], params[:status])
    send_message(message, status)
  end

  def update
    if params[:status]
      status, message = Services.move_book(@user, params[:asin], params[:status])
    elsif params[:notes]
      status, message = Services.add_notes_to_book(@user, params[:asin], params[:notes])
    end

    send_message(message, status)
  end

  def destroy
    status, message = Services.delete_book(@user, params[:asin])
    send_message(message, status)
  end

  private
    def get_user
      @user = User.where(:username => params[:username]).first

      if @user.nil?
        flash[:notice] = "User #{params[:username].inspect} was not found."
        redirect_to root_path
      end
    end

    def check_user
      render(:nothing => true) unless current_user == @user
    end

    def send_message(message, level=:success)
      respond_to do |format|
        message = hyperlink(message)
        format.json { render :json => {:text => message, :level => level} }
      end
    end

    def hyperlink(message)
      message.gsub(/"([^"]+)"/) do |word|
        self.class.helpers.link_to($1, ownerships_path(@user.username, :anchor => $1), :class => "pile")
      end
    end
end
