import { useState, useEffect } from "react"
import axios from "@axios"
import {
  Label,
  Card,
  CardHeader,
  Input,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  Collapse
} from "reactstrap"
import Footer from "../../CommonFooter"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import { getUserData } from "@utils"
import {
  setDeliveryAddressDetails,
  setInvoiceAddressDetails,
  setContactDetails
} from "@redux/actions/views/Order/Order"
import { saveOrder } from "@redux/actions/views/common"

const InvoiceAndDelivery = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [clientDetails, setClientDetails] = useState({})
  const [, setInvoiceAddressList] = useState({})
  const [, setDeiveryAddresList] = useState({})
  const [, setContactInfo] = useState({})
  const [invoiceDetailsList, setInvoiceDetailsList] = useState([])
  const [deliveryDetailsList, setDeliveryDetailsList] = useState([])
  const [contactDetailsList, setContactDetailsList] = useState([])
  const [invoiceId, setInvoiceId] = useState(0)
  const [deliveryId, setDeliveryId] = useState(0)

  const handleContactDetailsChange = (value, field) => {
    const tempState = { ...props.contactDetails }
    tempState[field] = value
    dispatch(setContactDetails(tempState))
  }

  const handleAddressChange = (value, index, dispatchFun, initState) => {
    const tempAdd = initState ? initState.split("|") : []
    tempAdd[index] = value
    dispatch(
      dispatchFun({
        ...props.deliveryAddressDetails,
        address: tempAdd.join("|")
      })
    )
  }

  const handleDetailsChange = (value, field, dispatchFun, initState) => {
    const tempState = { ...initState }
    tempState[field] = value
    dispatch(dispatchFun(tempState))
  }

  //API Services
  const fetchUserInfo = () => {
    const body = {
      order_user: getUserData().admin
    }
    axios
      .post("/Client/GetClientDetail", body)
      .then((res) => {
        if (res.status === 200) {
          setClientDetails(res?.data)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchClientAddressList = () => {
    // meta data
    const addressListTypes = {
      invoice: setInvoiceAddressList,
      delivery: setDeiveryAddresList,
      contact: setContactInfo
    }
    const addressTypes = {
      invoice: setInvoiceAddressDetails,
      delivery: setDeliveryAddressDetails,
      contact: setContactDetails
    }
    const addressDetailsTypes = {
      invoice: setInvoiceDetailsList,
      delivery: setDeliveryDetailsList,
      contact: setContactDetailsList
    }
    const tempListTypes = {
      invoice: [],
      delivery: [],
      contact: []
    }
    const body = {
      order_user: getUserData().admin
    }
    Object.keys(addressListTypes).map((addType) => {
      body.address_type = addType
      axios
        .post("/Client/GetClientAddressList", body)
        .then((res) => {
          if (res.status === 200) {
            // addressListTypes[addType](res?.data)
            console.log(addType)
            res.data.map((add, index) =>
              fetchAddressDetails(
                addType,
                add,
                index,
                addressTypes[addType],
                addressDetailsTypes[addType],
                tempListTypes[addType]
              )
            )
          }
        })
        .catch((err) => console.log(err))
    })
  }

  const fetchAddressDetails = (
    addType,
    add,
    index,
    dispatchFun,
    setDetailsListFun,
    tempDetailsList
  ) => {
    const body = {
      order_user: getUserData().admin,
      address_type: addType,
      address_id: add.address_id
    }
    axios
      .post("/Client/GetClientAddressDetail", body)
      .then((res) => {
        if (res.status === 200) {
          if (index === 0) {
            dispatch(dispatchFun(res?.data[0]))
          }
          tempDetailsList[index] = res.data[0]
          setDetailsListFun([...tempDetailsList])
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchUserInfo()
    fetchClientAddressList()
  }, [])

  return (
    <Card>
      <CardBody>
        <Row>
          <Col xs="12" sm="12" md="8" lg="8" xl="8">
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h4>{t("Add New Invoice Address")}</h4>
                    <p className="text-muted">
                      {t(
                        'Be sure to check "Deliver to this address" when you have finished'
                      )}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Full Name")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.name}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "name",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={props.contactDetails?.phone}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleContactDetailsChange(e.target.value, "phone")
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={
                        props.invoiceAddressDetails?.address?.split("|")[0]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleAddressChange(
                          e.target.value,
                          0,
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails?.address
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={
                        props.invoiceAddressDetails?.address?.split("|")[1]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleAddressChange(
                          e.target.value,
                          1,
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails?.address
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.city}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "city",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.post_code}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "post_code",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("State")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address Type")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button color="primary">
                      {t("Save and Deliver Here")}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="12" md="4" lg="4" xl="4">
            {invoiceDetailsList.map((data) => (
              <div className="address-card">
                <Card
                  key={data?.guid_key}
                  onClick={() => {
                    if (invoiceId === data?.guid_key) {
                      setInvoiceId("")
                    } else {
                      setInvoiceId(data?.guid_key)
                      dispatch(setInvoiceAddressDetails(data))
                    }
                  }}
                >
                  <CardHeader>{data?.name}</CardHeader>
                  <Collapse isOpen={invoiceId === data?.guid_key}>
                    <CardBody>
                      <div>
                        <p>{data?.address}</p>
                        <p>
                          {data?.city}, {data?.country}
                        </p>
                        {/*
                        <p>(86) 0755-8215 5991</p>
              */}
                        <div>
                          <Button
                            onClick={() => {
                              dispatch(saveOrder(clientDetails))
                            }}
                            style={{ width: "100%" }}
                            color="primary"
                          >
                            {t("Invoice This Address")}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Collapse>
                </Card>
              </div>
            ))}
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="8" lg="8" xl="8">
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h4>{t("Add New Delivery Address")}</h4>
                    <p className="text-muted">
                      {t(
                        'Be sure to check "Deliver to this address" when you have finished'
                      )}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Full Name")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.name}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "name",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={props.contactDetails?.phone}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleContactDetailsChange(e.target.value, "phone")
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={
                        props.deliveryAddressDetails?.address?.split("|")[0]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleAddressChange(
                          e.target.value,
                          0,
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails?.address
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={
                        props.deliveryAddressDetails?.address?.split("|")[1]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleAddressChange(
                          e.target.value,
                          1,
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails?.address
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.city}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "city",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.post_code}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "post_code",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("State")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address Type")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button color="primary">
                      {t("Save and Deliver Here")}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="12" md="4" lg="4" xl="4">
            {deliveryDetailsList.map((data) => (
              <div className="address-card">
                <Card
                  onClick={() => {
                    if (deliveryId === data?.guid_key) {
                      setDeliveryId("")
                    } else {
                      setDeliveryId(data?.guid_key)
                      dispatch(setDeliveryAddressDetails(data))
                    }
                  }}
                >
                  <CardHeader>{data?.name}</CardHeader>
                  <Collapse isOpen={deliveryId === data?.guid_key}>
                    <CardBody>
                      <div>
                        <p>{data?.address}</p>
                        <p>
                          {data?.city}, {data?.country}
                        </p>
                        {/*
                    <p>(86) 0755-8215 5991</p>
              */}
                        <div>
                          <Button style={{ width: "100%" }} color="primary">
                            {t("Delivery To This Address")}
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Collapse>
                </Card>
              </div>
            ))}
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Footer
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  invoiceAddressDetails: state.orderReducer.invoiceAddressDetails,
  deliveryAddressDetails: state.orderReducer.deliveryAddressDetails,
  contactDetails: state.orderReducer.contactDetails
})

export default connect(mapStateToProps, null)(InvoiceAndDelivery)
