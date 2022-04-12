// ** Handle User Login
import axios from "@axios"
import { deleteCookie } from "@utils"

export const handleLogin = (data) => {
  return (dispatch) => {
    dispatch({ type: "SERVER_ERROR", data: "" })
    console.log("in action")
    document.cookie = "Token=dummy"
    // axios.post('Logined/logined', data).then((res) => {
    //   if (res.data.Code === 200) {
    //     const uData = { username: data.username, legalEntity: data.legalentity }
    //     // document.cookie = `Token=${res.data.Data}`
    //     localStorage.setItem('userData', JSON.stringify(uData))
    //     dispatch({ type: 'LOGIN', data: res.data })
    //   } else {
    //     dispatch({ type: 'SERVER_ERROR', data: res.data.InternalMsg })
    //   }
    // }).catch((e) => {
    //   dispatch({ type: 'SERVER_ERROR', data: 'Internal Server Error' })
    // })
  }
}

// ** Handle User Logout
export const handleLogout = () => {
  return (dispatch) => {
    dispatch({ type: "LOGOUT" })
    // ** Remove user from localStorage
    deleteCookie("Token")
    localStorage.removeItem("userData")
  }
}
