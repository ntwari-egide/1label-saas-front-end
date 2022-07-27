import { useState, useEffect } from "react"
import SelectItem from "./SelectItem"
import OrderForm from "./OrderForm/OrderForm"
import PreviewAndSummary from "./PreviewAndSummary"
import InvoiceAndDelivery from "./InvoiceAndDeliveryDate"
import Payment from "./Payment"
import Stepper from "../../Stepper"
import DirectPrint from "./DirectPrint"
import { Link } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import { setCurrentStep, resetData } from "@redux/actions/views/Order/Order"
import { resetData as resetListData } from "@redux/actions/views/Order/List"
import { toggleSaveBtnStatus } from "@redux/actions/layout"
import { saveOrder } from "@redux/actions/views/common"

const stepperMenu = [
  "Select Item",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery Date",
  "Payment",
  "Direct Print"
]

const Order = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // APP states
  // item list states
  const [itemType, setItemType] = useState({})
  const [itemRef, setItemRef] = useState("")
  const [lastStep] = useState(stepperMenu.length - 1)

  // validations for OrderForm Component
  const [orderFormManFields, setOrderFormManFields] = useState({
    productionLocation: false,
    expectedDeliveryDate: false,
    orderReference: false
  })

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
        onClick={(e) => dispatch(saveOrder("Draft"))}
      />
      <input
        hidden
        id="save-Confirm"
        onClick={(e) => dispatch(saveOrder("Confirm"))}
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
          <Link to="/Order" style={{ color: "#5e5873" }}>
            {t("Order")}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/Order" style={{ color: "#5e5873" }}>
            {t("Order")}
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stepper
        component={"Order"}
        stepperMenu={stepperMenu}
        currentStep={props.currentStep}
        setCurrentStep={setCurrentStepHelper}
        validationFields={{
          selectedItems: props.selectedItems,
          orderFormManFields: {
            expectedDeliveryDate: props.expectedDeliveryDate,
            productionLocation: props.productionLocation,
            orderReference: props.orderReference
          }
        }}
        setOrderFormManFields={setOrderFormManFields}
        orderFormManFields={orderFormManFields}
        setOrderFormManFields={setOrderFormManFields}
        brandDetails={props.brandDetails}
      />
      {props.currentStep === 0 ? (
        <SelectItem
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          itemType={itemType}
          setItemType={setItemType}
          itemRef={itemRef}
          setItemRef={setItemRef}
        />
      ) : props.currentStep === 1 ? (
        <OrderForm
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          itemType={itemType}
          orderFormManFields={orderFormManFields}
        />
      ) : props.currentStep === 2 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
        />
      ) : props.currentStep === 3 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
        />
      ) : props.currentStep === 4 ? (
        <Payment
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
        />
      ) : props.currentStep === 5 ? (
        <DirectPrint
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  selectedItems: state.orderReducer.selectedItems,
  productionLocation: state.orderReducer.productionLocation,
  orderReference: state.orderReducer.orderReference,
  expectedDeliveryDate: state.orderReducer.expectedDeliveryDate,
  currentStep: state.orderReducer.currentStep,
  brandDetails: state.orderReducer.brandDetails
})

export default connect(mapStateToProps, null)(Order)
