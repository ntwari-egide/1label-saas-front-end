export const setBrand = (e) => (dispatch) => {
  dispatch({ type: "SET_BRAND_DATA", payload: e })
}

export const setSelectedItems = (data) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_ITEMS", payload: data })
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

export const setCareData = (data) => (dispatch) => {
  dispatch({ type: "SET_CARE_DATA", payload: data })
}

export const setFibreInstructionData = (data) => (dispatch) => {
  dispatch({ type: "SET_FIBRE_INSTRUCTION_DATA", payload: data })
}

export const setWashCareData = (data) => (dispatch) => {
  dispatch({ type: "SET_WASH_CARE_DATA", payload: data })
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

export const setContentCustomNumber = (value) => (dispatch) => {
  dispatch({ type: "SET_CONTENT_CUSTOM_NUMBER", payload: value })
}

export const setCareCustomNumber = (value) => (dispatch) => {
  dispatch({ type: "SET_CARE_CUSTOM_NUMBER", payload: value })
}

export const setDynamicFieldData = (data) => (dispatch) => {
  dispatch({ type: "SET_DYNAMIC_FIELD_DATA", payload: data })
}

export const setContentGroup = (value) => (dispatch) => {
  dispatch({ type: "SET_CONTENT_GROUP", payload: value })
}

export const setSizeMatrixType = (value) => (dispatch) => {
  dispatch({ type: "SET_SIZE_MATRIX_TYPE", payload: value })
}

export const setSizeTable = (value) => (dispatch) => {
  dispatch({ type: "SET_SIZE_TABLE", payload: value })
}

export const setDefaultSizeTable = (value) => (dispatch) => {
  dispatch({ type: "SET_DEFAULT_SIZE_TABLE", payload: value })
}

export const setCurrentStep = (value) => (dispatch) => {
  dispatch({ type: "SET_CURRENT_STEP", payload: value })
}

export const setShrinkagePercentage = (value) => (dispatch) => {
  dispatch({ type: "SET_SHRINKAGE_PERCENTAGE", payload: value })
}

export const setSizeData = (data) => (dispatch) => {
  dispatch({ type: "SET_SIZE_DATA", payload: data })
}

export const setDefaultSizeData = (data) => (dispatch) => {
  dispatch({ type: "SET_DEFAULT_SIZE_DATA", payload: data })
}

export const setDeliveryAddressDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_DELIVERY_ADDRESS_DETAILS", payload: data })
}

export const setInvoiceAddressDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_INVOICE_ADDRESS_DETAILS", payload: data })
}

export const setContactDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_CONTACT_DETAILS", payload: data })
}

export const setClientDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_CLIENT_DETAILS", payload: data })
}

export const setWastage = (value) => (dispatch) => {
  dispatch({ type: "SET_WASTAGE", payload: value })
}

export const setWastageApplied = (value) => (dispatch) => {
  dispatch({ type: "SET_WASTAGE_APPLIED", payload: value })
}
