import { useState, useEffect } from "react"
import {
  Spinner,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Label,
  Button,
  Input,
  Row,
  Col
} from "reactstrap"
import { useTranslation } from "react-i18next"
import axios from "@axios"
import DataTable from "react-data-table-component"
import CheckBox from "@components/CheckBox/CheckBox"
import { Check, ArrowLeft, ArrowRight, Search } from "react-feather"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import { formatDateYMD, processOrderNo } from "@utils"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { useDispatch } from "react-redux"
import history from "@src/history"
import { populateData } from "@redux/actions/views/common"
import {
  setIsOrderConfirmed,
  setSelectedOrder,
  setIsOrderNew
} from "@redux/actions/views/Order/List"
import { getUserData } from "@utils"
import { setLoader } from "@redux/actions/layout"

let timerId

const Listing = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const recordsPerPageOptions = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 20, label: 20 }
  ]

  const cols = [
    {
      name: t("ORDER CONFIRMATION"),
      selector: "order_no",
      sortable: true,
      width: "225px"
    },
    {
      name: t("REV NO"),
      selector: "rev_no",
      sortable: false
    },
    {
      name: t("DESSIN"),
      selector: "Supplier Ref",
      sortable: false
    },
    {
      name: t("CUSTOMER ORDER REF"),
      selector: "Supplier Colour",
      sortable: false
    },
    {
      name: t("CREATE DATE"),
      selector: "order_date",
      sortable: false,
      width: "200px"
    },
    {
      name: t("ORDER DATE"),
      selector: "order_confirm_date",
      width: "200px",
      sortable: false
    },
    {
      name: t("EXPECTED DELIVERY DATE"),
      selector: "order_expdate",
      width: "200px",
      sortable: false
    },
    {
      name: t("CONTACT PERSON"),
      selector: "invoice_contact",
      sortable: false,
      width: "150px"
    },
    {
      name: t("EMAIL"),
      selector: "invoice_email",
      sortable: false,
      width: "250px"
    },
    {
      name: t("STATUS"),
      selector: "order_status",
      sortable: true,
      width: "100px",
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
                : row.order_status === "Draft"
                ? "danger"
                : "primary"
            }
          >
            {row.order_status}
          </Badge>
        </div>
      )
    },
    {
      name: t("CREATE BY"),
      selector: "order_user",
      width: "160px"
    },
    {
      name: t("CLIENT NAME"),
      selector: "order_user",
      width: "160px"
    },
    {
      name: t("LAST UPDATE PERSON"),
      selector: "update_user",
      width: "160px"
    },
    {
      name: t("ACTIONS"),
      cell: (row) => (
        <div
          style={{ display: "flex", minWidth: "220px", marginRight: "375px" }}
        >
          {row.action.map((act) => (
            <div>
              <Button
                color="primary"
                style={{ margin: "1px", padding: "5px" }}
                onClick={() => handleActionButtonClick(act.label, row)}
              >
                {act.label}
              </Button>
            </div>
          ))}
        </div>
      )
    }
  ]

  // Other Functions
  const handleActionButtonClick = (action, row) => {
    switch (action) {
      case "Send Draft Order":
        sendDraftOrder(row)
        return
      case "Copy":
        copy(row)
        return
      case "Preview":
        preview(row)
        return
      default:
        return null
    }
  }

  const fetchOrderDetails = (brand_key, order_no, is_po_order_temp) => {
    const body = {
      order_user: getUserData().admin,
      brand_key,
      order_no: [order_no.split("-")[0], order_no.split("-")[1]].join("-"),
      is_po_order_temp
    }

    axios
      .post("/Order/GetOrderDetail", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data[0]) {
            let module = "Order"
            if (is_po_order_temp === "Y") {
              module = "POOrder"
            }
            // populate state ap per data received
            dispatch(
              populateData(
                module,
                res.data[0],
                brand_key,
                processOrderNo(order_no),
                is_po_order_temp
              )
            )
            // push to page
            history.push(`/${module}`)
          } else {
            console.log("Err Msg: No Data for order details")
          }
        }
      })
      .catch((err) => console.log(err))
  }

  const sendDraftOrder = (row) => {
    const body = {
      order_user: getUserData().admin,
      brand_key: row.brand_guid_key,
      order_no: [row.order_no.split("-")[0], row.order_no.split("-")[1]].join(
        "-"
      ),
      order_status: "Draft"
    }

    axios
      .post("/Order/SendOrderEmail", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const copy = (row) => {
    dispatch(setLoader(true))
    const body = {
      order_user: getUserData().admin,
      brand_key: row.brand_guid_key,
      order_no: [row.order_no.split("-")[0], row.order_no.split("-")[1]].join(
        "-"
      )
    }
    axios
      .post("/Order/CopyOrder", body)
      .then((res) => {
        if (res.status === 200) {
          // fetches order details to then populate data in redux
          fetchOrderDetails(
            row.brand_guid_key,
            res.data.data?.order_no,
            res.data.data?.is_po_order_temp
          )
        } else {
          dispatch(setLoader(false))
          alert("Something Went Wrong Please Try Again Later")
        }
      })
      .catch((err) => console.log(err))
  }

  const preview = (row) => {
    console.log(row)
  }

  const debounceFetch = (currPage, recPerPage) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fetchOrderList(
        currPage,
        recPerPage.value,
        props.orderDateFrom,
        props.orderDateTo
      )
      timerId = null
    }, 400)
  }

  const handleRowDoubleClick = (e) => {
    dispatch(setSelectedOrder(e))
    if (e.order_status === "COMPLETE") {
      dispatch(setIsOrderConfirmed(true))
    }
    dispatch(setIsOrderNew(false))
    fetchOrderDetails(e.brand_guid_key, e.order_no, e.is_po_order_temp)
  }

  // API Services
  const copyConfirmOrder = () => {
    const body = {
      order_user: getUserData().admin,
      brand_key: "e8c439c4-2bc0-4304-8053-e818071b5293",
      order_no: "JJ2-PO2022040006"
    }
    axios
      .post(Order / CopyOrder, body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const sendOrderEmail = (orderStatus) => {
    const body = {
      order_user: getUserData().admin,
      brand_key: "e8c439c4-2bc0-4304-8053-e818071b5293",
      order_no: "JJ2-PO2022040006",
      order_status: "Draft"
    }
    axios
      .post("Order/SendOrderEmail", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const fetchOrderList = (
    page_index,
    page_size,
    order_date_from,
    order_date_to
  ) => {
    if (!loading) {
      setLoading(true)
    }
    const body = {
      order_user: getUserData().admin,
      page_index,
      page_size,
      order_date_from,
      order_date_to
    }
    axios
      .post("/Order/GetOrderList", body)
      .then((res) => {
        props.setTotalPages(Math.ceil(res.data.length / page_size))
        props.setOrderList(res.data)
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchOrderList(
      props.currentPage,
      props.recordsPerPage.value,
      props.orderDateFrom,
      props.orderDateTo
    )
  }, [])

  return (
    <Card>
      <CardHeader>
        <h3>Order List</h3>
      </CardHeader>
      <CardBody>
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="12" sm="12" md="5" lg="4" xl="3">
            <Row>
              <Col>Order Date From</Col>
            </Row>
            <Row>
              <Col>
                <Flatpickr
                  className="form-control"
                  value={props.orderDateFrom}
                  onChange={(e) =>
                    props.setOrderDateFrom(formatDateYMD(new Date(e[0])))
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col xs="12" sm="12" md="5" lg="4" xl="3">
            <Row>
              <Col>Order Date To</Col>
            </Row>
            <Row>
              <Col>
                <Flatpickr
                  className="form-control"
                  value={props.orderDateTo}
                  onChange={(e) =>
                    props.setOrderDateTo(formatDateYMD(new Date(e[0])))
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs="12"
            sm="12"
            md="2"
            lg="4"
            xl="3"
            style={{ display: "flex", alignItems: "end" }}
          >
            <Button
              color="primary"
              onClick={() =>
                fetchOrderList(
                  props.currentPage,
                  props.recordsPerPage.value,
                  props.orderDateFrom,
                  props.orderDateTo
                )
              }
              style={{ paddingLeft: "12px", paddingRight: "12px" }}
            >
              <Search size={16} style={{ maringRight: "5px" }} />
              Search
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <div
                style={{
                  minHeight: "455px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Spinner color="primary" />
              </div>
            ) : (
              <DataTable
                data={props.orderList}
                columns={cols}
                noHeader={true}
                fixedHeader
                fixedHeaderScrollHeight="42vh"
                selectableRows={true}
                selectableRowsComponent={CheckBox}
                selectableRowsComponentProps={{
                  color: "primary",
                  icon: <Check className="vx-icon" size={15} />,
                  label: "",
                  size: "md"
                }}
                onRowDoubleClicked={(e) => {
                  handleRowDoubleClick(e)
                }}
              />
            )}
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: 0
          }}
        >
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
                    name="clear"
                    value={recordsPerPageOptions.filter(
                      (opt) => opt.value === props.recordsPerPage.value
                    )}
                    menuPlacement={"auto"}
                    options={recordsPerPageOptions}
                    onChange={(e) => {
                      props.setRecordsPerPage(e)
                      debounceFetch(props.currentPage, e)
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
                    if (props.currentPage > 1) {
                      props.setCurrentPage(props.currentPage - 1)
                      debounceFetch(props.currentPage - 1, props.recordsPerPage)
                    }
                  }}
                >
                  <ArrowLeft size={15} />
                </Button>
              </div>
              <div
                style={{
                  minWidth: "50px",
                  maxWidth: "50px",
                  marginLeft: "10px"
                }}
              >
                <Input
                  value={props.currentPage}
                  style={{ textAlign: "center" }}
                  onChange={(e) => {
                    if (
                      parseInt(e.target.value) ||
                      e.target.value.length <= 0
                    ) {
                      props.setCurrentPage(
                        parseInt(e.target.value) ? parseInt(e.target.value) : ""
                      )
                      if (parseInt(e.target.value)) {
                        debounceFetch(
                          parseInt(e.target.value),
                          props.recordsPerPage
                        )
                      }
                    }
                  }}
                />
              </div>
              <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                of {props.totalPages}
              </div>
              <div>
                <Button
                  onClick={() => {
                    props.setCurrentPage(props.currentPage + 1)
                    debounceFetch(props.currentPage + 1, props.recordsPerPage)
                  }}
                  color="primary"
                  style={{ padding: "10px", marginLeft: "10px" }}
                >
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

export default Listing
