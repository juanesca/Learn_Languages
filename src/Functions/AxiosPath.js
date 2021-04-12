import ax from 'axios';
import {localGet} from './localStorage';
let url="http://localhost:4000";
export const axios = ax.create({
  baseURL: url,
  headers: {jwt_token: localGet('token'),
  "Content-Type": 'multipart/form-data'}
})