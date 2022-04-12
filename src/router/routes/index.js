import { lazy } from "react"

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template"

// ** Default Route
const DefaultRoute = "/home"

// ** Merge Routes
const Routes = [
  {
    path: "/login",
    component: lazy(() => import("../../views/Login")),
    layout: "BlankLayout"
  },
  {
    path: "/home",
    component: lazy(() => import("../../views/Home"))
  },
  {
    path: "/error",
    component: lazy(() => import("../../views/Error")),
    layout: "BlankLayout"
  }
]

export { DefaultRoute, TemplateTitle, Routes }
