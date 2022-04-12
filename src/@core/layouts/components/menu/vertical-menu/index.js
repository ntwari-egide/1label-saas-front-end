// ** React Imports
import { Fragment, useState, useRef, useEffect } from "react"
import { connect, useDispatch } from "react-redux"
// ** Vertical Menu Items Array
// import navigation from "@src/redux/navigation/vertical"
// import { one_print } from "@src/redux/navigation/vertical/index"
import { fetchVerticalMenuItems } from "../../../../../redux/navigation/vertical/actions/index"
// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"

import { Label } from "reactstrap"

// ** Vertical Menu Components
import VerticalMenuHeader from "./VerticalMenuHeader"
import VerticalNavMenuItems from "./VerticalNavMenuItems"

import { home, one_print, admin } from "@src/redux/navigation/vertical/index"

const Sidebar = (props) => {
  const dispatch = useDispatch()
  // ** Props
  const { menuCollapsed, routerProps, menu, currentActiveItem, skin } = props

  // ** States
  const [groupOpen, setGroupOpen] = useState([])
  const [groupActive, setGroupActive] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  // ** Menu Hover State
  const [menuHover, setMenuHover] = useState(false)

  // ** Ref
  const shadowRef = useRef(null)

  // ** Function to handle Mouse Enter
  const onMouseEnter = () => {
    if (menuCollapsed) {
      setMenuHover(true)
    }
  }

  // ** Scroll Menu
  const scrollMenu = (container) => {
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.add("d-block")
      }
    } else {
      if (shadowRef.current.classList.contains("d-block")) {
        shadowRef.current.classList.remove("d-block")
      }
    }
  }

  useEffect(() => {
    dispatch(fetchVerticalMenuItems())
  }, [])

  return (
    <Fragment>
      <div
        className={classnames(
          "main-menu menu-fixed menu-accordion menu-shadow",
          {
            expanded: menuHover || menuCollapsed === false,
            "menu-light": skin !== "semi-dark" && skin !== "dark",
            "menu-dark": skin === "semi-dark" || skin === "dark"
          }
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setMenuHover(false)}
      >
        {menu ? (
          menu
        ) : (
          <Fragment>
            {/* Vertical Menu Header */}
            <VerticalMenuHeader
              setGroupOpen={setGroupOpen}
              menuHover={menuHover}
              {...props}
            />
            {/* Vertical Menu Header Shadow */}
            <div className="shadow-bottom" ref={shadowRef}></div>
            {/* Perfect Scrollbar */}
            <PerfectScrollbar
              className="main-menu-content"
              options={{ wheelPropagation: false }}
              onScrollY={(container) => scrollMenu(container)}
            >
              <ul className="navigation navigation-main">
                <VerticalNavMenuItems
                  items={home}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  groupOpen={groupOpen}
                  setGroupOpen={setGroupOpen}
                  routerProps={routerProps}
                  menuCollapsed={menuCollapsed}
                  menuHover={menuHover}
                  currentActiveItem={currentActiveItem}
                />
                <div
                  style={{
                    marginLeft: "10%",
                    marginTop: "5%"
                  }}
                >
                  <Label>ONE & PRINT</Label>
                </div>
                <VerticalNavMenuItems
                  items={one_print}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  groupOpen={groupOpen}
                  setGroupOpen={setGroupOpen}
                  routerProps={routerProps}
                  menuCollapsed={menuCollapsed}
                  menuHover={menuHover}
                  currentActiveItem={currentActiveItem}
                />
                <div
                  style={{
                    marginLeft: "10%",
                    marginTop: "5%"
                  }}
                >
                  <Label>ADMIN</Label>
                </div>
                <VerticalNavMenuItems
                  items={admin}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  groupOpen={groupOpen}
                  setGroupOpen={setGroupOpen}
                  routerProps={routerProps}
                  menuCollapsed={menuCollapsed}
                  menuHover={menuHover}
                  currentActiveItem={currentActiveItem}
                />

                {/*}
                <VerticalNavMenuItems
                  items={props.menuItems}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  groupOpen={groupOpen}
                  setGroupOpen={setGroupOpen}
                  routerProps={routerProps}
                  menuCollapsed={menuCollapsed}
                  menuHover={menuHover}
                  currentActiveItem={currentActiveItem}
                />
          */}
              </ul>
            </PerfectScrollbar>
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

const mapStateToProps = (state) => ({
  menuItems: state.verticalMenuReducer.menuItems
})

export default connect(mapStateToProps, {})(Sidebar)
// export default Sidebar
