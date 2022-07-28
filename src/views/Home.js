import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import axios from "@axios"
import DataTable from "react-data-table-component"
import OrderSummaryChart from "./DashBoard/PieChart"
import Select from "react-select"
import {
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardTitle,
  CardFooter,
  Label,
  Input,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"
import { useTranslation } from "react-i18next"

// Debounce Implementation
let timerId = null

const Home = () => {
  const { t } = useTranslation()
  // APP states
  const [pieChartData, setPieChartData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState({ value: 10, label: 10 })
  const [orderListLoader, setOrderListLoader] = useState(false)

  // APP constants
  const recordsPerPageOptions = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 20, label: 20 }
  ]

  const $primary = "#6fc055",
    $success = "#28C76F",
    $danger = "#EA5455",
    $warning = "#FF9F43",
    $primary_light = "#a0d190",
    $warning_light = "#FFC085",
    $danger_light = "#f29292",
    $stroke_color = "#b9c3cd",
    $label_color = "#e7eef7"

  const orderListCol = [
    {
      name: "Order No",
      selector: "order_num",
      sortable: true
    },
    {
      name: "Brand Name",
      selector: "brand_name",
      sortable: true
    },
    {
      name: "PO Number",
      selector: "po_number",
      sortable: true
    },
    {
      name: "Status",
      selector: "order_status",
      sortable: true
    },
    {
      name: "Update Date",
      selector: "update_date",
      sortable: true
    }
  ]

  // Other Functions
  const debounceFetch = (currPage, recPerPage) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fetchOrdersList(currPage, recPerPage)
      timerId = null
    }, 400)
  }

  // API servics
  const fetchOrdersList = (currPage, recPerPage) => {
    setOrderListLoader(true)
    const body = {
      order_user: "innoa",
      page_index: currPage,
      page_size: recPerPage.value
    }
    axios.post("/Order/OrderListPaginationQuery", body).then((res) => {
      if (res.status === 200) {
        setOrderListLoader(false)
        setOrdersData(res.data.orders)
      }
    })
  }

  const fetchTotalOrdersData = () => {
    const body = {
      order_user: "innoa"
    }
    axios.post("/Order/OrderTotalQuery", body).then((res) => {
      if (res.status === 200) {
        setPieChartData(res.data)
      }
    })
  }

  useEffect(() => {
    fetchOrdersList(currentPage, recordsPerPage)
    fetchTotalOrdersData()
  }, [])

  return (
    <div style={{ minHeight: "calc(100vh - 157px)" }}>
      <p className="lead">{t("Home")}</p>
      <Row>
        <Col sm="12" md="6" lg="4" xl="4">
          <OrderSummaryChart
            data={pieChartData}
            primaryLight={$primary_light}
            warningLight={$warning_light}
            dangerLight={$danger_light}
            primary={$primary}
            danger={$danger}
            warning={$warning}
          />
        </Col>
        <Col sm="12" md="6" lg="8">
          <Card style={{ height: "95%" }}>
            <CardHeader>
              <CardTitle>{t("Listing")}</CardTitle>
            </CardHeader>
            <CardBody>
              {!orderListLoader ? (
                <Row>
                  <DataTable
                    data={ordersData}
                    columns={orderListCol}
                    noHeader
                    fixedHeader
                    fixedHeaderScrollHeight="430px"
                  />
                </Row>
              ) : (
                <Row
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "486px"
                  }}
                >
                  <div style={{ width: "50px", height: "50px" }}>
                    <Spinner color="primary" />
                  </div>
                </Row>
              )}
            </CardBody>
            <CardFooter>
              <Row style={{ display: "flex", justifyContent: "space-between" }}>
                <Col xs="6" sm="6" md="4" lg="2">
                  <Row>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          minWidth: "120px",
                          paddingRight: "2%",
                          paddingTop: "10px"
                        }}
                      >
                        <Label>{t("Records Per Page")}</Label>
                      </div>
                      <div style={{ minWidth: "70px" }}>
                        <Select
                          classNamePrefix="select"
                          defaultValue={recordsPerPageOptions[1]}
                          name="clear"
                          menuPlacement={"auto"}
                          options={recordsPerPageOptions}
                          onChange={(e) => {
                            console.log("changed")
                            setRecordsPerPage(e)
                            debounceFetch(currentPage, e)
                          }}
                        />
                      </div>
                    </div>
                  </Row>
                </Col>
                <Col xs="6" sm="6" md="4" lg="2">
                  <div style={{ display: "flex", float: "right" }}>
                    <div>
                      <Button
                        color="primary"
                        style={{ padding: "10px" }}
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1)
                            debounceFetch(currentPage - 1, recordsPerPage)
                          }
                        }}
                      >
                        <ArrowLeft size={15} />
                      </Button>
                    </div>
                    <div style={{ minWidth: "50px", maxWidth: "50px" }}>
                      <Input
                        value={currentPage}
                        style={{ textAlign: "center" }}
                        onChange={(e) => {
                          if (
                            parseInt(e.target.value) ||
                            e.target.value.length <= 0
                          ) {
                            setCurrentPage(
                              parseInt(e.target.value)
                                ? parseInt(e.target.value)
                                : ""
                            )
                            if (parseInt(e.target.value)) {
                              debounceFetch(
                                parseInt(e.target.value),
                                recordsPerPage
                              )
                            }
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          setCurrentPage(currentPage + 1)
                          debounceFetch(currentPage + 1, recordsPerPage)
                        }}
                        color="primary"
                        style={{ padding: "10px" }}
                      >
                        <ArrowRight size={15} />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
