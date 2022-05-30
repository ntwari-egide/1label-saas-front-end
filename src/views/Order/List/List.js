import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Stepper from "../../Stepper"
import Listing from "./Listing/Listing"

const List = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const stepper = ["Listing", "Details"]

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>{t("List")}</h2>
        <div
          style={{
            borderRight: "thin solid",
            marginLeft: "10px",
            marginBottom: "10px"
          }}
        ></div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/home">{t("Home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link>{t("Order")}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/List">{t("List")}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        stepperMenu={stepper}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === 0 ? <Listing /> : null}
    </div>
  )
}

export default List
