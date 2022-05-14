import { useEffect, useReducer, useState } from "react"
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
import { useNavigate, Link, useParams } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { FoodWrapper } from "../components/FoodWrapper";
import { FoodOrderDialog } from "../components/FoodOrderDialog";
import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';
import { postLineFoods, replaceLineFoods } from '../apis/line_foods';
import { HTTP_STATUS_CODE } from '../constants';

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


export const Foods = () => {
  const { restaurantsId } = useParams();
  const navigate = useNavigate();
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState)
  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingResutaurautName: '',
    newResutaurautName: '',
  }
  const [state, setState] = useState(initialState);

  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount
    })
    .then(() => navigate("/orders", { replace: true }))
    .catch(e => {
        if(e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingResutaurautName: e.response.data.existing_restaurant,
            newResutaurautName: e.response.data.new_restaurant,
          })
        } else {
          throw e;
        }
    })
  }

  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => navigate("/orders", { replace: true }))
    .catch(e => console.log(e))
  };

  useEffect(() => {
    dispatch({type: foodsActionTyps.FETCHING})
    fetchFoods(restaurantsId)
    .then(data => {
      dispatch({
        type: foodsActionTyps.FETCH_SUCCESS,
        payload: {
          foods: data.foods
        }
      })
    })
    .catch(e => console.error(e))
  },[restaurantsId])
  return (
    <>
      <HeaderWrapper>
        <Link to="/restaurants">
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
                  onClickFoodWrapper={(food) => setState({
                    ...state,
                    isOpenOrderDialog: true,
                    selectedFood: food
                  })}
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodsList>
      {
        state.isOpenOrderDialog &&
          <FoodOrderDialog
            food={state.selectedFood}
            isOpen={state.isOpenOrderDialog}
            countNumber={state.selectedFoodCount}
            onClickCountUp={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
            })}
            onClickCountDown={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
            })}
            onClickOrder={() => submitOrder()}
            onClose={() => setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1
            })}
          />
      }
      {
        state.isOpenNewOrderDialog &&
        <NewOrderConfirmDialog
          isOpen={state.isOpenNewOrderDialog}
          onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
          existingResutaurautName={state.existingResutaurautName}
          newResutaurautName={state.newResutaurautName}
          onClickSubmit={() => replaceOrder()}
        />
      }
    </>
  )
}
