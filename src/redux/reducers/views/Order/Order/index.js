const initialState = {
  brand: {},
  contentNumberData: {},
  careData: [{}],
  fibreInstructionData: [{}],
  washCareData: [{}],
  defaultContentData: [""],
  dynamicFieldData: {},
  selectedItems: [],
  projectionLocation: "",
  expectedDeliveryDate: "",
  minExpectedDeliveryDate: "",
  orderReference: "",
  coo: "",
  careNumberData: {},
  careCustomNumber: "",
  contentCustomNumber: "",
  dynamicFieldData: {},
  contentGroup: "",
  sizeMatrixType: ""
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
      return { ...state, projectionLocation: action.payload }
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
    default:
      return state
  }
}

export default orderReducer
