export const setIsOrderConfirmed = (value) => (dispatch) => {
  dispatch({ type: "SET_IS_ORDER_CONFIRMED", payload: value })
}

export const setSelectedOrder = (value) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_ORDER", payload: value })
}
