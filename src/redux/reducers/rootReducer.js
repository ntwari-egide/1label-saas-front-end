// ** Redux Imports
import { combineReducers } from "redux"

// ** Reducers Imports
import auth from "./auth"
import navbar from "./navbar"
import layout from "./layout"
import verticalMenuReducer from "../../redux/navigation/vertical/reducers"
import orderReducer from "./views/Order/Order"
import poOrderReducer from "./views/Order/POOrder"

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  verticalMenuReducer,
  orderReducer,
  poOrderReducer
})

export default rootReducer
