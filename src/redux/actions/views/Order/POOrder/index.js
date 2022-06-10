export const setBrand = (e) => (dispatch) => {
  dispatch({ type: "SET_PO_BRAND", payload: e })
}

export const setCareData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_CARE_DATA", payload: data })
}

export const setWashCareData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_WASH_CARE_DATA", payload: data })
}

export const setDynamicFieldData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_DYNAMIC_FIELD_DATA", payload: data })
}

export const setFibreInstructionData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_FIBRE_INSTRUCTION_DATA", payload: data })
}

export const setSelectedItems = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SELECTED_ITEMS", payload: data })
}

export const setContentCustomNumber = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_CONTENT_CUSTOM_NUMBER", payload: value })
}

export const setCareCustomNumber = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_CARE_CUSTOM_NUMBER", payload: value })
}

export const setProjectionLocation = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_PROJECTION_LOCATION", payload: value })
}

export const setOrderReference = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_ORDER_REFERENCE", payload: value })
}

export const setExpectedDeliveryDate = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_EXPECTED_DELIVERY_DATE", payload: value })
}

export const setContentNumberData = (e) => (dispatch) => {
  dispatch({ type: "SET_PO_CONTENT_NUMBER_DATA", payload: e })
}

export const setDefaultContentData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_DEFAULT_CONTENT_DATA", payload: data })
}

export const setCareNumberData = (e) => (dispatch) => {
  dispatch({ type: "SET_PO_CARE_NUMBER_DATA", payload: e })
}

export const setContentGroup = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_CONTENT_GROUP", payload: value })
}

export const setCoo = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_COO", payload: value })
}

export const setSizeContentData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SIZE_CONTENT_DATA", payload: data })
}

export const setWastage = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_WASTAGE", payload: value })
}

export const setSummaryTable = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SUMMARY_TABLE", payload: data })
}

export const setCurrentStep = (value) => (dispatch) => {
  console.log("from action", value)
  dispatch({ type: "SET_PO_CURRENT_STEP", payload: value })
}

export const setSizeTable = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SIZE_TABLE", payload: data })
}

export const setDefaultSizeTable = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_DEFAULT_SIZE_TABLE", payload: data })
}

export const setSizeMatrixType = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SIZE_MATRIX_TYPE", payload: data })
}

export const setShrinkagePercentage = (value) => (dispatch) => {
  dispatch({ typa: "SET_SHRINKAGE_PERCENTAGE", payload: value })
}

export const setSizeTableTrigger = (value) => (dispatch) => {
  dispatch({ type: "SET_SIZE_TABLE_TRIGGER", payload: value })
}