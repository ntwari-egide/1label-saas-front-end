export const setBrand = (e) => (dispatch) => {
  dispatch({ type: "SET_BRAND", payload: e })
}

export const setCareData = (data) => (dispatch) => {
  dispatch({ type: "SET_CARE_DATA", payload: data })
}

export const setWashCareData = (data) => (dispatch) => {
  dispatch({ type: "SET_WASH_CARE_DATA", payload: data })
}

export const setDynamicFieldData = (data) => (dispatch) => {
  dispatch({ type: "SET_DYNAMIC_FIELD_DATA", payload: data })
}

export const setFibreInstructionData = (data) => (dispatch) => {
  dispatch({ type: "SET_FIBRE_INSTRUCTION_DATA", payload: data })
}

export const setSelectedItems = (data) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_ITEMS", payload: data })
}

export const setContentCustomNumber = (value) => (dispatch) => {
  dispatch({ type: "SET_CONTENT_CUSTOM_NUMBER", payload: value })
}

export const setCareCustomNumber = (value) => (dispatch) => {
  dispatch({ type: "SET_CARE_CUSTOM_NUMBER", payload: value })
}

export const setProjectionLocation = (value) => (dispatch) => {
  dispatch({ type: "SET_PROJECTION_LOCATION", payload: value })
}

export const setOrderReference = (value) => (dispatch) => {
  dispatch({ type: "SET_ORDER_REFERENCE", payload: value })
}

export const setExpectedDeliveryDate = (value) => (dispatch) => {
  dispatch({ type: "SET_EXPECTED_DELIVERY_DATE", payload: value })
}

export const setContentNumberData = (e) => (dispatch) => {
  dispatch({ type: "SET_CONTENT_NUMBER_DATA", payload: e })
}

export const setDefaultContentData = (data) => (dispatch) => {
  dispatch({ type: "SET_DEFAULT_CONTENT_DATA", payload: data })
}

export const setCareNumberData = (e) => (dispatch) => {
  dispatch({ type: "SET_CARE_NUMBER_DATA", payload: e })
}

export const setContentGroup = (value) => (dispatch) => {
  dispatch({ type: "SET_CONTENT_GROUP", payload: value })
}

export const setCoo = (value) => (dispatch) => {
  dispatch({ type: "SET_COO", payload: value })
}
