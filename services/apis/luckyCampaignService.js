import service from '../index'
import {buildQueryString} from '../../core/utils/strings'

export default {
  getCodes(payload) {
    return service.get(`/api/lucky-campaign/${payload.campaign_id}`)
  },
  checkValid(campaignId, payload) {
    return service.post(`/api/lucky-campaign/${campaignId}/valid`, payload)
  },
  submitReward(campaignId, payload) {
    return service.post(`/api/lucky-campaign/${campaignId}`, payload)
  },

}
