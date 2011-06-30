
$:.unshift(File.expand_path("~/.rvm/lib"))
require 'rvm/capistrano'
set :rvm_ruby_string, "ree-1.8.7-2010.01"
set :rvm_type, :user

set :stages, %w(staging production)
require 'capistrano/ext/multistage'

ssh_options[:compression] = false

set  :application,    "bookpiles"

set  :use_sudo,       false
role :app,            "jonathan@jpalardy.com"
role :db,             "jonathan@jpalardy.com", :primary => true

set  :scm, :git
set  :repository,     "jonathan@jpalardy.com:.repos/#{application}.git"

set  :deploy_via,     :remote_cache

set  :group_writable, false


namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

after "deploy:update_code", "deploy:symlink_shared"
namespace :deploy do
  task :symlink_shared do
    ["amazon","secret","database","hoptoad"].each do |name|
      run "ln -nfs #{shared_path}/config/#{name}.yml #{release_path}/config/#{name}.yml"
    end
    run "ln -nfs #{shared_path}/db/#{stage}.sqlite3 #{release_path}/db/#{stage}.sqlite3"
  end
end

after "deploy:update_code", "deploy:bundle_install"
namespace :deploy do
  desc "run 'bundle install' to install Bundler's packaged gems for the current deploy"
  task :bundle_install, :roles => :app do
    run "cd #{release_path} && bundle install --without=test:development --system"
  end
end

