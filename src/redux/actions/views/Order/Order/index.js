import { XMLParser } from "fast-xml-parser"
import { store } from "../../../../storeConfig/store"
import { Input } from "reactstrap"

export const setBrand = (e) => (dispatch) => {
  dispatch({ type: "SET_BRAND_DATA", payload: e })
}

export const setSelectedItems = (data) => (dispatch) => {
  dispatch({ type: "SET_SELECTED_ITEMS", payload: data })
}

const formatColToRow = (xmlStr) => {
  if (!xmlStr.length) {
    return
  }
  const selectedItems = store.getState().orderReducer.selectedItems
  const parser = new XMLParser()
  const jsObj = parser.parse(xmlStr)
  console.log("jsObj", jsObj)
  // dynamically assigning cols to data-table
  const cols = []
  // pushing known static cols
  cols.push({
    name: "Sr No.",
    selector: "Sequence"
  })
  // pushing country size col
  jsObj?.SizeMatrix?.Table?.map((col) => {
    cols.push({
      name: col.Column1,
      selector: col.Column1
    })
  })
  // pushing item ref cols
  selectedItems.map((_, itm_index) => {
    cols.push({
      name: `QTY ITEM REF ${itm_index}`,
      selector: `QTY ITEM REF ${itm_index}`,
      cell: (row, index, col) => {
        return (
          <div>
            <Input
            // value={store.getState().orderReducer.sizeData[index][col] || ""}
            // onChange={(e) => {
            //   const tempState = [...store.getState().orderReducer.sizeData]
            //   row[`QTY ITEM REF ${itm_index}`] = e.target.value
            //   tempState[index] = row
            //   store.dispatch({ type: "SET_SIZE_DATA", payload: tempState })
            // }}
            />
          </div>
        )
      }
    })
  })
  cols.push({
    name: "UPC/EAN CODE",
    selector: "UPC/EAN CODE",
    cell: (row) => (
      <div>
        <Input />
      </div>
    )
  })
  // actual algo
  const nRows = Object.keys(jsObj?.SizeMatrix?.Table[0]).length - 2 // gets the no of rows
  let data = [] // initialized data to fill row by row
  let currentRow = 0 + 2 // because actual data begins at Column2
  for (let i = 0; i < nRows; i++) {
    let row = {} // initialise empty row
    jsObj?.SizeMatrix?.Table.map((col) => {
      row[col["Column1"]] = col[`Column${currentRow}`] // row[column_name] = column_value
    })
    row.Sequence = i + 1
    data.push(row) // push the row to data
    currentRow += 1 // increment row count
  }
  console.log("processed", data)
  return { table: data, cols }
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
  const { table, cols } = formatColToRow(data)
  dispatch({ type: "SET_SIZE_TABLE_COLS", payload: cols })
  dispatch({ type: "SET_SIZE_DATA", payload: table })
}

export const setDefaultSizeData = (data) => (dispatch) => {
  dispatch({
    type: "SET_DEFAULT_SIZE_DATA",
    payload: formatColToRow(data)?.table
  })
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
