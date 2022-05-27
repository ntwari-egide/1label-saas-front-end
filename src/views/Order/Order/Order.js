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

const stepperMenu = [
  "Select Item",
  "Order Form",
  "Preview Item & Summary Size Table",
  "Invoice & Delivery Date",
  "Payment",
  "Direct Print"
]

const Order = () => {
  const { t } = useTranslation()
  // APP states
  const [currentStep, setCurrentStep] = useState(0)
  const [lastStep] = useState(stepperMenu.length - 1)
  const [itemType, setItemType] = useState("")
  const [selectedItems, setSelectedItems] = useState([])

  // data of OrderForm component
  const [careData, setCareData] = useState([{}])
  const [fibreInstructionData, setFibreInstructionData] = useState([{}])
  const [washCareData, setWashCareData] = useState([])
  const [defaultContentData, setDefaultContentData] = useState([""])
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("")
  const [dynamicFieldData, setDynamicFieldData] = useState({})
  const [coo, setCoo] = useState("")
  const [projectionLocation, setProjectionLocation] = useState("")
  const [orderReference, setOrderReference] = useState("")
  const [contentGroup, setContentGroup] = useState("")
  const [contentNumberData, setContentNumberData] = useState({})
  const [careNumberData, setCareNumberData] = useState({})
  const [contentCustomNumber, setContentCustomNumber] = useState("")
  const [careCustomNumber, setCareCustomNumber] = useState("")
  // validations for OrderForm Component
  const [orderFormManFields, setOrderFormManFields] = useState({
    projectionLocation: false,
    expectedDeliveryDate: false,
    orderReference: false
  })

  // data of Preview and Summary component
  const [sizeTable, setSizeTable] = useState("")
  const [defaultSizeTable, setDefaultSizeTable] = useState("")
  const [sizeMatrixType, setSizeMatrixType] = useState("")

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
  //
  useEffect(() => {
    console.log(orderFormManFields)
  }, [orderFormManFields])

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
        stepperMenu={stepperMenu}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        validationFields={{
          selectedItems,
          orderFormManFields: {
            expectedDeliveryDate,
            projectionLocation,
            orderReference
          }
        }}
        setOrderFormManFields={setOrderFormManFields}
        orderFormManFields={orderFormManFields}
        setOrderFormManFields={setOrderFormManFields}
      />
      {currentStep === 0 ? (
        <SelectItem
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
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
          itemType={itemType}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          careData={careData}
          setCareData={setCareData}
          fibreInstructionData={fibreInstructionData}
          setFibreInstructionData={setFibreInstructionData}
          washCareData={washCareData}
          setWashCareData={setWashCareData}
          defaultContentData={defaultContentData}
          setDefaultContentData={setDefaultContentData}
          expectedDeliveryDate={expectedDeliveryDate}
          setExpectedDeliveryDate={setExpectedDeliveryDate}
          dynamicFieldData={dynamicFieldData}
          setDynamicFieldData={setDynamicFieldData}
          setCoo={setCoo}
          projectionLocation={projectionLocation}
          setProjectionLocation={setProjectionLocation}
          orderReference={orderReference}
          setOrderReference={setOrderReference}
          setContentGroup={setContentGroup}
          setContentNumberData={setContentNumberData}
          contentNumberData={contentNumberData}
          careNumberData={careNumberData}
          setCareNumberData={setCareNumberData}
          contentCustomNumber={contentCustomNumber}
          setContentCustomNumber={setContentCustomNumber}
          careCustomNumber={careCustomNumber}
          setCareCustomNumber={setCareCustomNumber}
          orderFormManFields={orderFormManFields}
        />
      ) : currentStep === 2 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          selectedItems={selectedItems}
          setSizeTable={setSizeTable}
          setDefaultSizeTable={setDefaultSizeTable}
          defaultSizeTable={defaultSizeTable}
          setSizeMatrixType={setSizeMatrixType}
        />
      ) : currentStep === 3 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          fibreInstructionData={fibreInstructionData}
          careData={careData}
          washCareData={washCareData}
          defaultContentData={defaultContentData}
          expectedDeliveryDate={expectedDeliveryDate}
          dynamicFieldData={dynamicFieldData}
          sizeTable={sizeTable}
          defaultSizeTable={defaultSizeTable}
          coo={coo}
          selectedItems={selectedItems}
          projectionLocation={projectionLocation}
          orderReference={orderReference}
          sizeMatrixType={sizeMatrixType}
          contentGroup={contentGroup}
          contentNumberData={contentNumberData}
          contentCustomNumber={contentCustomNumber}
          careCustomNumber={careCustomNumber}
          careNumberData={careNumberData}
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
