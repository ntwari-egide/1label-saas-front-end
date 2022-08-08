// ** ThemeConfig Import
import themeConfig from "@configs/themeConfig"

// ** Returns Initial Menu Collapsed State
const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem("menuCollapsed")
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

// ** Initial State
const initialState = {
  isRTL: themeConfig.layout.isRTL,
  menuCollapsed: initialMenuCollapsed(),
  menuHidden: themeConfig.layout.menu.isHidden,
  contentWidth: themeConfig.layout.contentWidth,
  status: false,
  sidebarLeftLoading: false,
  isSaveDraftBtnDisabled: true,
  isSaveConfirmBtnDisabled: true
}

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case "HANDLE_CONTENT_WIDTH":
      return { ...state, contentWidth: action.value }
    case "HANDLE_MENU_COLLAPSED":
      window.localStorage.setItem("menuCollapsed", action.value)
      return { ...state, menuCollapsed: action.value }
    case "HANDLE_MENU_HIDDEN":
      return { ...state, menuHidden: action.value }
    case "HANDLE_RTL":
      return { ...state, isRTL: action.value }
    case "IsOpen":
      return { ...state, status: action.value }
    case "SET_LEFTLOADER":
      return { ...state, sidebarLeftLoading: action.payload }
    case "TOGGLE_SAVE_BTN_STATUS":
      return { ...state, renderSaveDraftOrderButton: action.payload }
    case "SET_SAVE_DRAFT_BTN_STATUS":
      return { ...state, isSaveDraftBtnDisabled: action.payload }
    case "SET_SAVE_CONFIRM_BTN_STATUS":
      return { ...state, isSaveConfirmBtnDisabled: action.payload }
    default:
      return state
  }
}

export default layoutReducer
