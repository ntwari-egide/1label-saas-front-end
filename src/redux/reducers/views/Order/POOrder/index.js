const initialState = {
  brand: {},
  careData: [{}],
  washCareData: [],
  dynamicFieldData: {},
  fibreInstructionData: [{}],
  selectedItems: [],
  careCustomNumber: "",
  contentCustomNumber: ""
}

const poOrderReduced = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BRAND":
      return { ...state, brand: action.payload }
    case "SET_CARE_DATA":
      return { ...state, careData: action.payload }
    case "SET_WASH_CARE_DATA":
      return { ...state, washCareData: action.payload }
    case "SET_DYNAMIC_FIELD_DATA":
      return { ...state, dynamicFieldData: action.payload }
    case "SET_FIBRE_INSTRUCTION_DATA":
      return { ...state, fibreInstructionData: action.payload }
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload }
    case "SET_CARE_CUSTOM_NUMBER":
      return { ...state, careCustomNumber: action.payload }
    case "SET_CONTENT_CUSTOM_NUMBER":
      return { ...state, contentCustomNumber: action.payload }
    default:
      return state
  }
}

export default poOrderReduced
