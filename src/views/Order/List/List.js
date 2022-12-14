import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Stepper from "../../Stepper"
import Listing from "./Listing/Listing"
import Details from "./Details/Details"

const List = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState("Listing")
  const stepper = ["Listing", "Details"]
  // data for listing page
  const [orderList, setOrderList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState({ value: 10, label: 10 })
  const [orderDateFrom, setOrderDateFrom] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 2))
  )
  const [orderDateTo, setOrderDateTo] = useState(new Date())
  const [totalPages, setTotalPages] = useState("...")

  // useEffect(() => {
  //   console.log("selectedOrder", selectedOrder)
  // }, [selectedOrder])

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/home">{t("Home")}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link style={{ color: "#5e5873" }}>{t("Order")}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/List" style={{ color: "#5e5873" }}>
            {t("List")}
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stepper
        stepperMenu={stepper}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === "Listing" ? (
        <Listing
          setCurrentStep={setCurrentStep}
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
          totalPages={totalPages}
          setTotalPages={setTotalPages}
        />
      ) : currentStep === "Details" ? (
        <Details />
      ) : null}
    </div>
  )
}

export default List
