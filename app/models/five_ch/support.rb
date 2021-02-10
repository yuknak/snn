# == Schema Information
#
# Table name: supports
#
#  id         :integer          not null, primary key
#  unique_id  :string(255)
#  sup_type   :string(255)
#  board_name :string(255)
#  tid        :string(255)
#  extra_info :text(65535)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class FiveCh::Support < ApplicationRecord
end
