const initialState = {
  brand: {}
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BRAND":
      console.log("brand payload reducer", action.payload)
      return { ...state, brand: action.payload }
    default:
      return state
  }
}

export default orderReducer
