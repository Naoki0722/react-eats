import axios from "axios"
import { lineFoods } from "../urls"


export const postLineFoods = (params) => {
  console.log(params)
  return axios.post(lineFoods, {
    food_id: params.foodId,
    count: params.count
  })
  .then(res => res.data)
  .catch(e => { throw e; })
}

export const replaceLineFoods = ({foodId,count}) => {
  return axios.put(lineFoods, {
    food_id: foodId,
    count: count
  })
  .then(res => res.data)
  .catch(e => { throw e; })
}