import { useSate, useEffect } from "react"
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
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
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
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input style={{ marginBottom: "15px" }} />
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
