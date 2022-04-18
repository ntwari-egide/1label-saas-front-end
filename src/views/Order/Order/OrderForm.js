import { useState, useEffect } from "react"
import {
  Card,
  Label,
  Collapse,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Input,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft, X, Plus } from "react-feather"
import Footer from "./CommonFooter"

const OrderForm = (props) => {
  const [itemInfoCollapse, setItemInfoCollapse] = useState(false)
  const [careContentCollapse, setCareContentCollapse] = useState(false)
  const [washCareCollapse, setWashCareCollapse] = useState(false)
  return (
    <Card>
      <CardHeader>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>Customer Order Reference</Label>
          <span className="text-danger">*</span>
          <Input style={{ margin: "5px" }} />
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>Expected Delivery Date</Label>
          <span className="text-danger">*</span>
          <Input style={{ margin: "5px" }} />
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>Projection Location</Label>
          <span className="text-danger">*</span>
          <Input style={{ margin: "5px" }} />
        </Col>
      </CardHeader>
      <CardBody>
        <Row style={{ margin: "0" }}>
          <Col>
            <Card>
              <CardHeader
                style={{ cursor: "pointer" }}
                onClick={() => setItemInfoCollapse(!itemInfoCollapse)}
              >
                <div>
                  <h4 className="text-primary">Item Info</h4>
                </div>
              </CardHeader>
              <Collapse isOpen={itemInfoCollapse}>
                <CardBody>Content</CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: "0" }}>
          <Col>
            <Card>
              <CardHeader
                style={{ cursor: "pointer" }}
                onClick={() => setCareContentCollapse(!careContentCollapse)}
              >
                <div>
                  <h4 className="text-primary">Care And Content</h4>
                </div>
              </CardHeader>
              <Collapse isOpen={careContentCollapse}>
                <CardBody>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Content#</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Save/Edit:</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Input />
                    </Col>
                  </Row>
                  <Card>
                    <CardHeader>
                      <h5>Fibre Instructions</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col xs="12" sm="12" md="4" lg="4" xl="4">
                          <Label>Component</Label>
                          <Input />
                        </Col>
                        <Col xs="12" sm="12" md="2" lg="2" xl="2">
                          <Label>Fabric</Label>
                          <Input />
                        </Col>
                        <Col xs="12" sm="12" md="2" lg="2" xl="2">
                          <Label>%</Label>
                          <Input />
                        </Col>
                        <Col
                          xs="12"
                          sm="12"
                          md="1"
                          lg="1"
                          xl="1"
                          style={{ marginTop: "23px" }}
                        >
                          <Button
                            style={{ padding: "7px" }}
                            outline
                            className="btn btn-outline-danger"
                          >
                            <div style={{ display: "flex" }}>
                              <X />
                              <div style={{ marginTop: "5px" }}>Delete</div>
                            </div>
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter>
                      <Button color="primary" style={{ padding: "10px" }}>
                        <Plus />
                        Add New
                      </Button>
                    </CardFooter>
                  </Card>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>
                        Default Content:
                      </Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Care:</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Save/Edit:</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Input />
                    </Col>
                  </Row>
                  <Card>
                    <CardHeader>
                      <h5>Additional Care & Mandatory Statements</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col xs="12" sm="12" md="8" lg="8" xl="8">
                          <Label>Component</Label>
                          <Input />
                        </Col>
                        <Col
                          xs="12"
                          sm="12"
                          md="1"
                          lg="1"
                          xl="1"
                          style={{ marginTop: "23px" }}
                        >
                          <Button
                            style={{ padding: "7px" }}
                            outline
                            className="btn btn-outline-danger"
                          >
                            <div style={{ display: "flex" }}>
                              <X />
                              <div style={{ marginTop: "5px" }}>Delete</div>
                            </div>
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter>
                      <Button color="primary" style={{ padding: "10px" }}>
                        <Plus />
                        Add New Row
                      </Button>
                    </CardFooter>
                  </Card>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
        <Row style={{ margin: "0" }}>
          <Col>
            <Card>
              <CardHeader
                style={{ cursor: "pointer" }}
                onClick={() => setWashCareCollapse(!washCareCollapse)}
              >
                <div>
                  <h4 className="text-primary">Wash Care Symbol</h4>
                </div>
              </CardHeader>
              <Collapse isOpen={washCareCollapse}>
                <CardBody>
                  <Row>
                    <Col xs="12" s="12" md="2" lg="2" xl="2">
                      <Label style={{ marginTop: "12px" }}>Wash:</Label>
                    </Col>
                    <Col xs="12" s="12" md="8" lg="8" xl="8">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col xs="12" s="12" md="2" lg="2" xl="2">
                      <Label style={{ marginTop: "12px" }}>Bleach:</Label>
                    </Col>
                    <Col xs="12" s="12" md="8" lg="8" xl="8">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col xs="12" s="12" md="2" lg="2" xl="2">
                      <Label style={{ marginTop: "12px" }}>Dry:</Label>
                    </Col>
                    <Col xs="12" s="12" md="8" lg="8" xl="8">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col xs="12" s="12" md="2" lg="2" xl="2">
                      <Label style={{ marginTop: "12px" }}>Natural Dry:</Label>
                    </Col>
                    <Col xs="12" s="12" md="8" lg="8" xl="8">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col xs="12" s="12" md="2" lg="2" xl="2">
                      <Label style={{ marginTop: "12px" }}>Iron:</Label>
                    </Col>
                    <Col xs="12" s="12" md="8" lg="8" xl="8">
                      <Input />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "10px" }}>
                    <Col xs="12" s="12" md="2" lg="2" xl="2">
                      <Label style={{ marginTop: "12px" }}>Dry Clean:</Label>
                    </Col>
                    <Col xs="12" s="12" md="8" lg="8" xl="8">
                      <Input />
                    </Col>
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Footer
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
        />
      </CardFooter>
    </Card>
  )
}

export default OrderForm
