// **  Initial State
const initialState = {
  serverError : false,
  userData: {}
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SERVER_ERROR':          
    return { ...state, serverError: action.data }
    case 'LOGIN':
      return { ...state, userData: action.data }
    case 'LOGOUT':
      return { ...state, userData: {} }
    default:
      return state
  }
}

export default authReducer
