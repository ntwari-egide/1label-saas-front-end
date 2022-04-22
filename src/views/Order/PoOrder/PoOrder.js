import Stepper from "../../Stepper"
import { useState, useEffect } from "react"
import { Card, CardBody, Breadcrumb, BreadcrumbItem } from "reactstrap"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const stepperMenu = [
  "Select Item",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery Date",
  "Payment",
  "Direct Print"
]

const PoOrder = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>{t("PO Order")}</h2>
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
            <Link to="/Order">{t("PO Order")}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        stepperMenu={stepperMenu}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <Card>
        <CardBody></CardBody>
      </Card>
    </div>
  )
}

export default PoOrder
