/*
import { getAutorizationToken } from '@/assets/API/getAutorizationToken.js';

export default class Api {
 
  static getAutorizationToken (email, password) {
    return axios.post('auth/login', { email, password })
      .then(response => response.data)
  }
 
  static logout () {
    return axios.post('auth/logout')
  }
 
  static getCollages () {
    return axios.get('/collages')
      .then(response => response.data)
  }
  
  static deleteCollage (collage) {
    return axios.delete(`/collage/${collage.id}`)
      .then(response => response.data)
  }
  
  static createCollage (collage) {
    return axios.post(`/collage/${collage.id}`)
      .then(response => response.data)
  }
  
}
*/