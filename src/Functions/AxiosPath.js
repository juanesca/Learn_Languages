import ax from 'axios';
import {localGet} from '././localStorage'

export const axios = ax.create({
  baseURL: url,
  headers: {jwt_token: localGet('token')}
})