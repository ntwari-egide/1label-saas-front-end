const initialState = {
  menuItems: []
}

const verticalMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_MENU_ITEMS":
      console.log("payload", action.payload)
      return { ...state, menuItems: action.payload }
    default:
      return state
  }
}

export default verticalMenuReducer
