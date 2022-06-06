import Stepper from "../../Stepper"
import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { Link } from "react-router-dom"
import { connect, useDispatch } from "react-redux"
import Listing from "./Listing/listing"
import { useTranslation } from "react-i18next"
import OrderForm from "./OrderForm/OrderForm"
import SizeTable from "./SizeTable/SizeTable"
import ItemList from "./ItemList/ItemList"
import PreviewAndSummary from "./PreviewAndSummary/PreviewAndSummary"
import InvoiceAndDelivery from "./InvoiceAndDelivery/InvoiceAndDelivery"
import { setCurrentStep } from "@redux/actions/views/Order/POOrder"

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

const PoOrder = (props) => {
  // constants
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // app states
  const [lastStep, setLastStep] = useState(stepperMenu.length - 1)

  // listing data
  const [poSelectedItems, setpoSelectedItems] = useState([])
  const [combinedPOOrderKey, setCombinedPOOrderkey] = useState("")
  const [searchParams, setSearchParams] = useState({})
  const [isPoOrderTemp, setIsPoOrderTemp] = useState("")

  // data of order size Table
  const [wastageApplied, setWastageApplied] = useState(false)
  const [sizeTableTrigger, setSizeTableTrigger] = useState(true)

  const setCurrentStepHelper = (value) => {
    dispatch(setCurrentStep(value))
  }

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
        currentStep={props.currentStep}
        setCurrentStep={setCurrentStepHelper}
      />
      {props.currentStep === 0 ? (
        <Listing
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
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
      ) : props.currentStep === 1 ? (
        <ItemList
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
        />
      ) : props.currentStep === 3 ? (
        <OrderForm
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
          isPoOrderTemp={isPoOrderTemp}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : props.currentStep === 2 ? (
        <SizeTable
          isPoOrderTemp={isPoOrderTemp}
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
          combinedPOOrderKey={combinedPOOrderKey}
          wastageApplied={wastageApplied}
          setWastageApplied={setWastageApplied}
          sizeTableTrigger={sizeTableTrigger}
          setSizeTableTrigger={setSizeTableTrigger}
        />
      ) : props.currentStep === 4 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          wastageApplied={wastageApplied}
        />
      ) : props.currentStep === 5 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          wastageApplied={wastageApplied}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  brand: state.poOrderReducer.brand,
  currentStep: state.poOrderReducer.currentStep
})

export default connect(mapStateToProps, null)(PoOrder)
