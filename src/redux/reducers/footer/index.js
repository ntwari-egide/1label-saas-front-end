const initialState = {
  company: "",
  version: ""
}

const footerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_COMPANY":
      return { ...state, company: action.payload }
    case "SET_VERSION":
      return { ...state, version: action.payload }
    default:
      return { ...state }
  }
}

export default footerReducer
