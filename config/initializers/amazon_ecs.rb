
config = YAML.load_file("#{Rails.root}/config/amazon.yml")[Rails.env]

Amazon::Ecs.options = {:aWS_access_key_id => config.fetch("access_key_id"),
                       :aWS_secret_key    => config.fetch("secret_key")}

