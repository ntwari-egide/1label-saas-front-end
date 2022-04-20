import { useState, useEffect } from "react"
import axios from "@axios"
import Select from "react-select"
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
import { X, Plus } from "react-feather"
import Footer from "../../CommonFooter"
import { XMLParser } from "fast-xml-parser"

let dummyOptions = []
for (let i = 0; i < 300; i++) {
  dummyOptions.push({ label: `label${i}`, value: `value${i}` })
}

const OrderForm = (props) => {
  const [itemInfoCollapse, setItemInfoCollapse] = useState(false)
  const [careContentCollapse, setCareContentCollapse] = useState(false)
  const [washCareCollapse, setWashCareCollapse] = useState(false)
  const [sizeTableDetails, setSizeTableDetails] = useState([])
  const [itemInfoFields, setItemInfoFields] = useState([])
  // const [dummyOptions, setDummyOptions] = useState([])

  // API services
  const fetchItemInfoData = () => {
    const body = {
      guid_key: "204681f9-c63a-435c-96e9-e6838ed56775"
    }
    axios.post("/Item/GetItemRefDetail", body).then((res) => console.log(res))
  }

  const fetchItemInfoFields = () => {
    const body = {
      brand_key: props.brand.value,
      show_status: "Y"
    }
    axios.post("/Brand/GetDynamicFieldList", body).then((res) => {
      if (res.status === 200) {
        setItemInfoFields(res.data)
      }
    })
  }

  const fetchSizeTableList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      item_key: props.selectedItems ? props.selectedItems : [],
      query_str: ""
    }

    axios
      .post("/SizeTable/GetSizeTableList", body)
      .then((res) => console.log("sizetablelist", res))
      .catch((err) => console.log(err))
  }

  const fetchSizeTableDetails = () => {
    const body = {
      guid_key: "134023"
    }
    axios
      .post("/SizeTable/GetSizeTableDetail", body)
      .then((res) => {
        if (res.status === 200) {
          // preprocessing
          const nRows = Object.keys(res.data[0].size_content[0]).length - 2 // gets the no of rows
          let data = [] // initialized data to fill row by row
          let currentRow = 0 + 2 // because actual data begins at Column2
          for (let i = 0; i < nRows; i++) {
            let row = {} // initialise empty row
            res.data[0].size_content.map((col) => {
              row[col["Column1"]] = col[`Column${currentRow}`] // row[column_name] = column_value
            })
            data.push(row) // push the row to data
            currentRow += 1 // increment row count
          }
          console.log("processed data", data)
        }
      })
      .then((err) => console.log(err))
  }

  const fetchContentNumberList = () => {
    const body = {
      order_user: "innoa",
      brand_key: props.brand?.value,
      content_group: "A"
    }
    axios
      .post("/ContentNumber/GetContentNumberList", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const fetchIconSequenceList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      icon_group: "A",
      icon_key: ""
    }

    axios
      .post("/ContentNumber/GetIconSequence", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const fetchContentTranslationList = () => {
    // page types: content, part, care, icon
    const body = {
      brand_key: props.brand ? props.brand?.value : "",
      page_type: "content",
      query_sr: "",
      icon_type_key: "",
      product_line_key: ""
    }

    axios
      .post("/Translation/GetTranslationList", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const fetchProductLocationList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_user: "innoa",
      order_no: ""
    }

    axios
      .post("/Order/GetLocationList", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const renderSwitch = (field) => {
    switch (field.type) {
      case "select":
        return (
          <Row style={{ margin: "5px" }}>
            <Col
              xs="12"
              sm="12"
              md="3"
              lg="2"
              xl="2"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Label>{field?.props?.title}</Label>
            </Col>
            <Col xs="12" sm="12" md="6" lg="5" xl="5">
              <Select />
            </Col>
          </Row>
        )
      case "input":
        return (
          <Row style={{ margin: "5px" }}>
            <Col
              xs="12"
              sm="12"
              md="3"
              lg="2"
              xl="2"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Label>{field?.props?.title}</Label>
            </Col>
            <Col xs="12" sm="12" md="6" lg="5" xl="5">
              <Input />
            </Col>
          </Row>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    fetchSizeTableList()
    fetchItemInfoData()
    fetchSizeTableDetails()
    fetchItemInfoFields()
    fetchContentNumberList()
    fetchIconSequenceList()
    fetchContentTranslationList()
    fetchProductLocationList()
  }, [])

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
                <CardBody>
                  {itemInfoFields.map((field) => {
                    {
                      return renderSwitch(field)
                    }
                  })}
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
                          <Select
                            className="React"
                            classNamePrefix="select"
                            options={dummyOptions}
                          />
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
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

export default OrderForm
