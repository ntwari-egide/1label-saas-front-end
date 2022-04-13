import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import axios from "@axios"
import Chart from "react-apexcharts"
import DataTable from "react-data-table-component"
import OrderSummaryChart from "./DashBoard/PieChart"
import Select from "react-select"
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Label,
  Input,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"

let timerId = null

const Home = () => {
  const [pieChartData, setPieChartData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState({ value: 10, label: 10 })
  const recordsPerPageOptions = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 20, label: 20 }
  ]
  let $primary = "#6fc055",
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

  const debounceFetch = (currPage, recPerPage) => {
    if (timerId) {
      return
    }
    timerId = setTimeout(() => {
      fetchOrdersList(currPage, recPerPage)
      timerId = null
    }, 400)
  }

  const fetchOrdersList = (currPage, recPerPage) => {
    const body = {
      order_user: "innoa",
      page_index: currPage,
      page_size: recPerPage.value
    }
    axios.post("/OrderListPaginationQuery", body).then((res) => {
      if (res.status === 200) {
        console.log(res)
        setOrdersData(res.data.orders)
      }
    })
  }

  const fetchTotalOrdersData = () => {
    const body = {
      order_user: "innoa"
    }
    axios.post("/OrderTotalQuery", body).then((res) => {
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
    <div>
      <p className="lead">Dashboard</p>
      <Row>
        <Col sm="12" md="4" lg="4">
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
        <Col sm="12" md="8" lg="8">
          <Card style={{ height: "95%" }}>
            <CardHeader>
              <CardTitle>Listing</CardTitle>
            </CardHeader>
            <CardBody>
              <Row style={{ minHeight: "90%" }}>
                {ordersData.length > 0 ? (
                  <DataTable
                    data={ordersData}
                    columns={orderListCol}
                    noHeader
                    fixedHeader
                    fixedHeaderScrollHeight="430px"
                  />
                ) : (
                  <div style={{ minHeight: "500px" }}></div>
                )}
              </Row>
            </CardBody>
            <CardFooter>
              <Row>
                <Col>
                  <Row>
                    <Col sm="4" md="3" lg="3">
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            minWidth: "120px",
                            paddingRight: "2%",
                            paddingTop: "10px"
                          }}
                        >
                          <Label>Records Per Page</Label>
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
                    </Col>
                  </Row>
                </Col>
                <Col sm="4" md="2" lg="2">
                  <div style={{ display: "flex" }}>
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
