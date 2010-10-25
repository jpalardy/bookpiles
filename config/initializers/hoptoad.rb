
config = YAML.load_file("#{Rails.root}/config/hoptoad.yml")[Rails.env]

HoptoadNotifier.configure do |configure|
  configure.api_key = config.fetch("api_key")
end

