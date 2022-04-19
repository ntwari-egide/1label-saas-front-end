import { useState } from "react"
import SelectItem from "./SelectItem"
import OrderForm from "./OrderForm"
import PreviewAndSummary from "./PreviewAndSummary"
import InvoiceAndDelivery from "./InvoiceAndDeliveryDate"
import Payment from "./Payment"
import Stepper from "../../Stepper"
import DirectPrint from "./DirectPrint"
import { Link } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"

const stepperMenu = [
  "Select Item",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery Date",
  "Payment",
  "Direct Print"
]

const Order = () => {
  // APP states
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>Order</h2>
        <div
          style={{
            borderRight: "thin solid",
            marginLeft: "10px",
            marginBottom: "10px"
          }}
        ></div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/home">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/Order">Order</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        stepperMenu={stepperMenu}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === 0 ? (
        <SelectItem setCurrentStep={setCurrentStep} currentStep={currentStep} />
      ) : currentStep === 1 ? (
        <OrderForm setCurrentStep={setCurrentStep} currentStep={currentStep} />
      ) : currentStep === 2 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ) : currentStep === 3 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ) : currentStep === 4 ? (
        <Payment setCurrentStep={setCurrentStep} currentStep={currentStep} />
      ) : currentStep === 5 ? (
        <DirectPrint
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ) : null}
    </div>
  )
}

export default Order
