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

export const setProductionLocation = (value) => (dispatch) => {
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

export const setSizeData = (data) => (dispatch) => {
  // remove all the columns for empty data
  const tempData = structuredClone(data)
  try {
    tempData.forEach((d, tIndex) => {
      // to record empty cols
      const recordDict = {}
      d.size_content.forEach((row) => {
        Object.keys(row).forEach((colName) => {
          if (!colName.includes("QTY ITEM REF")) {
            return
          }
          // record in dict if entry is empty
          if (!String(row[colName]).length) {
            if (recordDict[colName]) {
              recordDict[colName] += 1
            } else {
              recordDict[colName] = 1
            }
          }
        })
      })
      // iterate through recordDict
      Object.keys(recordDict).forEach((key) => {
        // check if the data was empty for all rows and delete if yes
        if (recordDict[key] === d.size_content.length) {
          d.size_content.map((_, rIndex) => {
            delete tempData[tIndex].size_content[rIndex][key]
          })
        }
      })
    })
    dispatch({ type: "SET_PO_SIZE_CONTENT_DATA", payload: tempData })
    return
  } catch (err) {
    console.log(
      "something went wrong while filtering the data for empty cols",
      err
    )
  }
  dispatch({ type: "SET_PO_SIZE_CONTENT_DATA", payload: data })
}

export const setWastage = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_WASTAGE", payload: value })
}

export const setSummaryTable = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SUMMARY_TABLE", payload: data })
}

export const setCurrentStep = (value) => (dispatch) => {
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
  dispatch({ type: "SET_PO_SHRINKAGE_PERCENTAGE", payload: value })
}

export const setSizeTableTrigger = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_SIZE_TABLE_TRIGGER", payload: value })
}

export const setInvoiceAddressDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_INVOICE_ADDRESS_DETAILS", payload: data })
}

export const setDeliveryAddressDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_DELIVERY_ADDRESS_DETAILS", payload: data })
}

export const setContactDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_CONTACT_DETAILS", payload: data })
}

export const setWastageApplied = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_WASTAGE_APPLIED", payload: value })
}

export const setClientDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_CLIENT_DETAILS", payload: data })
}

export const setBrandDetails = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_BRAND_DETAILS", payload: data })
}

export const setItemInfoFields = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_ITEM_INFO_FIELDS", payload: data })
}

export const setCols = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_COLS", payload: data })
}

export const resetData = () => (dispatch) => {
  dispatch({ type: "RESET_PO_DATA" })
}

export const setOrderNo = (value) => (dispatch) => {
  dispatch({ type: "SET_PO_ORDER_NO", payload: value })
}

export const setSearchParams = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SEARCH_PARAMS", payload: data })
}

export const setPoSelectedOrders = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_SELECTED_ORDERS", payload: data })
}

export const setBrandSettings = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_BRAND_SETTINGS", payload: data })
}

export const setOrderFormValidations = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_ORDER_FORM_VALIDATIONS", payload: data })
}
