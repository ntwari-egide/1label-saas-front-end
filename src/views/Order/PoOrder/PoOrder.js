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
import { savePOOrder } from "@redux/actions/views/common"

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
  const [isPoOrderTemp, setIsPoOrderTemp] = useState("")
  const [searchParams, setSearchParams] = useState({})

  const setCurrentStepHelper = (value) => {
    dispatch(setCurrentStep(value))
  }

  return (
    <div>
      <input
        hidden
        id="save-Draft"
        onClick={(e) => dispatch(savePOOrder("Draft"))}
      />
      <input
        hidden
        id="save-Confirm"
        onClick={(e) => dispatch(savePOOrder("Confirm"))}
      />
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
        validationFields={{
          poSelectedItems,
          selectedItems: props.selectedItems,
          orderFormManFields: {
            orderReference: props.orderReference,
            projectionLocation: props.projectionLocation,
            expectedDeliveryDate: props.expectedDeliveryDate
          }
        }}
        stepperMenu={stepperMenu}
        currentStep={props.currentStep}
        setCurrentStep={setCurrentStepHelper}
      />
      {props.currentStep === 0 ? (
        <Listing
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
          setpoSelectedItems={setpoSelectedItems}
          poSelectedItems={poSelectedItems}
          setCombinedPOOrderkey={setCombinedPOOrderkey}
          isPoOrderTemp={isPoOrderTemp}
          setIsPoOrderTemp={setIsPoOrderTemp}
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
        />
      ) : props.currentStep === 4 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
        />
      ) : props.currentStep === 5 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  brand: state.poOrderReducer.brand,
  currentStep: state.poOrderReducer.currentStep,
  selectedItems: state.poOrderReducer.selectedItems,
  orderReference: state.poOrderReducer.orderReference,
  projectionLocation: state.poOrderReducer.projectionLocation,
  expectedDeliveryDate: state.poOrderReducer.expectedDeliveryDate
})

export default connect(mapStateToProps, null)(PoOrder)
