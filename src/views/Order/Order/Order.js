import { useState, useEffect } from "react"
import SelectItem from "./SelectItem"
import OrderForm from "./OrderForm"
import PreviewAndSummary from "./PreviewAndSummary"
import InvoiceAndDelivery from "./InvoiceAndDeliveryDate"
import Payment from "./Payment"
import Stepper from "../../Stepper"
import DirectPrint from "./DirectPrint"
import { Link } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import { setCurrentStep } from "@redux/actions/views/Order/Order"
import { toggleSaveBtnStatus } from "@redux/actions/layout"

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
  const [lastStep] = useState(stepperMenu.length - 1)
  const [itemType, setItemType] = useState("")

  // summary states
  const [sizeMatrixSelect, setSizeMatrixSelect] = useState({})

  // validations for OrderForm Component
  const [orderFormManFields, setOrderFormManFields] = useState({
    projectionLocation: false,
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
    }
  }, [])

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>{t("Order")}</h2>
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
            <Link to="/Order">{t("Order")}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/Order">{t("Order")}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        component={"Order"}
        stepperMenu={stepperMenu}
        currentStep={props.currentStep}
        setCurrentStep={setCurrentStepHelper}
        validationFields={{
          selectedItems: props.selectedItems,
          orderFormManFields: {
            expectedDeliveryDate: props.expectedDeliveryDate,
            projectionLocation: props.projectionLocation,
            orderReference: props.orderReference
          }
        }}
        setOrderFormManFields={setOrderFormManFields}
        orderFormManFields={orderFormManFields}
        setOrderFormManFields={setOrderFormManFields}
      />
      {props.currentStep === 0 ? (
        <SelectItem
          setCurrentStep={setCurrentStepHelper}
          currentStep={props.currentStep}
          lastStep={lastStep}
          itemType={itemType}
          setItemType={setItemType}
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
          sizeMatrixSelect={sizeMatrixSelect}
          setSizeMatrixSelect={setSizeMatrixSelect}
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
  projectionLocation: state.orderReducer.projectionLocation,
  orderReference: state.orderReducer.orderReference,
  expectedDeliveryDate: state.orderReducer.expectedDeliveryDate,
  currentStep: state.orderReducer.currentStep
})

export default connect(mapStateToProps, null)(Order)
