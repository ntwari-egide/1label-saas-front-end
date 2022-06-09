// ** Dropdowns Imports
import { Fragment, useEffect } from "react"
import { useHistory } from "react-router-dom"
import UserDropdown from "./UserDropdown"
import IntlDropdown from "./IntlDropdown"
import { useDispatch, useSelector } from "react-redux"
import axios from "@axios"

// ** Third Party Components
import {
  Sun,
  Moon,
  Menu,
  PlusCircle,
  Trash2,
  Link,
  Save,
  CornerDownLeft,
  Printer,
  RefreshCw,
  DownloadCloud,
  DollarSign,
  AlignJustify,
  Columns,
  Calendar,
  Search
} from "react-feather"
import { NavItem, NavLink, UncontrolledTooltip } from "reactstrap"

const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
  const store = useSelector((state) => state)
  const { linkbtnStatus, navbarBtnStatus } = store
  const history = useHistory()
  const dispatch = useDispatch()
  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />
    }
  }

  function handleSave() {
    if (document.getElementById("page-specific-save")) {
      document.getElementById("page-specific-save").click()
    }
  }

  function handlePrint() {
    if (document.getElementById("page-specific-print")) {
      document.getElementById("page-specific-print").click()
    }
  }

  function handleCreate() {
    if (document.getElementById("page-specific-create")) {
      document.getElementById("page-specific-create").click()
    }
  }

  function handleRemove() {
    if (document.getElementById("page-specific-delete")) {
      document.getElementById("page-specific-delete").click()
    }
  }

  function handleSearch() {
    if (document.getElementById("page-specific-search")) {
      document.getElementById("page-specific-search").click()
    }
  }

  const handleDocUpload = () => {
    if (document.getElementById("page-specific-doc-upload")) {
      document.getElementById("page-specific-doc-upload").click()
    }
  }

  return (
    <Fragment>
      <ul className="navbar-nav d-xl-none d-flex align-items-center">
        <NavItem className="mobile-menu mr-auto">
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs is-active"
            onClick={() => setMenuVisibility(true)}
          >
            <Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <ul className="nav navbar-nav align-items-center">
        <NavItem className="d-none d-lg-block">
          <NavLink
            className="nav-link-style"
            // disabled={!navbarBtnStatus.addBtn}
          >
            <PlusCircle
              className="ficon"
              id="NewGeneralForm"
              onClick={() => handleCreate()}
            />
            <UncontrolledTooltip target="NewGeneralForm">
              New
            </UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className="d-none d-lg-block">
          <NavLink
            className="nav-link-style"
            // disabled={!navbarBtnStatus.deleteBtn}
          >
            <Trash2
              className="ficon"
              id="DeleteGeneralForm"
              onClick={() => handleRemove()}
            />
            <UncontrolledTooltip target="DeleteGeneralForm">
              Delete
            </UncontrolledTooltip>
          </NavLink>
        </NavItem>
        {store.layout?.renderSaveDraftOrderButton ? (
          <NavItem className="d-none d-lg-block">
            <NavLink
              className="nav-link-style"
              // disabled={!navbarBtnStatus.saveBtn}
            >
              <Save
                className="ficon"
                id="Save-Draft"
                onClick={() => handleSave()}
              />
              <UncontrolledTooltip target="Save-Draft">
                Save Draft
              </UncontrolledTooltip>
            </NavLink>
          </NavItem>
        ) : null}
        <NavItem className="d-none d-lg-block">
          <NavLink
            className="nav-link-style"
            // disabled={!navbarBtnStatus.saveBtn}
          >
            <Save
              className="ficon"
              id="Save-Confirm"
              onClick={() => handleSave()}
            />
            <UncontrolledTooltip target="Save-Confirm">
              Save Confirm
            </UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <CornerDownLeft className="ficon" id="Back" />
            <UncontrolledTooltip target="Back">Back</UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <Printer
              className="ficon"
              id="Print"
              onClick={() => handlePrint()}
            />
            <UncontrolledTooltip target="Print">Print</UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <RefreshCw className="ficon" id="Refresh" />
            <UncontrolledTooltip target="Refresh">Refresh</UncontrolledTooltip>
          </NavLink>
        </NavItem>
        {/*}
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <DownloadCloud className='ficon' id='LoadOS' />
            <UncontrolledTooltip target='LoadOS'>Load OS</UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <DollarSign className='ficon' id='FxGL' />
            <UncontrolledTooltip target='FxGL'>Fx Gain/Loss</UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <AlignJustify className='ficon' id='CalBalance' />
            <UncontrolledTooltip target='CalBalance'>Cal. Balance</UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            <Columns className='ficon' id='SetCustomizationColumns' onClick={() => dispatch(setCustom(true))} />
            <UncontrolledTooltip target='SetCustomizationColumns'>Set Customization Columns</UncontrolledTooltip>
          </NavLink>
        </NavItem>
    */}
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style" disabled={!linkbtnStatus}>
            <Link
              className="ficon"
              id="documents"
              onClick={() => handleDocUpload()}
            />
            <UncontrolledTooltip target="documents">
              Documents
            </UncontrolledTooltip>
          </NavLink>
        </NavItem>
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <Search
              className="ficon"
              id="setsearch"
              onClick={() => handleSearch()}
            />
            <UncontrolledTooltip target="setsearch">Search</UncontrolledTooltip>
          </NavLink>
        </NavItem>
      </ul>
      <ul className="nav navbar-nav align-items-center ml-auto">
        <IntlDropdown />
        <UserDropdown />
      </ul>
    </Fragment>
  )
}

export default NavbarUser
