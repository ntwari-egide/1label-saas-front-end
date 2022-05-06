import Stepper from "../../Stepper"
import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import Listing from "./Listing/listing"
import { useTranslation } from "react-i18next"
import OrderForm from "./OrderForm/OrderForm"
import SizeTable from "./SizeTable/SizeTable"

const stepperMenu = [
  "Listing",
  "Select Item",
  "Order Form",
  "PO Order Size Table",
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
  // listing data
  const [selectedItems, setSelectedItems] = useState([])
  const [brand, setBrand] = useState({})
  const [combinedPOOrderKey, setCombinedPOOrderkey] = useState("")
  const [isPoOrderTemp, setIsPoOrderTemp] = useState("")
  const [searchParams, setSearchParams] = useState({})
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
          brand={brand}
          setBrand={setBrand}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          setCombinedPOOrderkey={setCombinedPOOrderkey}
          setIsPoOrderTemp={setIsPoOrderTemp}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      ) : currentStep === 2 ? (
        <OrderForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          brand={brand}
          dynamicFieldData={dynamicFieldData}
          setDynamicFieldData={setDynamicFieldData}
          fibreInstructionData={fibreInstructionData}
          setFibreInstructionData={setFibreInstructionData}
          defaultContentData={defaultContentData}
          setDefaultContentData={setDefaultContentData}
          careData={careData}
          setCareData={setCareData}
          selectedItems={selectedItems}
          combinedPOOrderKey={combinedPOOrderKey}
          isPoOrderTemp={isPoOrderTemp}
        />
      ) : currentStep === 3 ? (
        <SizeTable
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          brand={brand}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  brand: state.orderReducer.brand
})

export default connect(mapStateToProps, null)(PoOrder)
