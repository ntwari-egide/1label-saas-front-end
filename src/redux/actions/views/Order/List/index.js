export const setIsOrderConfirmed = (value) => (dispatch) => {
  dispatch({ type: "SET_IS_ORDER_CONFIRMED", payload: value })
}

export const setSelectedOrder = (value) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_ORDER", payload: value })
}

export const setIsOrderNew = (value) => (dispatch) => {
  dispatch({ type: "SET_IS_ORDER_NEW", payload: value })
}

export const resetData = () => (dispatch) => {
  dispatch({ type: "RESET_LIST_DATA" })
}
