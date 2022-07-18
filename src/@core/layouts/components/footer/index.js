// ** react imports
import { useEffect, useState } from "react"
// ** other imports
import themeConfig from "@configs/themeConfig"
import { Link } from "react-router-dom"
import axios from "@axios"

const Footer = () => {
  const [footerData, setFooterData] = useState({})

  // API Service
  const fetchSystemFooterInfo = () => {
    axios
      .post("/menu/GetSystemFooterInfo")
      .then((res) => {
        if (res.status === 200) {
          setFooterData(res.data)
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSystemFooterInfo()
  }, [])

  return (
    <p className="clearfix mb-0 text-center">
      <span className="d-block d-md-inline-block mt-25">
        <div style={{ display: "-webkit-inline-box" }}>
          <div style={{ cursor: "pointer" }}>
            <img
              src={themeConfig.app.appLogoImage}
              alt="logo"
              style={{ height: "15px", marginRight: "5px" }}
            />
          </div>
          <div>
            {footerData?.system_company}{" "}
            <Link>{footerData?.system_privacy_policy_title}</Link>
          </div>
        </div>
      </span>
      <span className="float-md-right d-none d-md-block">
        {footerData?.system_version}
      </span>
    </p>
  )
}

export default Footer
