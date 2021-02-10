# == Schema Information
#
# Table name: users
#
#  id               :integer          not null, primary key
#  ip               :string(255)
#  ip_country       :string(255)
#  application_name :string(255)
#  brand            :string(255)
#  bundle_id        :string(255)
#  build_number     :string(255)
#  device_id        :string(255)
#  device_type      :string(255)
#  readable_version :string(255)
#  system_name      :string(255)
#  system_version   :string(255)
#  unique_id        :string(255)
#  version          :string(255)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
class FiveCh::User < ApplicationRecord
end
