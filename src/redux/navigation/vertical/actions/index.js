import {
  Home,
  Circle,
  Grid,
  Database,
  Globe,
  PieChart,
  Aperture,
  Settings,
  Package,
  Users,
  LifeBuoy
} from "react-feather"
import axios from "@axios"

import staticMenu from "../index"

const menuIconsDict = {
  AccountEnquiry: <Grid />,
  TransactionEnquiry: <Database />,
  AccountClosing: <Globe />,
  FinancialReports: <PieChart />,
  "(Custom)FinancialReports": <Aperture />,
  GlobalMaintenance: <Settings />,
  AccountSubLedger: <Package />,
  AccountSecurity: <Users />,
  HelpDesk: <LifeBuoy />
}

// ** Get dynamic menu
export const fetchVerticalMenuItems = (params) => (dispatch) => {
  // const menuData = []
  // return axios.get("Home/getMenu", { params }).then(
  //   (res) => {
  //     if (res.status === 200) {
  //       console.log("menu", res.data.Data[0])
  //       dispatch({
  //         type: "SET_ACCESS_RIGHTS",
  //         payload: res.data.Data[0]
  //       })
  //       res?.data?.Data[0]?.map((menuItem) => {
  //         // initialize childmenu
  //         const childMenu = []
  //
  //         // initialize menu item obj
  //         let item = {
  //           id: menuItem.funcId,
  //           title: menuItem.funcName,
  //           icon: menuIconsDict[menuItem.funcId],
  //           navLink: menuItem.reactRoute
  //         }
  //
  //         // push to childMenu if exists and update menuItem likewise
  //         if (menuItem.child_menu) {
  //           menuItem.child_menu.map((childItem) => {
  //             childMenu.push({
  //               id: childItem.funcId,
  //               title: childItem.funcName,
  //               icon: <Circle size={10} />,
  //               navLink: childItem.reactRoute
  //             })
  //           })
  //           item = { ...item, children: childMenu }
  //         }
  //
  //         // finally push to menuData array
  //
  //         menuData.push(item)
  //       })
  //
  //       menuData.unshift({
  //         id: "home",
  //         title: "Home",
  //         icon: <Home size={20} />,
  //         navLink: "/home"
  //       })
  //
  //       dispatch({
  //         type: "FETCH_MENU_ITEMS",
  //         data: menuData
  //       })
  //     }
  //   },
  //   (err) => {
  //     console.log("err:", err)
  //   }
  // )
  dispatch({
    type: "FETCH_MENU_ITEMS",
    data: staticMenu
  })
}
