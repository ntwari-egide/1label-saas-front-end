import { formatDateYMD } from "@utils"

const initialState = {
  // ** gobal states
  currentStep: "Listing",
  // ** listing data
  poSelectedOrders: [],
  searchParams: {
    fromDate: formatDateYMD(
      new Date(new Date().setMonth(new Date().getMonth() - 1))
    ),
    toDate: formatDateYMD(new Date())
  },
  // po item list states
  selectedItems: [],
  // po order form
  brand: {},
  careData: [{}],
  washCareData: [],
  dynamicFieldData: {},
  fibreInstructionData: [{}],
  careCustomNumber: "",
  contentCustomNumber: "",
  productionLocation: "",
  orderReference: "",
  expectedDeliveryDate: "",
  contentNumberData: {},
  defaultContentData: [""],
  careNumberData: {},
  contentGroup: "",
  coo: "",
  brandDetails: {},
  itemInfoFields: [],
  orderNo: "",
  brandSettings: {},
  orderFormValidations: {},
  // size table states
  sizeData: [],
  wastage: 0,
  summaryTable: {},
  wastageApplied: "N",
  cols: [],
  // preview and summary states
  sizeTable: "",
  defaultSizeTable: "",
  sizeMatrixType: "",
  // invoice and delivery data
  clientDetails: {},
  invoiceAddressDetails: {},
  deliveryAddressDetails: {},
  contactDetails: {},
  // misc
  shrinkagePercentage: "",
  sizeTableTrigger: true
}

const poOrderReduced = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PO_CURRENT_STEP":
      return { ...state, currentStep: action.payload }
    case "SET_PO_BRAND":
      return { ...state, brand: action.payload }
    case "SET_PO_CARE_DATA":
      return { ...state, careData: action.payload }
    case "SET_PO_WASH_CARE_DATA":
      return { ...state, washCareData: action.payload }
    case "SET_PO_DYNAMIC_FIELD_DATA":
      return { ...state, dynamicFieldData: action.payload }
    case "SET_PO_FIBRE_INSTRUCTION_DATA":
      return { ...state, fibreInstructionData: action.payload }
    case "SET_PO_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload }
    case "SET_PO_CARE_CUSTOM_NUMBER":
      return { ...state, careCustomNumber: action.payload }
    case "SET_PO_CONTENT_CUSTOM_NUMBER":
      return { ...state, contentCustomNumber: action.payload }
    case "SET_PO_PROJECTION_LOCATION":
      return { ...state, productionLocation: action.payload }
    case "SET_PO_ORDER_REFERENCE":
      return { ...state, orderReference: action.payload }
    case "SET_PO_EXPECTED_DELIVERY_DATE":
      return { ...state, expectedDeliveryDate: action.payload }
    case "SET_PO_CONTENT_NUMBER_DATA":
      return { ...state, contentNumberData: action.payload }
    case "SET_PO_DEFAULT_CONTENT_DATA":
      return { ...state, defaultContentData: action.payload }
    case "SET_PO_CARE_NUMBER_DATA":
      return { ...state, careNumberData: action.payload }
    case "SET_PO_CONTENT_GROUP":
      return { ...state, contentGroup: action.payload }
    case "SET_PO_COO":
      return { ...state, coo: action.payload }
    case "SET_PO_SIZE_CONTENT_DATA":
      return { ...state, sizeData: action.payload }
    case "SET_PO_WASTAGE":
      return { ...state, wastage: action.payload }
    case "SET_PO_SUMMARY_TABLE":
      return { ...state, summaryTable: action.payload }
    case "SET_PO_SIZE_TABLE":
      return { ...state, sizeTable: action.payload }
    case "SET_PO_DEFAULT_SIZE_TABLE":
      return { ...state, defaultSizeTable: action.payload }
    case "SET_PO_SIZE_MATRIX_TYPE":
      return { ...state, sizeMatrixType: action.payload }
    case "SET_PO_SHRINKAGE_PERCENTAGE":
      return { ...state, shrinkagePercentage: action.payload }
    case "SET_PO_SIZE_TABLE_TRIGGER":
      return { ...state, sizeTableTrigger: action.payload }
    case "SET_PO_INVOICE_ADDRESS_DETAILS":
      return { ...state, invoiceAddressDetails: action.payload }
    case "SET_PO_DELIVERY_ADDRESS_DETAILS":
      return { ...state, deliveryAddressDetails: action.payload }
    case "SET_PO_CONTACT_DETAILS":
      return { ...state, contactDetails: action.payload }
    case "SET_PO_WASTAGE_APPLIED":
      return { ...state, wastageApplied: action.payload }
    case "SET_PO_CLIENT_DETAILS":
      return { ...state, clientDetails: action.payload }
    case "SET_PO_BRAND_DETAILS":
      return { ...state, brandDetails: action.payload }
    case "SET_PO_ITEM_INFO_FIELDS":
      return { ...state, itemInfoFields: action.payload }
    case "SET_PO_COLS":
      return { ...state, cols: action.payload }
    case "RESET_PO_DATA":
      return { ...initialState }
    case "SET_PO_ORDER_NO":
      return { ...state, orderNo: "" }
    case "SET_PO_SEARCH_PARAMS":
      return { ...state, searchParams: action.payload }
    case "SET_PO_SELECTED_ORDERS":
      return { ...state, poSelectedOrders: action.payload }
    case "SET_PO_BRAND_SETTINGS":
      return { ...state, brandSettings: action.payload }
    case "SET_PO_ORDER_FORM_VALIDATIONS":
      return { ...state, orderFormValidations: action.payload }
    default:
      return { ...state }
  }
}

export default poOrderReduced
