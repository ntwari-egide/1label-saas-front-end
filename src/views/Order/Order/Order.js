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
import { XMLParser } from "fast-xml-parser"

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
  const [lastStep] = useState(stepperMenu.length - 1)
  const [brand, setBrand] = useState("")
  const [itemType, setItemType] = useState("")
  const [selectedItems, setSelectedItems] = useState([])

  // const xmlToObj = () => {
  //   const xml = "<SizeMatrix>".concat(
  //     "<Table> <Column0>TITLE</Column0> <Column1>size</Column1> <Column2>s</Column2> <Column3>m</Column3> <Column4>l</Column4> </Table>".repeat(
  //       500
  //     ),
  //     "</SizeMatrix>"
  //   )
  //   console.log("xml", xml)
  //   const parser = new XMLParser()
  //   console.log(parser.parse(xml))
  // }
  //
  // useEffect(() => {
  //   xmlToObj()
  // }, [])

  useEffect(() => {
    console.log("brand", brand, "itemType", itemType)
  }, [brand, itemType])

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
        <SelectItem
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          brand={brand}
          setBrand={setBrand}
          itemType={itemType}
          setItemType={setItemType}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : currentStep === 1 ? (
        <OrderForm
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          brand={brand}
          itemType={itemType}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : currentStep === 2 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
        />
      ) : currentStep === 3 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
        />
      ) : currentStep === 4 ? (
        <Payment
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
        />
      ) : currentStep === 5 ? (
        <DirectPrint
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
        />
      ) : null}
    </div>
  )
}

export default Order
