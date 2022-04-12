// ** Icons Import
import themeConfig from "@configs/themeConfig"

const Footer = () => {
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
            © {new Date().getFullYear()} Account System - Powered by a4appz
            Limited. Member of SiiA Group. All rights reserved.
          </div>
        </div>
      </span>
      <span className="float-md-right d-none d-md-block">
        Demo Site - Version # 1.00
        {/* <Heart size={14} /> */}
      </span>
    </p>
  )
}

export default Footer
