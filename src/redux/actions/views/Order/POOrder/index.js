import { store } from "@redux/storeConfig/store"
import { Input } from "reactstrap"

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
  dispatch({ type: "SET_PO_SIZE_CONTENT_DATA", payload: data })
}

export const setOriginalSizeData = (data) => (dispatch) => {
  dispatch({ type: "SET_PO_ORIGINAL_SIZE_DATA", payload: data })
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

const handleQtyChange = (value, col, index, tabIndex, props, dispatch) => {
  if (parseInt(value) || value === "0" || value === "") {
    // update the table
    const tempState = [...props.sizeData]
    const tempTable = tempState[tabIndex].size_content
    let tempRow = tempTable[index]
    tempRow = {
      ...tempRow,
      [`${col.selector}`]: value.length ? parseInt(value).toString() : value
    }
    tempTable[index] = tempRow
    tempState[tabIndex] = {
      ...tempState[tabIndex],
      size_content: [...tempTable]
    }
    dispatch(setSizeData(tempState))
  }
}

const populateCols = (table, tabIndex, wastageApplied, dispatch) => {
  const props = {
    ...store.getState().listReducer,
    ...store.getState().poOrderReducer
  }

  // dynamically assigning cols to data-table
  const cols = []
  // pushing sr no
  cols.push({
    name: "Sr No.",
    selector: "Sequence"
  })
  // pushing size col
  if (table.length) {
    Object.keys(table[0]).map((key) => {
      if (
        !key.includes("QTY ITEM REF") &&
        !key.includes("Sequence") &&
        !key.includes("UPC/EAN CODE")
      ) {
        cols.push({
          name: key,
          selector: key
        })
      }
    })
  }
  // pushing item ref cols
  props.selectedItems.map((item, itm_index) => {
    cols.push({
      name: item.item_ref,
      selector:
        wastageApplied === "N"
          ? `QTY ITEM REF ${itm_index + 1}`
          : `QTY ITEM REF ${itm_index + 1} WITH WASTAGE`,
      cell: (row, index, col) => {
        return (
          <div>
            <Input
              value={row[col.selector] ? row[col.selector] : ""}
              onChange={(e) => {
                handleQtyChange(
                  e.target.value,
                  col,
                  index,
                  tabIndex,
                  props,
                  dispatch
                )
              }}
              disable={props.isOrderConfirmed}
            />
          </div>
        )
      }
    })
  })
  cols.push({
    name: "UPC/EAN CODE",
    selector: "UPC/EAN CODE",
    cell: (row, index, col) => {
      return (
        <div>
          <Input
            value={row[col.selector] ? row[col.selector] : ""}
            onChange={(e) => {
              const tempState = [...props.sizeData]
              const tempTable = tempState[tabIndex].size_content
              tempTable[index] = {
                ...tempTable[index],
                [`${col.selector}`]: e.target.value
              }
              tempState[tabIndex] = {
                ...tempState[tabIndex],
                size_content: [...tempTable]
              }
              dispatch(setSizeData(tempState))
            }}
            disable={props.isOrderConfirmed}
          />
        </div>
      )
    }
  })
  // finally assign it to state
  return cols
}

export const setCols = (sizeData, wastageApplied) => (dispatch) => {
  const tempCols = []
  sizeData.map((data, index) => {
    if (data.size_content?.length) {
      tempCols[index] = populateCols(
        data.size_content,
        index,
        wastageApplied,
        dispatch
      )
    }
  })
  dispatch({ type: "SET_PO_COLS", payload: tempCols })
}
