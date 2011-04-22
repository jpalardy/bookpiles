Bookpiles::Application.routes.draw do
  root :to => "welcome#index"
  match '/about', :to => "welcome#about", :as => "about"

  match '/amazon/books(.:format)',    :to => "amazon#index",       :via => "get",   :as => "amazon"

  match '/logout',                    :to => "session#destroy",    :via => "get"
  match '/login',                     :to => "session#create",     :via => "post"
  match '/login-complete',            :to => "session#complete",   :via => "get",   :as => "complete_openid"

  match '/register',                  :to => "users#create",       :via => "post"

  match '/:username/books(.:format)', :to => "ownerships#index",   :via => "get",   :as => "ownerships"
  match '/:username/books',           :to => "ownerships#create",  :via => "post"

  match '/:username/books/:asin',     :to => "ownerships#update",  :via => "put",   :as => "ownership"
  match '/:username/books/:asin',     :to => "ownerships#destroy", :via => "delete"
end
