import service from '../index'
import {buildQueryString} from '../../core/utils/strings'

export default {
  fetchListAllTours(payload) {
    return service.get(`/api/trip?${buildQueryString(payload)}`)
  },
  fetchListLocations() {
    return service.get(`/api/locations`)
  },
  registerTour(payload) {
    return service.post(`/api/booking`, payload)
  },
  getDetailTour(payload) {
    if (payload.handle) {
      return service.get(`/api/trip/${payload.handle}`)
    }
  },
  fetchListFeatured() {
    return service.get(`/api/trip?featured=true`)
  },
  fetchListLocationsFeatured() {
    return service.get(`/api/locations?featured=true`)
  },
}
