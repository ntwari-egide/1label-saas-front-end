export const setBrand = (e) => (dispatch) => {
  dispatch({ type: "SET_BRAND_DATA", payload: e })
}

export const handleSelectedItemsChange = (item, initialState) => (dispatch) => {
  let tempList = [...initialState]
  // if already in list then removes else appends
  if (initialState.map((item) => item.guid_key).includes(item.guid_key)) {
    tempList.splice(
      initialState.map((item) => item.guid_key).indexOf(item.guid_key),
      1
    )
    dispatch({ type: "SET_SELECTED_ITEMS", payload: [...tempList] })
  } else {
    dispatch({ type: "SET_SELECTED_ITEMS", payload: [...tempList, item] })
  }
}
