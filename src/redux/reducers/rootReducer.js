// ** Redux Imports
import { combineReducers } from "redux"

// ** Reducers Imports
import auth from "./auth"
import navbar from "./navbar"
import layout from "./layout"
import verticalMenuReducer from "../../redux/navigation/vertical/reducers"

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  verticalMenuReducer
})

export default rootReducer
