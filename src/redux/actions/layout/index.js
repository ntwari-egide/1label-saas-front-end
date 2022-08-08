// ** Handles Layout Content Width (full / boxed)
export const handleContentWidth = (value) => (dispatch) =>
  dispatch({ type: "HANDLE_CONTENT_WIDTH", value })

// ** Handles Menu Collapsed State (Bool)
export const handleMenuCollapsed = (value) => (dispatch) =>
  dispatch({ type: "HANDLE_MENU_COLLAPSED", value })

// ** Handles Menu Hidden State (Bool)
export const handleMenuHidden = (value) => (dispatch) =>
  dispatch({ type: "HANDLE_MENU_HIDDEN", value })

// ** Handles RTL (Bool)
export const handleRTL = (value) => (dispatch) =>
  dispatch({ type: "HANDLE_RTL", value })

export const setCustom = (value) => (dispatch) =>
  dispatch({ type: "IsOpen", value })

export const toggleSaveBtnStatus = (value) => (dispatch) => {
  dispatch({ type: "TOGGLE_SAVE_BTN_STATUS", payload: value })
}

export const setLoader = (value) => (dispatch) => {
  dispatch({ type: "SET_LEFTLOADER", payload: value })
}

export const setIsSaveDraftBtnDisabled = (value) => (dispatch) => {
  dispatch({ type: "SET_SAVE_DRAFT_BTN_STATUS", payload: value })
}

export const setIsSaveConfirmBtnDisabled = (value) => (dispatch) => {
  dispatch({ type: "SET_SAVE_CONFIRM_BTN_STATUS", payload: value })
}
