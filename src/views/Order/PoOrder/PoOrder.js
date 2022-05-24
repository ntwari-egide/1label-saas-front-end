import Stepper from "../../Stepper"
import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import Listing from "./Listing/listing"
import { useTranslation } from "react-i18next"
import OrderForm from "./OrderForm/OrderForm"
import SizeTable from "./SizeTable/SizeTable"
import ItemList from "./ItemList/ItemList"

const stepperMenu = [
  "Listing",
  "Item List",
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
  const [searchParams, setSearchParams] = useState({})
  const [isPoOrderTemp, setIsPoOrderTemp] = useState("")
  // Order Form data
  const [dynamicFieldData, setDynamicFieldData] = useState([])
  const [washCareData, setWashCareData] = useState([])
  const [defaultContentData, setDefaultContentData] = useState([""])
  const [fibreInstructionData, setFibreInstructionData] = useState([{}])
  const [careData, setCareData] = useState([{}])
  const [contentGroup, setContentGroup] = useState("")

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
        validationFields={{ selectedItems }}
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
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          isPoOrderTemp={isPoOrderTemp}
          setIsPoOrderTemp={setIsPoOrderTemp}
        />
      ) : currentStep === 1 ? (
        <ItemList />
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
          setWashCareData={setWashCareData}
          washCareData={washCareData}
          isPoOrderTemp={isPoOrderTemp}
          setCareData={setCareData}
          selectedItems={selectedItems}
          combinedPOOrderKey={combinedPOOrderKey}
          setContentGroup={setContentGroup}
        />
      ) : currentStep === 3 ? (
        <SizeTable
          isPoOrderTemp={isPoOrderTemp}
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
