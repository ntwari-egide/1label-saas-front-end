const initialState = {
  menuItems: []
}

const verticalMenuReducer = (state = initialState, action) => {
  console.log("inside action")
  switch (action.type) {
    case "FETCH_MENU_ITEMS":
      return { ...state, menuItems: action.data }
    default:
      return state
  }
}

export default verticalMenuReducer
