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
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState({ value: 10, label: 10 })
  const [orderDateFrom, setOrderDateFrom] = useState("")
  const [orderDateTo, setOrderDateTo] = useState("")
  const [totalPages, setTotalPages] = useState(0)

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
          <Link>{t("Order")}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/List">{t("List")}</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Stepper
        stepperMenu={stepper}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      {currentStep === 0 ? (
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
      ) : currentStep === 1 ? (
        <Details />
      ) : null}
    </div>
  )
}

export default List
