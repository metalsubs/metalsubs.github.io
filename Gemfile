source "https://rubygems.org"

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', 34
gem 'jekyll', versions['jekyll']
gem 'redcarpet', '3.1.2'
