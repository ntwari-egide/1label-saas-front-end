import Stepper from "../../Stepper"
import { useState, useEffect } from "react"
import { Card, CardBody, Breadcrumb, BreadcrumbItem } from "reactstrap"
import { Link } from "react-router-dom"

const stepperMenu = [
  "Select Item",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery Date",
  "Payment",
  "Direct Print"
]

const PoOrder = () => {
  const [currentStep, setCurrentStep] = useState(0)
  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>PO Order</h2>
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
            <Link to="/Order">PO Order</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        stepperMenu={stepperMenu}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <Card>
        <CardBody></CardBody>
      </Card>
    </div>
  )
}

export default PoOrder
