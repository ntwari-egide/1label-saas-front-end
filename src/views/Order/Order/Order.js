import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import { Check, FileMinus } from "react-feather"
import axios from "@axios"
import Chart from "react-apexcharts"
import DataTable from "react-data-table-component"
import CheckBox from "@components/CheckBox/CheckBox"
import Select from "react-select"
import SelectItem from "./SelectItem"
import OrderForm from "./OrderForm"
import PreviewAndSummary from "./PreviewAndSummary"
import InvoiceAndDelivery from "./InvoiceAndDeliveryDate"
import Payment from "./Payment"
import DirectPrint from "./DirectPrint"
import { Link } from "react-router-dom"
import {
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardTitle,
  CardFooter,
  Breadcrumb,
  BreadcrumbItem,
  Label,
  Input,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"

const Order = () => {
  // APP states
  const [brandOptions, setBrandOptions] = useState([])
  const [brand, setBrand] = useState(null)
  const [itemTypeOptions, setItemTypeOptions] = useState([])
  const [itemType, setItemType] = useState(null)
  const [itemList, setItemList] = useState([])
  const [item, setItem] = useState(null)
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)
  const [checkedList, setCheckedList] = useState([])
  const [loader, setLoader] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleCheckListChange = (id) => {
    let tempList = checkedList
    if (checkedList.includes(id)) {
      tempList.splice(tempList.indexOf(id), 1)
      setCheckedList([...tempList])
    } else {
      setCheckedList([...tempList, id])
    }
  }

  // API services
  const fetchBrandList = () => {
    const body = {
      order_user: "innoa"
    }
    axios.post("/Brand/GetBrandListByClient", body).then((res) => {
      if (res.status === 200) {
        setBrandOptions(
          res.data.map((br) => ({ value: br.guid_key, label: br.brand_name }))
        )
      }
    })
  }

  const fetchItemTypeOptions = () => {
    axios.post("/Item/GetItemTypeList").then((res) => {
      if (res.status === 200) {
        setItemTypeOptions(
          res.data.map((itm) => ({
            value: itm.id,
            label: itm.item_type_name,
            parent_id: itm.parent_id
          }))
        )
      }
    })
  }

  const fetchItemList = (brand = "", item_type = "") => {
    setLoader(true)
    setVisibleCardIndex(0)
    const body = {
      order_user: "innoa",
      brand_key: brand?.value,
      item_ref_type: item_type?.value
    }
    axios.post("/Item/GetItemRefList", body).then((res) => {
      if (res.status === 200) {
        setLoader(false)
        setItemList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchBrandList()
    fetchItemTypeOptions()
    fetchItemList()
  }, [])

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
      <div style={{ paddingBottom: "10px" }}>
        <Breadcrumb>
          <BreadcrumbItem>
            <div className="custom-stepper" onClick={() => setCurrentStep(1)}>
              <div
                id="selectItemIcon"
                className={
                  currentStep === 1
                    ? "stepper-active-icon"
                    : currentStep > 1
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    currentStep === 1
                      ? "stepper-active-text"
                      : currentStep > 1
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  Select Item
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <div className="custom-stepper" onClick={() => setCurrentStep(2)}>
              <div
                id="selectItemIcon"
                className={
                  currentStep === 2
                    ? "stepper-active-icon"
                    : currentStep > 2
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    currentStep === 2
                      ? "stepper-active-text"
                      : currentStep > 2
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  Order Form
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <div className="custom-stepper" onClick={() => setCurrentStep(3)}>
              <div
                id="selectItemIcon"
                className={
                  currentStep === 3
                    ? "stepper-active-icon"
                    : currentStep > 3
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    currentStep === 3
                      ? "stepper-active-text"
                      : currentStep > 3
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  Preview Item & Summary Size Table
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <div className="custom-stepper" onClick={() => setCurrentStep(4)}>
              <div
                id="selectItemIcon"
                className={
                  currentStep === 4
                    ? "stepper-active-icon"
                    : currentStep > 4
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    currentStep === 4
                      ? "stepper-active-text"
                      : currentStep > 4
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  Invoice & Delivery Date
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <div className="custom-stepper" onClick={() => setCurrentStep(5)}>
              <div
                id="selectItemIcon"
                className={
                  currentStep === 5
                    ? "stepper-active-icon"
                    : currentStep > 5
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    currentStep === 5
                      ? "stepper-active-text"
                      : currentStep > 5
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  Payment
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <div className="custom-stepper" onClick={() => setCurrentStep(6)}>
              <div
                id="selectItemIcon"
                className={
                  currentStep === 6
                    ? "stepper-active-icon"
                    : currentStep > 6
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    currentStep === 6
                      ? "stepper-active-text"
                      : currentStep > 6
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  Direct Print
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      {currentStep === 1 ? (
        <SelectItem setCurrentStep={setCurrentStep} currentStep={currentStep} />
      ) : currentStep === 2 ? (
        <OrderForm setCurrentStep={setCurrentStep} currentStep={currentStep} />
      ) : currentStep === 3 ? (
        <PreviewAndSummary
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ) : currentStep === 4 ? (
        <InvoiceAndDelivery
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ) : currentStep === 5 ? (
        <Payment setCurrentStep={setCurrentStep} currentStep={currentStep} />
      ) : currentStep === 6 ? (
        <DirectPrint
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ) : null}
    </div>
  )
}

export default Order
