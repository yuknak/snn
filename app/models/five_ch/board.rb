# == Schema Information
#
# Table name: boards
#
#  id          :integer          not null, primary key
#  server_id   :integer
#  name        :string(255)
#  title       :string(2047)
#  mirror      :boolean          default(FALSE)
#  mirror_ver  :integer
#  mirrored_at :datetime
#  prev_epoch  :integer
#  res_added   :integer
#  res_speed   :float(24)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
class FiveCh::Board < ApplicationRecord
  belongs_to :server
  has_many :threads
end
