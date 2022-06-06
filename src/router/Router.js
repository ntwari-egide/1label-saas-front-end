import { Suspense, lazy } from "react"
import { isUserLoggedIn } from "@utils"
import { DefaultRoute, Routes } from "./routes"
// import { HashRouter, Route, Switch, Redirect, AppRouter } from 'react-router-dom'
import { Router as AppRouter, Route, Switch, Redirect } from "react-router-dom"
import LayoutWrapper from "@layouts/components/layout-wrapper"
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import { useRouterTransition } from "@hooks/useRouterTransition"
const NotAuthorized = lazy(() => import("@src/views/NotAuthorized"))
const Error = lazy(() => import("@src/views/Error"))
const Login = lazy(() => import("@src/views/Login"))
import history from "../history"
// const LinkDownload = lazy(() => import('@src/views/LinkDownload'))
// Router function to redner all routes listed in ./routes
// Routes listed in ./routes are authenticated
// For new pages add your content in ./routes/index

const Router = () => {
  const [transition, setTransition] = useRouterTransition()

  const authenticatedRoutes = () => {
    const routerProps = {}
    return (
      <VerticalLayout currentActiveItem={null}>
        <Switch>
          {Routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact === true}
                render={(props) => {
                  // ** Assign props to routerProps
                  Object.assign(routerProps, {
                    ...props,
                    meta: route.meta
                  })
                  if (isUserLoggedIn()) {
                    return (
                      <Suspense fallback={null}>
                        <LayoutWrapper
                          layout="VerticalLayout"
                          transition={transition}
                          setTransition={setTransition}
                          /* Conditional props */
                          /*eslint-disable */
                          {...(route.appLayout
                            ? {
                                appLayout: route.appLayout
                              }
                            : {})}
                          {...(route.meta
                            ? {
                                routeMeta: route.meta
                              }
                            : {})}
                          {...(route.className
                            ? {
                                wrapperClass: route.className
                              }
                            : {})}
                          /*eslint-enable */
                        >
                          <route.component {...props} />
                        </LayoutWrapper>
                      </Suspense>
                    )
                  } else {
                    return <Redirect to="/login" />
                  }
                }}
              />
            )
          })}
          {/* NotFound Error page */}
          <Route path="*" component={Error} />/
        </Switch>
      </VerticalLayout>
    )
  }
  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME} history={history}>
      <Switch>
        {/* Main Link for redirection purpose
          if user is logged in then redirect to defaultRoute else redirect to login page
        */}
        <Route
          exact
          path="/"
          render={() => {
            return isUserLoggedIn() ? (
              <Redirect to={DefaultRoute} />
            ) : (
              <Redirect to="/login" />
            )
          }}
        />
        {/* This route is for not authorized pages */}
        <Route
          exact
          path="/not-authorized"
          render={(props) => (
            <BlankLayout>
              <NotAuthorized />
            </BlankLayout>
          )}
        />
        {/* Login route for login pages
          if user is already logged in then redirect to default route
          else show Login page
        */}
        <Route
          exact
          path="/login"
          render={() => {
            return (
              <BlankLayout>
                <Login />
              </BlankLayout>
            )
          }}
        />
        {/* From Routes Files */}
        {authenticatedRoutes()}
        {/* NotFound Error page */}
        <Route path="*" component={Error} />/
      </Switch>
    </AppRouter>
  )
}
export default Router
