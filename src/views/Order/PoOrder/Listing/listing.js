import { useState, useEffect } from "react"
import {
  Check,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "react-feather"
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
  Collapse,
  Label,
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
import { connect, useDispatch } from "react-redux"
import {
  setSizeTableTrigger,
  setBrand,
  resetData,
  setPoSelectedOrders,
  setSearchParams,
  setSizeData,
  setCols
} from "@redux/actions/views/Order/POOrder"
import { populateData } from "@redux/actions/views/common"
import { getUserData } from "@utils"
import { setLoader } from "@redux/actions/layout"
import { sweetAlert } from "@utils"

let timerId
const recordsPerPageOptions = [
  { value: 5, label: 5 },
  { value: 10, label: 10 },
  { value: 20, label: 20 }
]

const Listing = (props) => {
  // constants
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App states
  const [poOrderData, setPoOrderData] = useState([])
  const [poOrderLoader, setPoOrderLoader] = useState(false)
  const [orderLoader, setOrderLoader] = useState(false)
  const [totalPages, setTotalPages] = useState("...")
  const [advanceSearchCollapse, setAdvanceSearchCollapse] = useState(false)
  const [initSearchParams, setInitSearchParams] = useState({})
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
              row.order_status === "COMPLETE"
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
    if (Object.keys(props.poSelectedOrders).length <= 0) {
      sweetAlert("", "Please select an order to continue", "warning", "warning")
      return
    }
    setOrderLoader(true)
    dispatch(setLoader(true))
    // props.setCurrentStep(2)
    addPoOrder()
  }

  // Other functions
  const debounceFetch = (currPage, recPerPage) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fetchPoOrderList(props.searchParams, currPage, recPerPage)
      timerId = null
    }, 400)
  }

  // API Services
  const fetchPOOrderDetails = (combKey, isTemp) => {
    const body = {
      order_user: getUserData().admin,
      order_no: combKey || "",
      brand_key: props.searchParams.brand || "",
      is_po_order_temp: isTemp || ""
    }
    axios
      .post("/Order/GetOrderDetail", body)
      .then((res) => {
        if (res.status === 200) {
          dispatch(populateData("POOrder", res.data[0]))
          props.setCurrentStep("Item List")
        }
        setOrderLoader(false)
        dispatch(setLoader(false))
      })
      .catch((err) => console.log(err))
  }

  const fetchPoOrderList = (searchParams, currentPage, recordsPerPage) => {
    console.log({ searchParams })
    setPoOrderLoader(true)
    const page_size = recordsPerPage
      ? recordsPerPage.value
      : searchParams.recordsPerPage.value
    const page_index = currentPage ? currentPage : searchParams.currentPage
    let body = {
      order_user: getUserData().admin,
      brand_key: searchParams.brand || "",
      order_date_from: searchParams.fromDate || "",
      order_date_to: searchParams.toDate || "",
      order_status: searchParams.orderStatus || "",
      factory_code: searchParams.factoryNo || "",
      consolidated_id: searchParams.cid || "",
      order_no: searchParams.poNo || "",
      page_size,
      page_index
    }

    axios
      .post("/order/GetPOOrderListPagination", body)
      .then((res) => {
        if (res.status === 200) {
          setPoOrderData(res.data.orders || [])
        }
        setPoOrderLoader(false)
        setTotalPages(Math.ceil(res.data.row_count / page_size))
      })
      .catch((err) => console.log(err))
  }

  const fetchBrandList = () => {
    const body = {
      order_user: getUserData().admin
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
      .post("/Order/GetPOOrderStatus")
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

  const addPoOrder = () => {
    let orderList = []
    Object.keys(props.poSelectedOrders).map((key) => {
      orderList = [
        ...orderList,
        ...props.poSelectedOrders[key]?.map((item) => item?.guid_key)
      ]
    })

    const body = {
      brand_key: props.searchParams.brand ? props.searchParams.brand : "",
      order_user: getUserData().admin,
      order_keys: orderList
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
            dispatch(setLoader(false))
            setOrderLoader(false)
            sweetAlert(
              "Order Failed",
              res.data.status_description,
              "error",
              "danger"
            )
          }
        }
      })
      .catch((err) => console.log(err))
  }

  // to enable fetching size table only when selected items are changed
  useEffect(() => {
    if (!props.setSizeTableTrigger) {
      dispatch(setSizeTableTrigger(true))
      // very critical for re-calculation of dynamic cols
      dispatch(setCols([]))
      dispatch(setSizeData([]))
    }
  }, [props.poSelectedOrders])

  useEffect(() => {
    fetchOrderStatus()
    fetchBrandList()
    fetchPoOrderList(props.searchParams)
    setInitSearchParams({ ...props.searchParams })
  }, [])

  return (
    <div style={{ minHeight: "calc(100vh - 245px)" }}>
      <Card>
        <CardHeader style={{ display: "block" }}>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="12" sm="12" md="6" lg="6" xl="6">
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <CustomLabel title="Brand" />
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Select
                    className="React"
                    classNamePrefix="select"
                    options={brandOptions}
                    value={
                      brandOptions.filter(
                        (opt) => opt.value === props.searchParams.brand
                      ) || ""
                    }
                    onChange={(e) => {
                      dispatch(resetData())
                      dispatch(setBrand(e))
                      dispatch(
                        setSearchParams({
                          ...props.searchParams,
                          brand: e.value
                        })
                      )
                    }}
                    isDisabled={props.isOrderConfirmed}
                    isLoading={!brandOptions.length}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col
              xs="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
              style={{ marginBottom: "10px" }}
            >
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Row>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                      <CustomLabel title="Order Date From" />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                      <Flatpickr
                        className="form-control"
                        value={
                          props.searchParams.fromDate
                            ? new Date(props.searchParams.fromDate)
                            : ""
                        }
                        onChange={(e) => {
                          dispatch(
                            setSearchParams({
                              ...props.searchParams,
                              fromDate: formatDateYMD(new Date(e))
                            })
                          )
                        }}
                        options={{ dateFormat: "d-m-Y" }}
                        disabled={props.isOrderConfirmed}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col
              xs="12"
              sm="12"
              md="6"
              lg="6"
              xl="6"
              style={{ marginBottom: "10px" }}
            >
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Row>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                      <CustomLabel title="Order Date To" />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12" md="12" lg="12" xl="12">
                      <Flatpickr
                        className="form-control"
                        value={
                          props.searchParams.toDate
                            ? new Date(props.searchParams.toDate)
                            : ""
                        }
                        onChange={(e) => {
                          dispatch(
                            setSearchParams({
                              ...props.searchParams,
                              toDate: formatDateYMD(new Date(e))
                            })
                          )
                        }}
                        options={{ dateFormat: "d-m-Y" }}
                        disabled={props.isOrderConfirmed}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              cursor: "pointer"
            }}
            onClick={() => setAdvanceSearchCollapse(!advanceSearchCollapse)}
          >
            <Col style={{ color: "var(--primary)" }}>
              {advanceSearchCollapse ? "Hide" : "Show"} Advance Search
            </Col>
            <Col>
              <div style={{ float: "right", color: "var(--primary)" }}>
                {advanceSearchCollapse ? <ChevronUp /> : <ChevronDown />}
              </div>
            </Col>
          </Row>
          <Collapse isOpen={advanceSearchCollapse}>
            <Row>
              <Col
                xs="12"
                sm="12"
                md="6"
                lg="6"
                xl="6"
                style={{ marginBottom: "10px" }}
              >
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <CustomLabel title="CID" />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <Input
                      value={
                        props.searchParams.cid ? props.searchParams.cid : ""
                      }
                      onChange={(e) =>
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            cid: e.target.value
                          })
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                xs="12"
                sm="12"
                md="6"
                lg="6"
                xl="6"
                style={{ marginBottom: "10px" }}
              >
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <CustomLabel title="Factory No" />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <Input
                      value={
                        props.searchParams.factoryNo
                          ? props.searchParams.factoryNo
                          : ""
                      }
                      onChange={(e) =>
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            factoryNo: e.target.value
                          })
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col
                xs="12"
                sm="12"
                md="6"
                lg="6"
                xl="6"
                style={{ marginBottom: "10px" }}
              >
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <CustomLabel title="PO No" />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <Input
                      value={
                        props.searchParams.poNo ? props.searchParams.poNo : ""
                      }
                      onChange={(e) =>
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            poNo: e.target.value
                          })
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
              </Col>
              <Col
                xs="12"
                sm="12"
                md="6"
                lg="6"
                xl="6"
                style={{ marginBottom: "10px" }}
              >
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <CustomLabel title="Order Status" />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <Select
                      className="React"
                      classNamePrefix="select"
                      options={orderStatusOptions}
                      value={orderStatusOptions.filter(
                        (opt) =>
                          opt.value.toString() ===
                          props.searchParams.orderStatus
                      )}
                      onChange={(e) =>
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            orderStatus: e.value.toString()
                          })
                        )
                      }
                      isDisabled={props.isOrderConfirmed}
                      isLoading={!orderStatusOptions.length}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Collapse>
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
                  <Button
                    style={{ margin: "3px" }}
                    color="primary"
                    onClick={() => {
                      fetchPoOrderList(props.searchParams)
                      dispatch(setPoSelectedOrders({}))
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    style={{ margin: "3px" }}
                    color="primary"
                    onClick={() => {
                      dispatch(setSearchParams({ ...initSearchParams }))
                      fetchPoOrderList(initSearchParams)
                      dispatch(setPoSelectedOrders([]))
                    }}
                  >
                    Cancel
                  </Button>
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
                    size: "md",
                    disabled: props.isOrderConfirmed
                  }}
                  fixedHeader={true}
                  fixedHeaderScrollHeight="500px"
                  selectableRowSelected={(e) => {
                    let orderList = []
                    Object.keys(props.poSelectedOrders).map((key) => {
                      orderList = [...orderList, ...props.poSelectedOrders[key]]
                    })
                    return orderList
                      .map((item) => item.guid_key)
                      .includes(e.guid_key)
                  }}
                  onSelectedRowsChange={(e) => {
                    const tempState = { ...props.poSelectedOrders }
                    tempState[props.searchParams.currentPage] = e.selectedRows
                    dispatch(setPoSelectedOrders({ ...tempState }))
                  }}
                  style={{ minHeight: "300px" }}
                  persistTableHead={true}
                  noDataComponent={
                    <div style={{ padding: "20px", paddingTop: "30px" }}>
                      <h5>Search using the form to display data.</h5>
                    </div>
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
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            recordsPerPage: e
                          })
                        )
                        debounceFetch(props.searchParams.currentPage, e)
                      }}
                    />
                  </div>
                </div>
              </Row>
            </Col>
            <Col xs="6" sm="6" md="4" lg="3">
              <div style={{ display: "flex", float: "right" }}>
                <div style={{ marginRight: "5px" }}>
                  <Button
                    color="primary"
                    style={{ padding: "10px" }}
                    onClick={() => {
                      if (props.searchParams.currentPage > 1) {
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            currentPage:
                              parseInt(props.searchParams.currentPage) - 1
                          })
                        )
                        debounceFetch(
                          props.searchParams.currentPage - 1,
                          props.searchParams.recordsPerPage
                        )
                      }
                    }}
                  >
                    <ArrowLeft size={15} />
                  </Button>
                </div>
                <div style={{ minWidth: "50px", maxWidth: "50px" }}>
                  <Input
                    value={props.searchParams.currentPage}
                    style={{ textAlign: "center" }}
                    onChange={(e) => {
                      if (parseInt(e.target.value) || e.target.value === "") {
                        dispatch(
                          setSearchParams({
                            ...props.searchParams,
                            currentPage: e.target.value
                          })
                        )
                        if (parseInt(e.target.value)) {
                          debounceFetch(
                            parseInt(e.target.value),
                            props.searchParams.recordsPerPage
                          )
                        }
                      }
                    }}
                  />
                </div>
                <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                  of {totalPages}
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Button
                    onClick={() => {
                      dispatch(
                        setSearchParams({
                          ...props.searchParams,
                          currentPage:
                            parseInt(props.searchParams.currentPage) + 1
                        })
                      )
                      debounceFetch(
                        props.searchParams.currentPage + 1,
                        props.searchParams.recordsPerPage
                      )
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
    </div>
  )
}

const mapStateToProps = (state) => ({
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  searchParams: state.poOrderReducer.searchParams,
  poSelectedOrders: state.poOrderReducer.poSelectedOrders
})

export default connect(mapStateToProps, null)(Listing)
