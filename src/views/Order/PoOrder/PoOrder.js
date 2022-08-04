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
import { setCurrentStep, resetData } from "@redux/actions/views/Order/POOrder"
import { resetData as resetListData } from "@redux/actions/views/Order/List"
import { savePOOrder } from "@redux/actions/views/common"
import { toggleSaveBtnStatus } from "@redux/actions/layout"

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
  const [combinedPOOrderKey, setCombinedPOOrderkey] = useState("")
  const [isPoOrderTemp, setIsPoOrderTemp] = useState("")

  // dynamic columns data

  const setCurrentStepHelper = (value) => {
    dispatch(setCurrentStep(value))
  }

  useEffect(() => {
    dispatch(toggleSaveBtnStatus(true))

    return () => {
      dispatch(toggleSaveBtnStatus(false))
      dispatch(resetData())
      dispatch(resetListData())
    }
  }, [])

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
      <input
        hidden
        id="page-specific-create"
        onClick={() => {
          dispatch(resetData())
          dispatch(resetListData())
        }}
      />
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/home">{t("Home")}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link style={{ color: "#5e5873" }}>{t("Order")}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/POOrder" style={{ color: "#5e5873" }}>
            {t("PO Order")}
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stepper
        component={"POOrder"}
        validationFields={{
          poSelectedOrders: props.poSelectedOrders,
          selectedItems: props.selectedItems,
          orderFormManFields: {
            orderReference: props.orderReference,
            productionLocation: props.productionLocation,
            expectedDeliveryDate: props.expectedDeliveryDate
          }
        }}
        stepperMenu={stepperMenu}
        currentStep={props.currentStep}
        setCurrentStep={setCurrentStepHelper}
        brandDetails={props.brandDetails}
      />
      {props.currentStep === "Listing" ? (
        <Listing
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
          setCombinedPOOrderkey={setCombinedPOOrderkey}
          isPoOrderTemp={isPoOrderTemp}
          setIsPoOrderTemp={setIsPoOrderTemp}
        />
      ) : props.currentStep === "Item List" ? (
        <ItemList
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
        />
      ) : props.currentStep === "Order Form" ? (
        <OrderForm
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
          isPoOrderTemp={isPoOrderTemp}
          combinedPOOrderKey={combinedPOOrderKey}
        />
      ) : props.currentStep === "PO Order Size Table" ? (
        <SizeTable
          isPoOrderTemp={isPoOrderTemp}
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          lastStep={lastStep}
          combinedPOOrderKey={combinedPOOrderKey}
          cols={props.cols}
        />
      ) : props.currentStep === "Preview Item & Summary Size Table" ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          cols={props.cols}
        />
      ) : props.currentStep === "Invoice & Delivery Date" ? (
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
  productionLocation: state.poOrderReducer.productionLocation,
  expectedDeliveryDate: state.poOrderReducer.expectedDeliveryDate,
  brandDetails: state.poOrderReducer.brandDetails,
  cols: state.poOrderReducer.cols,
  poSelectedOrders: state.poOrderReducer.poSelectedOrders,
  isOrderNew: state.listReducer.isOrderNew
})

export default connect(mapStateToProps, null)(PoOrder)
