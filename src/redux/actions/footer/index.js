export const setCompany = (data) => (dispatch) => {
  dispatch({ type: "SET_COMPANY", payload: data })
}

export const setVersion = (data) => (dispatch) => {
  dispatch({ type: "SET_VERSION", payload: data })
}
