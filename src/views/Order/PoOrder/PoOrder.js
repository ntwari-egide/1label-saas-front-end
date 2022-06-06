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
import PreviewAndSummary from "./PreviewAndSummary/PreviewAndSummary"
import InvoiceAndDelivery from "./InvoiceAndDelivery/InvoiceAndDelivery"

const stepperMenu = [
  "Listing",
  "Item List",
  "PO Order Size Table",
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

  // listing data
  const [poSelectedItems, setpoSelectedItems] = useState([])
  const [combinedPOOrderKey, setCombinedPOOrderkey] = useState("")
  const [searchParams, setSearchParams] = useState({})
  const [isPoOrderTemp, setIsPoOrderTemp] = useState("")

  // data of order size Table
  const [wastageApplied, setWastageApplied] = useState(false)
  const [sizeTableTrigger, setSizeTableTrigger] = useState(true)

  // data of Preview and Summary component
  const [sizeTable, setSizeTable] = useState("")
  const [defaultSizeTable, setDefaultSizeTable] = useState("")
  const [sizeMatrixType, setSizeMatrixType] = useState("")

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
            <Link>{t("Order")}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/POOrder">{t("PO Order")}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        component={"POOrder"}
        validationFields={{ poSelectedItems }}
        stepperMenu={stepperMenu}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === 0 ? (
        <Listing
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          setpoSelectedItems={setpoSelectedItems}
          poSelectedItems={poSelectedItems}
          setCombinedPOOrderkey={setCombinedPOOrderkey}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          isPoOrderTemp={isPoOrderTemp}
          setIsPoOrderTemp={setIsPoOrderTemp}
          setSizeTableTrigger={setSizeTableTrigger}
        />
      ) : currentStep === 1 ? (
        <ItemList />
      ) : currentStep === 3 ? (
        <OrderForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          isPoOrderTemp={isPoOrderTemp}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : currentStep === 2 ? (
        <SizeTable
          isPoOrderTemp={isPoOrderTemp}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          lastStep={lastStep}
          combinedPOOrderKey={combinedPOOrderKey}
          wastageApplied={wastageApplied}
          setWastageApplied={setWastageApplied}
          sizeTableTrigger={sizeTableTrigger}
          setSizeTableTrigger={setSizeTableTrigger}
        />
      ) : currentStep === 4 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          setSizeTable={setSizeTable}
          setDefaultSizeTable={setDefaultSizeTable}
          defaultSizeTable={defaultSizeTable}
          setSizeMatrixType={setSizeMatrixType}
          wastageApplied={wastageApplied}
        />
      ) : currentStep === 5 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          sizeTable={sizeTable}
          defaultSizeTable={defaultSizeTable}
          sizeMatrixType={sizeMatrixType}
          wastageApplied={wastageApplied}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  brand: state.poOrderReducer.brand
})

export default connect(mapStateToProps, null)(PoOrder)
