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
import {
  setCurrentStep,
  resetData,
  setCols
} from "@redux/actions/views/Order/POOrder"
import { resetData as resetListData } from "@redux/actions/views/Order/List"
import { savePOOrder } from "@redux/actions/views/common"
import { toggleSaveBtnStatus } from "@redux/actions/layout"

const stepperMenu = [
  "Listing",
  "Item List",
  "PO Order Size Table",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery",
  "Payment",
  "Direct Print"
]

const PoOrder = (props) => {
  // constants
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // app states

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

  useEffect(() => {
    // populate dynamic cols while visiting from listing page
    // to avoid visiting size table page before summary page for dynamic cols
    if (
      props.sizeData.length &&
      !props.cols.length &&
      props.selectedItems.length
    ) {
      dispatch(setCols(props.sizeData, "N"))
    }
  }, [props.sizeData, props.selectedItems])

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
          setCombinedPOOrderkey={setCombinedPOOrderkey}
          isPoOrderTemp={isPoOrderTemp}
          setIsPoOrderTemp={setIsPoOrderTemp}
          stepperMenu={stepperMenu}
        />
      ) : props.currentStep === "Item List" ? (
        <ItemList
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          stepperMenu={stepperMenu}
        />
      ) : props.currentStep === "Order Form" ? (
        <OrderForm
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          isPoOrderTemp={isPoOrderTemp}
          combinedPOOrderKey={combinedPOOrderKey}
          stepperMenu={stepperMenu}
        />
      ) : props.currentStep === "PO Order Size Table" ? (
        <SizeTable
          isPoOrderTemp={isPoOrderTemp}
          currentStep={props.currentStep}
          setCurrentStep={setCurrentStepHelper}
          combinedPOOrderKey={combinedPOOrderKey}
          stepperMenu={stepperMenu}
        />
      ) : props.currentStep === "Preview Item & Summary Size Table" ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          stepperMenu={stepperMenu}
        />
      ) : props.currentStep === "Invoice & Delivery" ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          combinedPOOrderKey={combinedPOOrderKey}
          stepperMenu={stepperMenu}
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
  poSelectedOrders: state.poOrderReducer.poSelectedOrders,
  isOrderNew: state.listReducer.isOrderNew,
  sizeData: state.poOrderReducer.sizeData,
  cols: state.poOrderReducer.cols
})

export default connect(mapStateToProps, null)(PoOrder)
