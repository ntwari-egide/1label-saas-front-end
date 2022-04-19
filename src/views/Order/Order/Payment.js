import { useSate, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft, Users } from "react-feather"
import DataTable from "react-data-table-component"
import Footer from "../../CommonFooter"
import Radio from "@components/Radio/Radio"
const visaMasterCard =
  require("@src/assets/images/logo/visa-mastercard-logo.png").default
const stripe = require("@src/assets/images/logo/stripe-logo-blue.png").default
const alipay = require("@src/assets/images/logo/alipay-logo.png").default
const wechat = require("@src/assets/images/logo/wechat-logo.png").default

const orderListCol = [
  {
    name: "ITEM CODE",
    selector: "item_code",
    sortable: true
  },
  {
    name: "UNIT PRICE",
    selector: "unit_price",
    sortable: true
  },
  {
    name: "OTY",
    selector: "quantity",
    sortable: true
  },
  {
    name: "TOTAL",
    selector: "total",
    sortable: true
  }
]

const dummyData = [
  {
    item_code: "Ind-Ind-INDISKA-CNC-MAIN-24-BK",
    unit_price: "$0.10",
    quantity: "30",
    total: "$3.00"
  },
  {
    item_code: "LNU-LNU-LANIUS-CARE-0",
    unit_price: "$0.10",
    quantity: "20",
    total: "$2.00"
  },
  {
    item_code: "Delivery Charge",
    unit_price: "$10.00",
    quantity: "1",
    total: "$10.00"
  }
]

const Payment = (props) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Col xs="10" sm="10" md="10" lg="11" xl="11">
                  <h4>Payment Options</h4>
                  <p className="text-muted">
                    Be sure to click on correct payment option
                  </p>
                </Col>
                <Col xs="2" sm="2" md="2" lg="1" xl="1">
                  <div style={{ float: "right" }}>
                    <Button color="primary">
                      <Users size={18} />
                    </Button>
                  </div>
                </Col>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="8" sm="8" md="10" lg="10" xl="10">
                    <p>
                      Office Suite 2201, Marina House,
                      <br /> 68 Hing Man Street, Sai Wan Ho, Hong Kong <br />
                      General Line: (852) 2189 7016 | Shenzhen general line:
                      (86) 0755-8215-5991
                    </p>
                  </Col>
                  <Col xs="4" sm="4" md="2" lg="2" xl="2">
                    <h4> Invoice #3492</h4>
                    <h6> Date Issued: </h6>
                    <h6> 31/10/2021</h6>
                    <h6> Due Date:</h6>
                    <h6> 31/10/2021</h6>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs="12"
                    sm="12"
                    md="6"
                    lg="4"
                    xl="4"
                    style={{ marginBottom: "10px" }}
                  >
                    <Row>
                      <Col>
                        <h5>Invoice Detail:</h5>
                      </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Contact: Robert Edmonds </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Phone: 44 1376 560216 </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Fax: 44 1376 560216 </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Email: Robert.Edmonds@Labelon.com</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Address: Test</Col>
                    </Row>
                  </Col>
                  <Col
                    xs="12"
                    sm="12"
                    md="6"
                    lg="4"
                    xl="4"
                    style={{ marginBottom: "10px" }}
                  >
                    <Row>
                      <Col>
                        <h5>Delivery Detail:</h5>
                      </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Contact: Robert Edmonds </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Phone: 44 1376 560216 </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Fax: 44 1376 560216 </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Email: Robert.Edmonds@Labelon.com</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Country: UK</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> City: London</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Post Code: NW1</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Address: Test</Col>
                    </Row>
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="4" xl="4">
                    <Row>
                      <Col>
                        <h5>Payment Details:</h5>
                      </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Total Due: $15.73</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Bank Name: American Bank </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> Country: United States </Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> IBAN: ETD95476213874685</Col>
                    </Row>
                    <Row style={{ marginBotom: "2px" }}>
                      <Col> SWIFT Code: BR91905</Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col>
                    <hr style={{ marginBottom: 0 }} />
                    <DataTable
                      data={dummyData}
                      columns={orderListCol}
                      noHeader
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col>
                    <p>Sales Person: Alfie Solomons</p>
                  </Col>
                  <Col>
                    <div style={{ float: "right", marginRight: "10%" }}>
                      <Row>
                        <Col style={{ minWidth: "95px" }}>Subtotal:</Col>
                        <Col> $3.00</Col>
                      </Row>
                      <Row>
                        <Col style={{ minWidth: "95px" }}>Tax:</Col>
                        <Col> 21%</Col>
                      </Row>
                      <Row>
                        <Col style={{ minWidth: "95px" }}>Total:</Col>
                        <Col> $15.73</Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                Note: It was a pleasure working with you and your team. We hope
                you will keep us in mind for future freelance projects. Thank
                You!
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="12" md="8" lg="6" xl="6">
            <Card>
              <CardHeader>
                <div>
                  <div>
                    <h4>Payment Options</h4>
                  </div>
                  <div>
                    <p className="text-muted">
                      Be sure to click on correct payment option
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>Invoice No:</Col>
                  <Col>#3492</Col>
                </Row>
                <Row>
                  <Col>Total Amount:</Col>
                  <Col>15.73</Col>
                </Row>
                <Row
                  style={{
                    flexDirection: "column",
                    margin: 0,
                    marginTop: "10px"
                  }}
                >
                  <Col>
                    <Row>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "20%",
                            height: "100%"
                          }}
                        >
                          <Radio name="paymentMethod" />
                          <img
                            src={stripe}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div
                          style={{
                            width: "20%",
                            height: "100%",
                            marginRight: "5%"
                          }}
                        >
                          <img
                            src={visaMasterCard}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <Radio name="paymentMethod" />
                      <img
                        src={alipay}
                        style={{ width: "18%", height: "100%" }}
                      />
                    </Row>
                    <Row style={{ marginTop: "15px" }}>
                      <Radio name="paymentMethod" />
                      <img
                        src={wechat}
                        style={{ width: "18%", height: "100%" }}
                      />
                    </Row>
                    <Row style={{ marginTop: "20px" }}>
                      <Radio name="paymentMethod" />
                      <div style={{ marginTop: "2px" }}>Monthly Payment</div>
                    </Row>
                    <Row style={{ marginTop: "20px" }}>
                      <Radio name="paymentMethod" />
                      <div style={{ marginTop: "2px" }}>Balance Deduction</div>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
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

export default Payment
