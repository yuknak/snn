# == Schema Information
#
# Table name: servers
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  title      :string(2047)
#  mirror     :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class FiveCh::Server < ApplicationRecord
  has_many :boards
end
