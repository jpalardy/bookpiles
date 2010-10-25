
config = YAML.load_file("#{Rails.root}/config/amazon.yml")[Rails.env]

AWS::S3::Base.establish_connection!(:access_key_id     => config.fetch("access_key_id"),
                                    :secret_access_key => config.fetch("secret_key"))

S3_BUCKET    = config.fetch("s3_bucket")
S3_PREFIX    = config.fetch("s3_prefix")
S3_ASSET_URL = config.fetch("s3_asset_url")

