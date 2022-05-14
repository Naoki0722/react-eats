import axios from 'axios'
import { orders } from '../urls'

export const postOrder = ({line_food_ids}) => {
  return axios.post(orders, {
    line_food_ids: line_food_ids
  })
    .then(res => res.data)
    .catch(e => console.error(e))
}
