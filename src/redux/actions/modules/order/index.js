export const setBrandRedux = (payload) => (dispatch) => {
  console.log("inside action")
  dispatch({ type: "SET_BRAND", payload })
}
