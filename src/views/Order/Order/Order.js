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
import { connect } from "react-redux"

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
  // APP states
  const [currentStep, setCurrentStep] = useState(0)
  const [lastStep] = useState(stepperMenu.length - 1)
  const [itemType, setItemType] = useState("")

  // data of OrderForm component
  const [dynamicFieldData, setDynamicFieldData] = useState({})
  const [contentGroup, setContentGroup] = useState("")
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
  // useEffect(() => {
  //   console.log("selectedItems", selectedItems)
  // }, [selectedItems])

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
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
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
      {currentStep === 0 ? (
        <SelectItem
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          itemType={itemType}
          setItemType={setItemType}
        />
      ) : currentStep === 1 ? (
        <OrderForm
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
          itemType={itemType}
          dynamicFieldData={dynamicFieldData}
          setDynamicFieldData={setDynamicFieldData}
          setContentGroup={setContentGroup}
          orderFormManFields={orderFormManFields}
        />
      ) : currentStep === 2 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          lastStep={lastStep}
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
          dynamicFieldData={dynamicFieldData}
          sizeTable={sizeTable}
          defaultSizeTable={defaultSizeTable}
          sizeMatrixType={sizeMatrixType}
          contentGroup={contentGroup}
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

const mapStateToProps = (state) => ({
  selectedItems: state.orderReducer.selectedItems,
  projectionLocation: state.orderReducer.projectionLocation,
  orderReference: state.orderReducer.orderReference,
  expectedDeliveryDate: state.orderReducer.expectedDeliveryDate
})

export default connect(mapStateToProps, null)(Order)
