#!/usr/bin/env ruby

query = ARGV.join(" ")

require 'rubygems'
require 'yaml'
require 'amazon/ecs'

config = YAML.load_file(File.expand_path(File.dirname(__FILE__) + "/../config/amazon.yml"))["development"]

Amazon::Ecs.options = {:aWS_access_key_id => config.fetch("access_key_id"),
                       :aWS_secret_key    => config.fetch("secret_key")}

result = Amazon::Ecs.item_search(query, :response_group => 'Medium', :item_page => 1, :search_index => "Books")

puts result.doc.to_s

