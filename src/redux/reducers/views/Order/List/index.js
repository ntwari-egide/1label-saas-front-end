const initialState = {
  isOrderConfirmed: false,
  selectedOrder: {}
}

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_IS_ORDER_CONFIRMED":
      return { ...state, isOrderConfirmed: action.payload }
    case "SET_SELECTED_ORDER":
      return { ...state, selectedOrder: action.payload }
    default:
      return { ...state }
  }
}

export default listReducer
