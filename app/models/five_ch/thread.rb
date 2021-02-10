# == Schema Information
#
# Table name: threads
#
#  id            :integer          not null, primary key
#  board_id      :integer
#  tid           :integer
#  title         :string(2047)
#  mirror_ver    :integer
#  mirror_order  :integer
#  mirrored_at   :datetime
#  prev_epoch    :integer
#  prev_res_cnt  :integer
#  res_cnt       :integer
#  res_added     :integer
#  res_speed     :float(24)
#  res_speed_max :float(24)
#  res_percent   :float(24)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  inproper      :integer          default(0), not null
#
class FiveCh::Thread < ApplicationRecord
  belongs_to :board
end
