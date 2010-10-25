# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100909194524) do

  create_table "books", :force => true do |t|
    t.string   "title",                           :null => false
    t.string   "authors",                         :null => false
    t.string   "isbn",                            :null => false
    t.string   "s3_image_url",                    :null => false
    t.string   "amazon_image_url",                :null => false
    t.string   "published_on",                    :null => false
    t.integer  "pages",            :default => 0, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "books", ["isbn"], :name => "index_books_on_isbn"

  create_table "events", :force => true do |t|
    t.string   "status",       :null => false
    t.integer  "user_id",      :null => false
    t.integer  "ownership_id", :null => false
    t.datetime "created_at"
  end

  add_index "events", ["user_id", "status"], :name => "index_events_on_user_id_and_status"

  create_table "ownerships", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.integer  "book_id",    :null => false
    t.string   "status",     :null => false
    t.string   "isbn",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ownerships", ["user_id", "isbn"], :name => "index_ownerships_on_user_id_and_isbn"

  create_table "users", :force => true do |t|
    t.string   "username",   :null => false
    t.string   "openid",     :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["openid"], :name => "index_users_on_openid"
  add_index "users", ["username"], :name => "index_users_on_username"

end
