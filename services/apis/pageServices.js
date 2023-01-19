import service from '../index'
import {buildQueryString} from '../../core/utils/strings'

export default {
  getPageDetail(payload) {
    if (payload.handle) {
      return service.get(`/api/pages/${payload.handle}`)
    }
  },

}
