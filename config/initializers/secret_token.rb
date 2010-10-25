
config = YAML.load_file("#{Rails.root}/config/secret.yml")[Rails.env]

Bookpiles::Application.config.secret_token = config.fetch("secret")

