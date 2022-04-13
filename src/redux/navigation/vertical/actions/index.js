import { Home, Circle, FileMinus, Briefcase, Grid } from "react-feather"
import axios from "@axios"

const menuIconsDict = {
  Print: <FileMinus />,
  Order: <Grid size={20} />,
  "Invoice / Online Payment": <Briefcase />
}

// ** Get dynamic menu
export const fetchVerticalMenuItems = () => (dispatch) => {
  const body = {
    menu_type: "front"
  }
  let menuItems = []
  menuItems.push({
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home"
  })
  return axios.post("/GetMenuList", body).then(
    (res) => {
      if (res.status === 200) {
        console.log("menu data", res)
        res.data.map((item) => {
          let menuItem = {}
          let childList = []
          if (item.child_menu) {
            item.child_menu.map((ch) => {
              childList.push({
                id: ch.name,
                title: ch.name,
                icon: <Circle size={15} />,
                navLink: ch.route
              })
            })
          }
          menuItem = {
            ...menuItem,
            id: "name",
            title: item.name,
            icon: menuIconsDict[item.name],
            navLink: "/",
            children: childList
          }
          menuItems = [...menuItems, menuItem]
        })
        dispatch({
          type: "FETCH_MENU_ITEMS",
          payload: menuItems
        })
      }
    },
    (err) => {
      console.log("err:", err)
    }
  )
}
