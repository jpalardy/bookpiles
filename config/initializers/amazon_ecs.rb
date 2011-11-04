
config = YAML.load_file("#{Rails.root}/config/amazon.yml")[Rails.env]

Amazon::Ecs.options = {:associate_tag     => config.fetch("associate_tag"),
                       :AWS_access_key_id => config.fetch("access_key_id"),
                       :AWS_secret_key    => config.fetch("secret_key")}

