// ** Third Party Components
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
const us = require("@src/assets/images/flags/us.svg").default
const cn = require("@src/assets/images/flags/cn.svg").default
const de = require("@src/assets/images/flags/de.svg").default
// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap"

const IntlDropdown = () => {
  // ** Hooks
  const { i18n } = useTranslation()

  // ** Vars
  const langObj = {
    en: "English",
    cn: "Chinese",
    de: "German"
  }

  // ** Function to switch Language
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
  }

  useEffect(() => {}, [])

  return (
    <UncontrolledDropdown tag="li" className="dropdown-language nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link align-items-center"
        onClick={(e) => e.preventDefault()}
      >
        <img
          src={i18n.language === "en" ? us : i18n.language === "cn" ? cn : de}
          style={{ height: "20px", width: "20px" }}
        />
        <span style={{ marginLeft: "5px", color: "white", fontWeight: 500 }}>
          {langObj[i18n.language]}
        </span>
      </DropdownToggle>
      <DropdownMenu className="mt-0" end>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "en")}
        >
          <img src={us} style={{ height: "20px", width: "20px" }} />
          <span className="ml-1">English</span>
        </DropdownItem>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "cn")}
        >
          <img src={cn} style={{ height: "20px", width: "20px" }} />
          <span className="ml-1">Chinese</span>
        </DropdownItem>
        <DropdownItem
          href="/"
          tag="a"
          onClick={(e) => handleLangUpdate(e, "de")}
        >
          <img src={de} style={{ height: "20px", width: "20px" }} />
          <span className="ml-1">German</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown
