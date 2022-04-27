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
  Button
} from "reactstrap"
import Footer from "../../CommonFooter"
import { useTranslation } from "react-i18next"

const InvoiceAndDelivery = (props) => {
  const { t } = useTranslation()
  const [clientDetails, setClientDetails] = useState({})
  const [invoiceAddressList, setInvoiceAddressList] = useState({})
  const [deliveryAddressList, setDeiveryAddresList] = useState({})
  const [invoiceAddressDetails, setInvoiceAddressDetails] = useState({})
  const [deliveryAddressDetails, setDeliveryAddressDetails] = useState({})
  const [contactInfo, setContactInfo] = useState({})
  const [contactInfoDetails, setContactInfoDetails] = useState({})

  //API Services
  const fetchUserInfo = () => {
    const body = {
      order_user: "innoa"
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
    const addressTypes = {
      invoice: setInvoiceAddressList,
      delivery: setDeiveryAddresList,
      contact: setContactInfo
    }

    Object.keys(addressTypes).map((addType) => {
      const body = {
        order_user: "innoa",
        address_type: addType
      }
      axios
        .post("/Client/GetClientAddressList", body)
        .then((res) => {
          if (res.status === 200) {
            addressTypes[addType](res?.data)
            fetchAddressDetail(addType, res?.data[0])
          }
        })
        .catch((err) => console.log(err))
    })
  }

  const fetchAddressDetail = (addType, add) => {
    const addressTypes = {
      invoice: setInvoiceAddressDetails,
      delivery: setDeliveryAddressDetails,
      contact: setContactInfoDetails
    }
    const body = {
      order_user: "innoa",
      address_type: addType,
      address_id: add.address_id
    }
    axios
      .post("/Client/GetClientAddressDetail", body)
      .then((res) => {
        if (res.status === 200) {
          addressTypes[addType](res?.data[0])
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
                      value={invoiceAddressDetails.name}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={contactInfoDetails.phone}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={invoiceAddressDetails?.address?.split("|")[0]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={invoiceAddressDetails?.address?.split("|")[1]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={invoiceAddressDetails.city}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={invoiceAddressDetails.post_code}
                      style={{ marginBottom: "15px" }}
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
            <Card>
              <CardHeader>Innoways (Mike.Jiang)</CardHeader>
              <CardBody>
                <div>
                  <p>
                    28th Floor, Block B, Honglong Century Plaza, Shennan East
                    Road, Luohu District, Shenzhen,
                  </p>
                  <p>Guangdong Province</p>
                  <p>(86) 0755-8215 5991</p>
                  <div>
                    <Button style={{ width: "100%" }} color="primary">
                      {t("Invoice This Address")}
                    </Button>
                  </div>
                </div>
              </CardBody>
              <CardFooter style={{ textAlign: "center" }}>Innoways</CardFooter>
            </Card>
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
                      value={deliveryAddressDetails.name}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={contactInfoDetails.phone}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={deliveryAddressDetails?.address?.split("|")[0]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={deliveryAddressDetails?.address?.split("|")[1]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={deliveryAddressDetails.city}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={deliveryAddressDetails.post_code}
                      style={{ marginBottom: "15px" }}
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
            <Card>
              <CardHeader>Innoways (Mike.Jiang)</CardHeader>
              <CardBody>
                <div>
                  <p>
                    28th Floor, Block B, Honglong Century Plaza, Shennan East
                    Road, Luohu District, Shenzhen,
                  </p>
                  <p>Guangdong Province</p>
                  <p>(86) 0755-8215 5991</p>
                  <div>
                    <Button style={{ width: "100%" }} color="primary">
                      {t("Delivery To This Address")}
                    </Button>
                  </div>
                </div>
              </CardBody>
              <CardFooter style={{ textAlign: "center" }}>Innoways</CardFooter>
            </Card>
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

export default InvoiceAndDelivery
