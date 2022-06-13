import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Spinner
} from "reactstrap"
import axios from "@axios"
import { Link } from "react-router-dom"
import Radio from "@components/Radio/Radio"
import { X } from "react-feather"
import { connect } from "react-redux"
import { getUserData } from "@utils"

const Details = (props) => {
  const [itemList, setItemList] = useState([])
  const [pageLoader, setPageLoader] = useState(true)
  const [orderDetails, setOrderDetails] = useState({})

  const handleRemoveItem = (index) => {
    const tempList = itemList
    tempList.splice(index, 1)
    setItemList([...tempList])
    const tempItemRefList = orderDetails.item_ref
    tempItemRefList.splice(index, 1)
    setOrderDetails({ ...orderDetails, item_ref: [...tempItemRefList] })
  }

  // API service
  const fetchOrderDetails = () => {
    const body = {
      order_user: getUserData().admin,
      order_no:
        [
          props.selectedOrder?.order_no?.split("-")[0],
          props.selectedOrder?.order_no?.split("-")[1]
        ].join("-") || "",
      brand_key: props.selectedOrder?.brand_guid_key || "",
      is_po_order_temp: props.selectedOrder?.is_po_order_temp || ""
    }
    const tempItemList = []

    axios
      .post("/Order/GetOrderDetail", body)
      .then((res) => {
        if (res.status === 200) {
          setOrderDetails(res.data[0])
          res.data[0]?.item_ref?.map((item, index) =>
            fetchItemDetails(
              item.item_key,
              tempItemList,
              index,
              res.data[0]?.item_ref?.length
            )
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchItemDetails = (guid_key, tempItemList, index, len) => {
    const body = {
      guid_key
    }

    axios
      .post("Item/GetItemRefDetail", body)
      .then((res) => {
        if (res.status === 200) {
          tempItemList[index] = res.data[0]
          setItemList([...tempItemList])
          if (tempItemList.length === len) {
            setPageLoader(false)
          }
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchBrandDetails = () => {
    const body = {
      brand_key: props.selectedOrder?.brand_guid_key || ""
    }

    axios
      .post("brand/GetBrandDetail", body)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => console.log(err))
  }

  const deleteOrder = () => {
    const body = {
      order_user: getUserData().admin,
      brand_key: "",
      order_no: ""
    }

    axios
      .post("/Order/DeleteOrder", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const confirmOrder = () => {
    axios
      .post("/Order/SaveOrder", orderDetails)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchBrandDetails()
    fetchOrderDetails()
  }, [])

  return (
    <div>
      {pageLoader ? (
        <div
          style={{
            display: "flex",
            minHeight: "500px",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Spinner color="primary" />
        </div>
      ) : (
        <Row>
          <Col xs="12" sm="12" md="12" lg="8" xl="8">
            {itemList.map((item, index) => (
              <Row>
                <Col>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col xs="12" sm="12" md="8" lg="8" xl="8">
                          <Row>
                            <Col>
                              <h7
                                style={{
                                  fontWeight: "bolder",
                                  marginBottom: "5px"
                                }}
                              >
                                {item?.item_ref_desc}
                              </h7>
                              <p>
                                By <Link>{item?.brand_name}</Link>
                              </p>
                            </Col>
                          </Row>
                          <Row style={{ maringTop: "10px" }}>
                            <Col xs="3" sm="3" md="3" lg="3" xl="3">
                              <Radio
                                label="Delivery"
                                name={`item${index}`}
                                disabled={props.isOrderConfirmed}
                              />
                            </Col>
                            <Col xs="3" sm="3" md="3" lg="3" xl="3">
                              <Radio
                                label="Direct Print"
                                name={`item${index}`}
                                disabled={props.isOrderConfirmed}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          xs="12"
                          sm="12"
                          md="4"
                          lg="4"
                          xl="4"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Row style={{ width: "100%" }}>
                            <Col>
                              <Button
                                color="primary"
                                style={{ width: "100%" }}
                                disabled={props.isOrderConfirmed}
                                onClick={() => handleRemoveItem(index)}
                              >
                                <X size={17} />
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ))}
          </Col>
          <Col xs="12" sm="12" md="12" lg="4" xl="4">
            <Card>
              <CardHeader>
                <p className="text-muted">OPTIONS</p>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>Price Details</Col>
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <p className="text-muted" style={{ marginBottom: 0 }}>
                      Total MRP
                    </p>
                  </Col>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <div style={{ textAlign: "right" }}>
                      <p style={{ marginBottom: 0 }}>$0.1</p>
                    </div>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <p className="text-muted" style={{ marginBottom: 0 }}>
                      Delivery Charges
                    </p>
                  </Col>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <div style={{ textAlign: "right" }}>
                      <p style={{ marginBottom: 0 }}>$10</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <hr
                    style={{
                      widht: "100%",
                      border: "1px solid",
                      color: "#80808026",
                      marginLeft: "10px",
                      marginRight: "10px"
                    }}
                  />
                </Row>
                <Row style={{ marginTop: "15px" }}>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <p style={{ marginBottom: 0 }}>Total</p>
                  </Col>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <div style={{ textAlign: "right" }}>
                      <p style={{ marginBottom: 0 }}>$10.1</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      color="primary"
                      style={{ width: "100%", marginTop: "5px" }}
                      disabled={props.isOrderConfirmed}
                      onClick={confirmOrder}
                    >
                      Place Order
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  selectedOrder: state.listReducer.selectedOrder
})

export default connect(mapStateToProps, null)(Details)
