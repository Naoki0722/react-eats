import axios from 'axios'
import { foodsIndex } from '../urls'

export const fetchFoods = (restaurantId) => {
  return axios.get(foodsIndex(restaurantId))
  .then(res => res.data)
  .catch((e) => console.error(e))
}
