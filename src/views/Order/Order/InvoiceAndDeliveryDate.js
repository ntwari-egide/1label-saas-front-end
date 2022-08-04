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
  setContactDetails,
  setClientDetails
} from "@redux/actions/views/Order/Order"

const InvoiceAndDelivery = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [, setInvoiceAddressList] = useState({})
  const [, setDeiveryAddresList] = useState({})
  const [, setContactInfo] = useState({})
  const [invoiceDetailsList, setInvoiceDetailsList] = useState([])
  const [deliveryDetailsList, setDeliveryDetailsList] = useState([])
  const [, setContactDetailsList] = useState([])
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
          dispatch(setClientDetails(res?.data))
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
        .post("/Client/GetClientAddressList", { ...body })
        .then((res) => {
          if (res.status === 200) {
            // addressListTypes[addType](res?.data)
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
          // set initial data in form
          if (props.isOrderNew) {
            if (index === 0) {
              dispatch(dispatchFun(res?.data[0]))
            }
          }
          // to open card of initial address
          if (addType === "invoice" && index === 0) {
            setInvoiceId(res.data[0].guid_key)
          }
          // to open card of initial address
          if (addType === "delivery" && index === 0) {
            setDeliveryId(res.data[0].guid_key)
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
                    <Label>{t("Company Name")}</Label>
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
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Contact")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.contact_person}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleDetailsChange(
                          e.target.value,
                          "contact_person",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }}
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Phone")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.phone}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleDetailsChange(
                          e.target.value,
                          "phone",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }}
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Fax")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.fax}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleDetailsChange(
                          e.target.value,
                          "fax",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }}
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Email")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.email}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "email",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address1")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.address}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "address",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address2")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.address2}
                      onChange={(e) => {
                        handleDetailsChange(
                          e.target.value,
                          "address2",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }}
                      style={{ marginBottom: "15px" }}
                      disabled={true}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address3")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.address3}
                      onChange={(e) => {
                        handleDetailsChange(
                          e.target.value,
                          "address3",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }}
                      disabled={true}
                      style={{ marginBottom: "15px" }}
                    />
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
                              // dispatch(saveOrder(props.clientDetails))
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
                    <Label>{t("Company Name")}</Label>
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
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Contact")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.contact_person}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleDetailsChange(
                          e.target.value,
                          "contact_person",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }}
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Phone")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.phone}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "phone",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Fax")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.fax}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "fax",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Email")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.email}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "email",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Country")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.country}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "country",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("City")}</Label>
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
                      disabled={true}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Post Code")}</Label>
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
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address1")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.address}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "address",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={true}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address2")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.address2}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "address2",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Address3")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.address3}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "address3",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                      disabled={true}
                    />
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
          stepperMenu={props.stepperMenu}
        />
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  invoiceAddressDetails: state.orderReducer.invoiceAddressDetails,
  deliveryAddressDetails: state.orderReducer.deliveryAddressDetails,
  contactDetails: state.orderReducer.contactDetails,
  orderReference: state.orderReducer.orderReference,
  expectedDeliveryDate: state.orderReducer.expectedDeliveryDate,
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  isOrderNew: state.listReducer.isOrderNew
})

export default connect(mapStateToProps, null)(InvoiceAndDelivery)
