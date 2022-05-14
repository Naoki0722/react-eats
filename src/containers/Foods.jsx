import { useEffect, useReducer } from "react"
import { fetchFoods } from "../apis/foods"
import { REQUEST_STATE } from "../constants"
import {
  initialState as foodsInitialState,
  foodsActionTyps,
  foodsReducer,
} from '../reducers/foods';
import styled from "styled-components";


import MainLogo from '../images/logo.png';
import FoodImage from '../images/food-image.jpg';

import { COLORS } from "../style_constants";
import { LocalMalIcon } from "../components/Icons";
import { Link } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { FoodWrapper } from "../components/FoodWrapper";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`

const BagIconWrapper = styled.div`
  padding-top: 24px;
`

const ColoredBagIcon = styled(LocalMalIcon)`
  color: ${COLORS.MAIN}
`

const MainLogoImage = styled.img`
  height: 90px;
`

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;


export const Foods = ({match}) => {
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState)

  useEffect(() => {
    dispatch({type: foodsActionTyps.FETCHING})
    fetchFoods(match.params.restaurantsId)
    .then(data => {
      dispatch({
        type: foodsActionTyps.FETCH_SUCCESS,
        payload: {
          foods: data.foods
        }
      })
    })
    .catch(e => console.error(e))
  },[match.params.restaurantsId])
  return (
    <>
      <HeaderWrapper>
        <Link to="restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <>
              {
                [...Array(12).keys()].map(i =>
                  <ItemWrapper key={i}>
                    <Skeleton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key={food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={(food) => console.log(food)}
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodsList>
    </>
  )
}
