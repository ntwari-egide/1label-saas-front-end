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
import { ArrowRight, ArrowLeft } from "react-feather"

const InvoiceAndDelivery = (props) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col xs="12" sm="12" md="8" lg="8" xl="8">
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h4>Add New Invoice Address</h4>
                    <p className="text-muted">
                      Be sure to check "Deliver to this address" when you have
                      finished
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Full Name</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Mobile Number</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Flat, House No</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Landmark e.g. near apollo hospital</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Town/City</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Pincode</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>State</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Address Type</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button color="primary">Save and Deliver Here</Button>
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
                      Invoice This Address
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
                    <h4>Add New Delivery Address</h4>
                    <p className="text-muted">
                      Be sure to check "Deliver to this address" when you have
                      finished
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Full Name</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Mobile Number</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Flat, House No</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Landmark e.g. near apollo hospital</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Town/City</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Pincode</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>State</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>Address Type</Label>
                    <Input style={{ marginBottom: "15px" }} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button color="primary">Save and Deliver Here</Button>
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
                      Delivery To This Address
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
        <Row>
          <Col>
            <Button
              color="primary"
              onClick={() => {
                props.setCurrentStep(props.currentStep - 1)
              }}
              disabled={props.currentStep === 1}
            >
              <div style={{ display: "flex" }}>
                <div>
                  <ArrowLeft size={15} />
                </div>
                <div style={{ marginTop: "2px" }}>{"Previous  "}</div>
              </div>
            </Button>
          </Col>
          <Col>
            <div style={{ float: "right" }}>
              <Button
                color="primary"
                onClick={() => {
                  props.setCurrentStep(props.currentStep + 1)
                }}
                disabled={props.currentStep === 6}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ marginTop: "2px" }}>{"Next  "}</div>
                  <div>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Button>
            </div>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

export default InvoiceAndDelivery
