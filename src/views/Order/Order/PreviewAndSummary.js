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
import { ArrowRight, ArrowLeft } from "react-feather"
import DataTable from "react-data-table-component"

const PreviewAndSummary = (props) => {
  const orderListCol = [
    {
      name: "SIZE DESCRIPTION",
      selector: "size_description",
      sortable: true
    },
    {
      name: "SIZE",
      selector: "size",
      sortable: true
    },
    {
      name: "SUPPLIER REF",
      selector: "supplier_ref",
      sortable: true
    },
    {
      name: "SUPPLIER COLOR",
      selector: "supplier_color",
      sortable: true
    },
    {
      name: "OPTION ID",
      selector: "option_id",
      sortable: true
    },
    {
      name: "BUYING GROUP ID",
      selector: "buying_group_id",
      sortable: true
    },
    {
      name: "PRODUCT GROUP DESCRIPTION",
      selector: "product_group_description"
    },
    {
      name: "SKU CODE",
      selector: "sku_code",
      Sortable: true
    },
    {
      name: "STYLE NUMBER",
      selector: "style_number",
      Sortable: true
    },
    {
      name: "BARCODE",
      selector: "barcode",
      Sortable: true
    },
    {
      name: "ASBAR1",
      selector: "asbar1"
    },
    {
      name: "QTY ITEM REF 2",
      selector: "ref2"
    },
    {
      name: "QTY ITEM REF 3",
      selector: "ref3"
    },
    {
      name: "QTY ITEM REF 4",
      selector: "ref4"
    }
  ]

  const dummyData = [
    {
      size_description: "UK 4",
      size: "4",
      supplier_ref: "21S4341",
      supplier_color: "Black",
      option_id: "11994405",
      buying_group_id: 102,
      product_group_description: "Jersey Tops",
      sku_code: "112053894",
      style_number: "500114013",
      barcode: "",
      asbar1: 48,
      ref2: "",
      ref3: "",
      ref4: ""
    },
    {
      size_description: "UK 6",
      size: "6",
      supplier_ref: "21S4341",
      supplier_color: "Black",
      option_id: "11994405",
      buying_group_id: 102,
      product_group_description: "Jersey Tops",
      sku_code: "112053894",
      style_number: "500114013",
      barcode: "",
      asbar1: 240,
      ref2: "",
      ref3: "",
      ref4: ""
    },
    {
      size_description: "UK 8",
      size: "8",
      supplier_ref: "21S4341",
      supplier_color: "Black",
      option_id: "11994405",
      buying_group_id: 102,
      product_group_description: "Jersey Tops",
      sku_code: "112053894",
      style_number: "500114013",
      barcode: "",
      asbar1: 210,
      ref2: "",
      ref3: "",
      ref4: ""
    }
  ]

  return (
    <Card>
      <CardHeader>Preview And Summary</CardHeader>
      <CardBody>
        <Row>
          <Col xs="12" sm="12" md="6" md="4" lg="3" xl="3">
            <Card>
              <CardBody style={{ minHeight: "450px", maxHeight: "450px" }}>
                <div
                  style={{ height: "100%", width: "100%", maxHeight: "450px" }}
                >
                  <img
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      maxHeight: "422px",
                      overflow: "hidden"
                    }}
                    src={
                      "https://demo.i-wanna.com/1Label_New_Order_System/html/html/Order/ArtWork/Item/Lanius%20GmbH.jpg"
                    }
                  />
                </div>
              </CardBody>
              <CardFooter>
                <h4>Preview Item 1: LNU-LNU-LANIUS-CARE-02</h4>
              </CardFooter>
            </Card>
          </Col>
          <Col xs="12" sm="12" md="6" md="4" lg="3" xl="3">
            <Card>
              <CardBody
                style={{
                  height: "100%",
                  width: "100%",
                  maxHeight: "450px",
                  objectFit: "cover"
                }}
              >
                <div
                  style={{ height: "100%", width: "100%", maxHeight: "450px" }}
                >
                  <img
                    style={{
                      height: "100%",
                      width: "100%",
                      maxHeight: "422px",
                      overflow: "hidden"
                    }}
                    src={
                      "https://demo.i-wanna.com/1Label_New_Order_System/html/html/Order/ArtWork/Item/Nike.jpg"
                    }
                  />
                </div>
              </CardBody>
              <CardFooter>
                <h4>Preview Item 2: Ind-Ind-INDISKA-SOCK-HT</h4>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable data={dummyData} columns={orderListCol} noHeader />
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

export default PreviewAndSummary
