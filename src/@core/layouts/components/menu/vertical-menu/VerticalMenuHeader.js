// ** React Imports
import { useEffect } from "react"
import { NavLink } from "react-router-dom"

// ** Third Party Components
import { Disc, X, Circle } from "react-feather"

// ** Config
import themeConfig from "@configs/themeConfig"

const siia = require("@src/assets/images/logo/siia-logo.png").default

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover
  } = props

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => {
            setMenuCollapsed(true)
          }}
        />
      )
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      )
    }
  }

  return (
    <div
      className="navbar-header"
      style={{
        minHeight: "120px"
      }}
    >
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item mr-auto">
          <NavLink to="/" className="navbar-brand">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "5%", marginLeft: "19%" }}>
                <span className="brand-text">
                  <img
                    src={siia}
                    alt="logo"
                    style={{
                      minHeight: "28px",
                      minWidth: "100px",
                      marginTop: "5%"
                    }}
                  />
                </span>
              </div>
              <div
                style={{
                  marginLeft: "38%",
                  marginTop: "10%"
                }}
              >
                <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
              </div>
            </div>
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div>
            <div className="nav-link modern-nav-toggle cursor-pointer">
              <div
                style={{
                  marginTop: "280%"
                }}
              >
                <Toggler />
              </div>
              <X
                onClick={() => setMenuVisibility(false)}
                className="toggle-icon icon-x d-block d-xl-none"
                size={20}
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
