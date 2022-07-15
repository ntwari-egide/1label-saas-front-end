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
    <p className="clearfix mb-0">
      <span className="float-md-left d-block d-md-inline-block mt-25">
        <div style={{ display: "-webkit-inline-box" }}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => window.open("https://zplanet.app/en/index.html")}
          >
            <img
              src={themeConfig.app.appLogoImage}
              alt="logo"
              style={{ height: "15px", marginRight: "5px" }}
            />
          </div>
          <div>
            {footerData?.system_company}{" "}
            <Link to="/PrivacyPolicy" target={"_blank"}>
              {footerData?.system_privacy_policy_title}
            </Link>
          </div>
        </div>
      </span>
      <span href="/PrivacyPolicy" className="float-md-right d-none d-md-block">
        {footerData?.system_version}
      </span>
    </p>
  )
}

export default Footer
