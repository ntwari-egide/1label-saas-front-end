import { useState, useEffect } from "react"
import { Check } from "react-feather"
import {
  Card,
  Badge,
  Button,
  CardFooter,
  Input,
  CardBody,
  Spinner,
  CardHeader,
  Row,
  Col
} from "reactstrap"
import CheckBox from "@components/CheckBox/CheckBox"
import { useTranslation } from "react-i18next"
import DataTable from "react-data-table-component"
import axios from "@axios"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { formatDateYMD } from "@utils"
import Footer from "../../../CommonFooter"

const Listing = (props) => {
  // constants
  const { t } = useTranslation()
  // App states
  const [poOrderData, setPoOrderData] = useState([])
  const [searchParams, setSearchParams] = useState({})
  const [poOrderLoader, setPoOrderLoader] = useState(false)
  // select options
  const [brandOptions, setBrandOptions] = useState([])
  const [orderStatusOptions, setOrderStatusOptions] = useState([])

  const cols = [
    {
      name: t("PO Qty"),
      selector: "total_qty",
      sortable: true
    },
    {
      name: t("PURCHASE ORDER NO"),
      selector: "order_no",
      sortable: true
    },
    {
      name: t("CONSOLIDATION PO ID"),
      selector: "consolidated_id"
    },
    {
      name: t("SUPPLIER SITE ID"),
      selector: "supplier_code"
    },
    {
      name: t("FACTORY CODE"),
      selector: "factory_code"
    },
    {
      name: t("PO LIST UPDATE DATE TIME"),
      selector: "send_date"
    },
    {
      name: t("SEND DATE"),
      selector: "send_date"
    },
    {
      name: t("STATUS"),
      selector: "order_status",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Badge
            className="badge-glow"
            pill
            color={
              row.order_status === "Confirm"
                ? "success"
                : row.order_status === "New"
                ? "danger"
                : row.order_status === "Revised"
                ? "warning"
                : "primary"
            }
          >
            {row.order_status}
          </Badge>
        </div>
      )
    },
    {
      name: t("STATUS DATE"),
      selector: "status_date"
    }
  ]

  const CustomLabel = (props) => (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center"
      }}
    >
      <div>{props.title}</div>
    </div>
  )

  const handleOrder = () => {
    if (props.selectedItems.length <= 0) {
      alert("Please Item/s to proceed with your order")
      return
    }
    props.setCurrentStep(2)
  }

  // API Services
  const fetchPoOrderList = (searchParams) => {
    setPoOrderLoader(true)
    let body
    if (searchParams) {
      console.log("status", searchParams.orderStatus)
      body = {
        order_user: "innoa",
        brand_key: searchParams.brand ? searchParams.brand : "",
        order_date_from: searchParams.fromDate ? searchParams.fromDate : "",
        order_date_to: searchParams.toDate ? searchParams.toDate : "",
        order_status: searchParams.orderStatus ? searchParams.orderStatus : "",
        factory_code: searchParams.factoryNo ? searchParams.factoryNo : "",
        consolidated_id: searchParams.cid ? searchParams.cid : "",
        order_no: searchParams.poNo ? searchParams.poNo : ""
      }
    } else {
      body = {
        order_user: "innoa",
        brand_key: "e88d9b8e-44ed-4fc2-b9a0-aef31ca0ccf3",
        order_date_from: "2022-4-5",
        order_date_to: "2022-5-1",
        order_status: "",
        factory_code: "",
        consolidated_id: "",
        order_no: ""
      }
    }

    axios
      .post("/order/GetPOOrderList", body)
      .then((res) => {
        if (res.status === 200) {
          setPoOrderData(res.data)
        }
        setPoOrderLoader(false)
      })
      .catch((err) => console.log(err))
  }

  const fetchBrandList = () => {
    const body = {
      order_user: "innoa"
    }

    axios
      .post("/brand/GetPOBrandListByClient", body)
      .then((res) => {
        if (res.status === 200) {
          setBrandOptions(
            res.data.map((opt) => ({
              value: opt.guid_key,
              label: opt.brand_name
            }))
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchOrderStatus = () => {
    axios
      .post("/Order/GetOrderStatus")
      .then((res) => {
        if (res.status === 200) {
          setOrderStatusOptions(
            res.data.map((opt) => ({
              value: opt.status_id,
              label: opt.order_status
            }))
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchOrderDetails = (searchParams) => {
    if (searchParams.brand && searchParams.poNo) {
      const body = {
        brand_key: searchParams.brand,
        order_no: "ASLL-PO2022050001"
      }

      axios
        .post("/Order/GetOrderDetail", body)
        .then((res) => {
          if (res.status === 200) {
          }
        })
        .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    fetchOrderStatus()
    fetchPoOrderList()
    fetchBrandList()
  }, [])

  return (
    <Card>
      <CardHeader style={{ display: "block" }}>
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="12" sm="12" md="1" lg="1" xl="1">
            <CustomLabel title={"Brand"} />
          </Col>
          <Col xs="12" sm="12" md="5" lg="5" xl="5">
            <Select
              className="React"
              classNamePrefix="select"
              options={brandOptions}
              value={brandOptions.filter(
                (opt) => opt.value === searchParams.brand
              )}
              onChange={(e) =>
                setSearchParams({ ...searchParams, brand: e.value })
              }
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="12" sm="12" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <CustomLabel title="CID:" />
              </Col>
              <Col xs="12" sm="12" md="10" lg="10" xl="10">
                <Input
                  value={searchParams.cid ? searchParams.cid : ""}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, cid: e.target.value })
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col xs="12" sm="12" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <CustomLabel title="Factory No:" />
              </Col>
              <Col xs="12" sm="12" md="10" lg="10" xl="10">
                <Input
                  value={searchParams.factoryNo ? searchParams.factoryNo : ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      factoryNo: e.target.value
                    })
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="12" sm="12" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <CustomLabel title="PO No:" />
              </Col>
              <Col xs="12" sm="12" md="10" lg="10" xl="10">
                <Input
                  value={searchParams.poNo ? searchParams.poNo : ""}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, poNo: e.target.value })
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col xs="12" sm="12" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <CustomLabel title="Order Status:" />
              </Col>
              <Col xs="12" sm="12" md="10" lg="10" xl="10">
                <Select
                  className="React"
                  classNamePrefix="select"
                  options={orderStatusOptions}
                  value={orderStatusOptions.filter(
                    (opt) => opt.value.toString() === searchParams.orderStatus
                  )}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      orderStatus: e.value.toString()
                    })
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginBottom: "3px" }}>
          <Col>
            <CustomLabel title="Date Imported:" />
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="12" sm="12" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <CustomLabel title="From:" />
              </Col>
              <Col xs="12" sm="12" md="10" lg="10" xl="10">
                <Flatpickr
                  className="form-control"
                  value={
                    searchParams.fromDate ? new Date(searchParams.fromDate) : ""
                  }
                  onChange={(e) => {
                    setSearchParams({
                      ...searchParams,
                      fromDate: formatDateYMD(new Date(e))
                    })
                  }}
                  options={{ dateFormat: "d-m-Y" }}
                />
              </Col>
            </Row>
          </Col>
          <Col xs="12" sm="12" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <CustomLabel title="To:" />
              </Col>
              <Col xs="12" sm="12" md="10" lg="10" xl="10">
                <Flatpickr
                  className="form-control"
                  value={
                    searchParams.toDate ? new Date(searchParams.toDate) : ""
                  }
                  onChange={(e) => {
                    setSearchParams({
                      ...searchParams,
                      toDate: formatDateYMD(new Date(e))
                    })
                  }}
                  options={{ dateFormat: "d-m-Y" }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              style={{ margin: "3px" }}
              color="primary"
              onClick={() => {
                fetchPoOrderList(searchParams)
                fetchOrderDetails(searchParams)
              }}
            >
              Search
            </Button>
            <Button
              style={{ margin: "3px" }}
              color="primary"
              onClick={() => {
                setSearchParams({})
                fetchPoOrderList()
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
        <Row>
          <hr></hr>
        </Row>
      </CardHeader>
      <CardBody>
        <Row style={{ marginBottom: "10px" }}>
          <Col>
            <div
              style={{
                display: "flex",
                height: "100%",
                width: "100%",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h4>PO Order</h4>
              </div>
              <div>
                <Button color="primary" onClick={handleOrder}>
                  Order
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {!poOrderLoader ? (
              <DataTable
                data={poOrderData}
                columns={cols}
                noHeader={true}
                selectableRows={true}
                selectableRowsComponent={CheckBox}
                selectableRowsComponentProps={{
                  color: "primary",
                  icon: <Check className="vx-icon" size={15} />,
                  label: "",
                  size: "md"
                }}
                pagination={true}
                fixedHeader={true}
                fixedHeaderScrollHeight={"350px"}
                onRowDoubleClicked={(e) => {
                  props.setSelectedItems([e.guid_key])
                  props.setCurrentStep(2)
                }}
                selectableRowSelected={(e) =>
                  props.selectedItems.includes(e.guid_key)
                }
                onSelectedRowsChange={(e) =>
                  props.setSelectedItems(e.selectedRows.map((r) => r.guid_key))
                }
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "300px",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <div>
                  <Spinner color="primary" />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Footer
          // validationField={props.selectedItems}
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

export default Listing
