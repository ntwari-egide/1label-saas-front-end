import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Stepper from "../../Stepper"
import Listing from "./Listing/Listing"
import Details from "./Details/Details"

const List = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const stepper = ["Listing", "Details"]
  // data for listing page
  const [orderList, setOrderList] = useState([])
  const [selectedOrder, setSelectedOrder] = useState({})
  const [pageDisabled, setPageDisabled] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState({ value: 10, label: 10 })
  const [orderDateFrom, setOrderDateFrom] = useState("")
  const [orderDateTo, setOrderDateTo] = useState("")

  // useEffect(() => {
  //   console.log("selectedOrder", selectedOrder)
  // }, [selectedOrder])

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>{t("List")}</h2>
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
            <Link to="/List">{t("List")}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Stepper
        stepperMenu={stepper}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === 0 ? (
        <Listing
          setCurrentStep={setCurrentStep}
          setSelectedOrder={setSelectedOrder}
          setPageDisabled={setPageDisabled}
          orderList={orderList}
          setOrderList={setOrderList}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          recordsPerPage={recordsPerPage}
          setRecordsPerPage={setRecordsPerPage}
          orderDateFrom={orderDateFrom}
          setOrderDateFrom={setOrderDateFrom}
          orderDateTo={orderDateTo}
          setOrderDateTo={setOrderDateTo}
        />
      ) : currentStep === 1 ? (
        <Details selectedOrder={selectedOrder} pageDisabled={pageDisabled} />
      ) : null}
    </div>
  )
}

export default List
