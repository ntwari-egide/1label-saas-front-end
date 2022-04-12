// ** Initial State
const initialState = {
  suggestions: [],
  bookmarks: [],
  query: "",
  navbarBtnStatus: {
    saveBtn: true,
    deleteBtn: true,
    addBtn: true
  },
  linkbtnStatus:false
}

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "HANDLE_SEARCH_QUERY":
      return { ...state, query: action.val }
    case "GET_BOOKMARKS":
      return { ...state, suggestions: action.data, bookmarks: action.bookmarks }
    case "UPDATE_BOOKMARKED":
      let objectToUpdate

      // ** find & update object
      state.suggestions.find((item) => {
        if (item.id === action.id) {
          item.isBookmarked = !item.isBookmarked
          objectToUpdate = item
        }
      })

      // ** Get index to add or remove bookmark from array
      const bookmarkIndex = state.bookmarks.findIndex((x) => x.id === action.id)

      if (bookmarkIndex === -1) {
        state.bookmarks.push(objectToUpdate)
      } else {
        state.bookmarks.splice(bookmarkIndex, 1)
      }

      return { ...state }
    case "UPDATE_NAVBAR_BTN_STATUS":
      return { ...state, navbarBtnStatus: action.payload }
    case "UPDATE_LINKBTN_STATUS":
      return { ...state, linkbtnStatus: action.status }
    default:
      return state
  }
}

export default navbarReducer
