const initialState = {
  brand: {},
  // order form data
  contentNumberData: {},
  careData: [{}],
  fibreInstructionData: [{}],
  washCareData: [{}],
  defaultContentData: [""],
  dynamicFieldData: {},
  selectedItems: [],
  productionLocation: "",
  expectedDeliveryDate: "",
  minExpectedDeliveryDate: "",
  orderReference: "",
  coo: "",
  careNumberData: {},
  careCustomNumber: "",
  contentCustomNumber: "",
  dynamicFieldData: {},
  contentGroup: "",
  brandDetails: {},
  itemInfoFields: [],
  // size table data
  sizeMatrixType: "",
  sizeTable: "",
  defaultSizeTable: "",
  sizeData: [],
  defaultSizeData: [],
  wastage: 0,
  wastageApplied: "N",
  // invoice and delivery data
  clientDetails: {},
  invoiceAddressDetails: {},
  deliveryAddressDetails: {},
  contactDetails: {},
  // misc
  currentStep: 0,
  shrinkagePercentage: ""
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BRAND_DATA":
      return { ...state, brand: action.payload }
    case "SET_CARE_DATA":
      return { ...state, careData: action.payload }
    case "SET_FIBRE_INSTRUCTION_DATA":
      return { ...state, fibreInstructionData: action.payload }
    case "SET_WASH_CARE_DATA":
      return { ...state, washCareData: action.payload }
    case "SET_DEFAULT_CONTENT_DATA":
      return { ...state, defaultContentData: action.payload }
    case "SET_DYNAMIC_FIELD_DATA":
      return { ...state, dynamicFieldData: action.payload }
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload }
    case "SET_ORDER_REFERENCE":
      return { ...state, orderReference: action.payload }
    case "SET_EXPECTED_DELIVERY_DATE":
      return { ...state, expectedDeliveryDate: action.payload }
    case "SET_MIN_EXPECTED_DELIVERY_DATE":
      return { ...state, minExpectedDeliveryDate: action.payload }
    case "SET_PROJECTION_LOCATION":
      return { ...state, productionLocation: action.payload }
    case "SET_COO":
      return { ...state, coo: action.payload }
    case "SET_CONTENT_NUMBER_DATA":
      return { ...state, contentNumberData: action.payload }
    case "SET_CARE_NUMBER_DATA":
      return { ...state, careNumberData: action.payload }
    case "SET_CARE_CUSTOM_NUMBER":
      return { ...state, careCustomNumber: action.payload }
    case "SET_CONTENT_CUSTOM_NUMBER":
      return { ...state, contentCustomNumber: action.payload }
    case "SET_DYNAMIC_FIELD_DATA":
      return { ...state, dynamicFieldData: action.payload }
    case "SET_CONTENT_GROUP":
      return { ...state, contentGroup: action.payload }
    case "SET_SIZE_MATRIX_TYPE":
      return { ...state, sizeMatrixType: action.payload }
    case "SET_SIZE_TABLE":
      return { ...state, sizeTable: action.payload }
    case "SET_DEFAULT_SIZE_TABLE":
      return { ...state, defaultSizeTable: action.payload }
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload }
    case "SET_SHRINKAGE_PERCENTAGE":
      return { ...state, shrinkagePercentage: action.payload }
    case "SET_SIZE_DATA":
      return { ...state, sizeData: action.payload }
    case "SET_DEFAULT_SIZE_DATA":
      return { ...state, defaultSizeData: action.payload }
    case "SET_INVOICE_ADDRESS_DETAILS":
      return { ...state, invoiceAddressDetails: action.payload }
    case "SET_DELIVERY_ADDRESS_DETAILS":
      return { ...state, deliveryAddressDetails: action.payload }
    case "SET_CONTACT_DETAILS":
      return { ...state, contactDetails: action.payload }
    case "SET_CLIENT_DETAILS":
      return { ...state, clientDetails: action.payload }
    case "SET_WASTAGE":
      return { ...state, wastage: action.payload }
    case "SET_WASTAGE_APPLIED":
      return { ...state, wastageApplied: action.payload }
    case "SET_BRAND_DETAILS":
      return { ...state, brandDetails: action.payload }
    case "SET_ITEM_INFO_FIELDS":
      return { ...state, itemInfoFields: action.paylod }
    default:
      return state
  }
}

export default orderReducer
