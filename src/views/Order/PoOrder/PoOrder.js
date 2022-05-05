import Stepper from "../../Stepper"
import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import Listing from "./Listing/listing"
import { useTranslation } from "react-i18next"
import OrderForm from "./OrderForm"

const stepperMenu = [
  "Listing",
  "Select Item",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery Date",
  "Payment",
  "Direct Print"
]

const PoOrder = () => {
  // constants
  const { t } = useTranslation()
  // app states
  const [currentStep, setCurrentStep] = useState(0)
  const [lastStep, setLastStep] = useState(stepperMenu.length - 1)
  // Order Form data
  const [dynamicFieldData, setDynamicFieldData] = useState([])
  const [fibreInstructionData, setFibreInstructionData] = useState([{}])
  const [defaultContentData, setDefaultContentData] = useState([{}])
  const [careData, setCareData] = useState([{}])

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
      {currentStep === 0 ? (
        <Listing
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
        />
      ) : currentStep === 2 ? (
        <OrderForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          dynamicFieldData={dynamicFieldData}
          setDynamicFieldData={setDynamicFieldData}
          fibreInstructionData={fibreInstructionData}
          setFibreInstructionData={setFibreInstructionData}
          defaultContentData={defaultContentData}
          setDefaultContentData={setDefaultContentData}
          careData={careData}
          setCareData={setCareData}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  brand: state.orderReducer.brand
})

export default connect(mapStateToProps, null)(PoOrder)
