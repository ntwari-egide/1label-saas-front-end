import axios from "axios"
import { getCookie, deleteCookie } from "@utils"
import history from "@src/history"
const userdata = JSON.parse(localStorage.getItem("userData"))
const token = getCookie("Token")

const gotoLogin = () => {
  console.log("redirected")
  history.push("/login")
  window.location.reload(true)
}

axios.defaults.baseURL = "http://portaluatadmin.1-label.com"

// axios.defaults.headers.common = {
//   // "Authorization": "Bearer "+process.env.VUE_APP_TOKEN,
//   Authorization: token, // Uncomment when user authorization works
//   Accept: "application/json"
// }

// axios.defaults.headers.common["legalentity"] = userdata?.legalEntity

// axios.interceptors.response.use(
//   (response) => {
//     if (response?.data?.MsgCode === 70002) {
//       gotoLogin()
//       localStorage.removeItem("userData")
//       deleteCookie("Token")
//     }
//     return response
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

export default axios
