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
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)
import { connect, useDispatch } from "react-redux"
import {
  setBrand,
  setCareData,
  setWashCareData,
  setDynamicFieldData,
  setFibreInstructionData,
  setSelectedItems
} from "@redux/actions/views/Order/POOrder"

const Listing = (props) => {
  // constants
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App states
  const [poOrderData, setPoOrderData] = useState([])
  const [poOrderLoader, setPoOrderLoader] = useState(false)
  const [orderLoader, setOrderLoader] = useState(false)
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
      sortable: true,
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
    if (props.poSelectedItems.length <= 0) {
      alert("Please Item/s to proceed with your order")
      return
    }
    // props.setCurrentStep(2)
    addPoOrder()
  }

  // API Services
  const fetchPOOrderDetails = (combKey, isTemp) => {
    const body = {
      order_user: "innoa",
      order_no: combKey || "",
      brand_key: props.searchParams.brand ? props.searchParams.brand : "",
      is_po_order_temp: isTemp || ""
    }
    axios
      .post("/Order/GetOrderDetail", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data[0]?.brand_key) {
            dispatch(setBrand({ value: res.data[0]?.brand_key }))
          }
          if (res.data[0]?.contents[0]?.care) {
            dispatch(setCareData(res.data[0].contents[0].care))
          }
          if (res.data[0]?.contents[0]?.icon) {
            dispatch(setWashCareData(res.data[0].contents[0].icon))
          }
          if (res.data[0]?.dynamic_field) {
            dispatch(setDynamicFieldData(res.data[0]?.dynamic_field))
          }
          if (res.data[0]?.contents[0]?.content) {
            dispatch(setFibreInstructionData(res.data[0]?.contents[0]?.content))
          }
          if (res.data[0]?.item_ref) {
            dispatch(
              setSelectedItems(
                res.data[0]?.item_ref.map((item) => {
                  const tempItem = { ...item }
                  tempItem["guid_key"] = tempItem["item_key"]
                  delete tempItem["item_key"]
                  return { ...tempItem }
                })
              )
            )
          }
          setOrderLoader(false)
          props.setCurrentStep(1)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchPoOrderList = () => {
    setPoOrderLoader(true)
    let body = {
      order_user: "innoa",
      brand_key: props.searchParams.brand ? props.searchParams.brand : "",
      order_date_from: props.searchParams.fromDate
        ? props.searchParams.fromDate
        : "",
      order_date_to: props.searchParams.toDate ? props.searchParams.toDate : "",
      order_status: props.searchParams.orderStatus
        ? props.searchParams.orderStatus
        : "",
      factory_code: props.searchParams.factoryNo
        ? props.searchParams.factoryNo
        : "",
      consolidated_id: props.searchParams.cid ? props.searchParams.cid : "",
      order_no: props.searchParams.poNo ? props.searchParams.poNo : ""
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

  const fetchOrderDetails = () => {
    if (props.searchParams.brand && props.searchParams.poNo) {
      const body = {
        brand_key: props.searchParams.brand,
        order_no: "ASLL-PO2022050001",
        order_user: "innoa",
        is_po_order_temp: ""
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

  const addPoOrder = () => {
    setOrderLoader(true)
    const body = {
      brand_key: props.searchParams.brand ? props.searchParams.brand : "",
      order_user: "innoa",
      order_keys: props.poSelectedItems.map((item) => item.guid_key)
    }

    axios
      .post("Order/AddPOOrder", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === "Success") {
            props.setCombinedPOOrderkey(res.data.status_description)
            props.setIsPoOrderTemp("Y")
            fetchPOOrderDetails(res.data.status_description, "Y")
          } else {
            return MySwal.fire({
              title: "Order Failed",
              text: res.data.status_description,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-danger"
              },
              buttonsStyling: false
            })
          }
        }
      })
      .catch((err) => console.log(err))
  }

  // to enable fetching size table only when selected items are changed
  useEffect(() => {
    props.setSizeTableTrigger(true)
  }, [props.poSelectedItems])

  useEffect(() => {
    console.log("se", props.searchParams)
  }, [props.searchParams])

  useEffect(() => {
    fetchOrderStatus()
    fetchBrandList()
    fetchPoOrderList()
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
                (opt) => opt.value === props.searchParams.brand
              )}
              onChange={(e) => {
                props.setSearchParams({ ...props.searchParams, brand: e.value })
              }}
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
                  value={props.searchParams.cid ? props.searchParams.cid : ""}
                  onChange={(e) =>
                    props.setSearchParams({
                      ...props.searchParams,
                      cid: e.target.value
                    })
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
                  value={
                    props.searchParams.factoryNo
                      ? props.searchParams.factoryNo
                      : ""
                  }
                  onChange={(e) =>
                    props.setSearchParams({
                      ...props.searchParams,
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
                  value={props.searchParams.poNo ? props.searchParams.poNo : ""}
                  onChange={(e) =>
                    props.setSearchParams({
                      ...props.searchParams,
                      poNo: e.target.value
                    })
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
                    (opt) =>
                      opt.value.toString() === props.searchParams.orderStatus
                  )}
                  onChange={(e) =>
                    props.setSearchParams({
                      ...props.searchParams,
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
                    props.searchParams.fromDate
                      ? new Date(props.searchParams.fromDate)
                      : ""
                  }
                  onChange={(e) => {
                    props.setSearchParams({
                      ...props.searchParams,
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
                    props.searchParams.toDate
                      ? new Date(props.searchParams.toDate)
                      : ""
                  }
                  onChange={(e) => {
                    props.setSearchParams({
                      ...props.searchParams,
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
                fetchPoOrderList(props.searchParams)
                fetchOrderDetails()
                props.setpoSelectedItems([])
              }}
            >
              Search
            </Button>
            <Button
              style={{ margin: "3px" }}
              color="primary"
              onClick={() => {
                props.setSearchParams({})
                fetchPoOrderList()
                props.setpoSelectedItems([])
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
                  {orderLoader ? (
                    <Spinner size="sm" style={{ marginLeft: "3px" }} />
                  ) : null}
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
                selectableRowSelected={(e) =>
                  props.poSelectedItems
                    .map((item) => item.guid_key)
                    .includes(e.guid_key)
                }
                onSelectedRowsChange={(e) =>
                  props.setpoSelectedItems(e.selectedRows)
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
          poSelectedItems={props.poSelectedItems}
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, null)(Listing)
