class FiveCh::Board < ApplicationRecord
  belongs_to :server
  has_many :threads
end