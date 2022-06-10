// ** Handle User Login
import axios from "@axios"
import history from "@src/history"
import { deleteCookie } from "@utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

export const handleLogin = (data) => {
  return (dispatch) => {
    dispatch({ type: "SERVER_ERROR", data: "" })
    const params = {
      user_name: data.username,
      password: data.password
    }
    axios.get("/Login/Login", { params }).then((res) => {
      if (res.status === 200) {
        console.log("login", res)
        if (res?.data?.status === "fail") {
          MySwal.fire({
            title: "Incorrect Username or Password",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-danger"
            },
            buttonStyling: false
          })
        } else {
          // dummy cookie for now is checked in router.js through isUserLoggedIn()
          document.cookie = "Token=dummy"
          localStorage.setItem("userData", JSON.stringify(res?.data[0]))
          history.push("/home")
        }
      }
    })
  }
}

// ** Handle User Logout
export const handleLogout = () => {
  console.log("inside action")
  return (dispatch) => {
    dispatch({ type: "LOGOUT" })
    // ** Remove user from localStorage
    deleteCookie("Token")
    localStorage.removeItem("userData")
  }
}
