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
