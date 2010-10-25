class AmazonController < ApplicationController
  before_filter :must_be_logged_in

  def index
    respond_to do |format|
      format.html
      format.json do
        expires_in 1.hour
        books = Services.amazon_find_all_books(params[:q], (params[:page] || 1).to_i)
        render :json => books
      end
    end
  end
end
