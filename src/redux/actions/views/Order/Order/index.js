import axios from "@axios"

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

export const setExpectedDeliveryDate = (e) => (dispatch) => {
  dispatch({ type: "SET_EXPECTED_DELIVERY_DATE", payload: e })
}

export const setProjectionLocation = (label) => (dispatch) => {
  dispatch({ type: "SET_PROJECTION_LOCATION", payload: label })
}

export const setOrderReference = (value) => (dispatch) => {
  dispatch({ type: "SET_ORDER_REFERENCE", payload: value })
}

export const setCoo = (label) => (dispatch) => {
  dispatch({ type: "SET_COO", payload: label })
}

export const fetchMinExpectedDeliveryDate =
  (brand, selectedItems) => (dispatch) => {
    // min delivery date for Expected Delivery Date field
    const body = {
      brand_key: brand.value || "",
      erp_id: 8,
      item_key: selectedItems.map((item) => item.guid_key) || ""
    }

    axios.post("/Order/GetMinExpectedDeliveryDate", body).then((res) => {
      dispatch({
        type: "SET_MIN_EXPECTED_DELIVERY_DATE",
        payload: res.data.min_delivery_date
      })
    })
  }
