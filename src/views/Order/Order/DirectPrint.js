import { useSate, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Row,
  Col,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft, Printer } from "react-feather"
import DataTable from "react-data-table-component"

const DirectPrint = (props) => {
  const orderListCol = [
    {
      name: "ITEM REF.",
      selector: "item_ref",
      sortable: true,
      cell: (row) => <p>{row.item_ref}</p>,
      minWidth: "250px"
    },
    {
      name: "SIZE",
      selector: "size",
      sortable: true
    },
    {
      name: "SIZE 1",
      selector: "size1",
      sortable: true
    },
    {
      name: "SIZE 2",
      selector: "size2",
      sortable: true
    },
    {
      name: "SIZE 3",
      selector: "size3",
      sortable: true
    },
    {
      name: "SIZE 4",
      selector: "size4",
      sortable: true
    },
    {
      name: "TEST PRINT",
      button: true,
      cell: (row) => (
        <Button style={{ padding: "5px" }} color="primary">
          <Printer />
        </Button>
      )
    },
    {
      name: "ORDER QTY",
      selector: "order_qty",
      Sortable: true
    },
    {
      name: "WASTAGE ALLOWANCE",
      selector: "wastage_allowance",
      Sortable: true
    },
    {
      name: "PRINTED QTY",
      selector: "printed_quantity",
      Sortable: true
    },
    {
      name: "START SEQ NO.",
      cell: (row) => (
        <Input value={row.start_seq_no} onChange={(e) => console.log(row)} />
      )
    },
    {
      name: "END SEQ NO.",
      cell: (row) => <Input value={row.end_seq_no} />
    },
    {
      name: "PRINT",
      cell: (row) => (
        <Button style={{ padding: "5px" }} color="primary">
          <Printer />
        </Button>
      )
    }
  ]

  const dummyData = [
    {
      item_ref: "Ind-Ind-INDISKA-CNC-MAIN-24-BK",
      size: 60,
      size1: 24,
      size2: 24,
      size3: "",
      size4: "",
      order_qty: 124,
      wastage_allowance: 4,
      printed_quantity: 4,
      end_seq_no: 128,
      start_seq_no: ""
    },
    {
      item_ref: "LNU-LNU-LANIUS-CARE-02",
      size: 77,
      size1: 55,
      size2: 12,
      size3: 33,
      size4: 71,
      order_qty: 120,
      wastage_allowance: 12,
      printed_quantity: 12,
      end_seq_no: 128,
      start_seq_no: 11
    }
  ]

  return (
    <Card>
      <CardHeader>Direct Print</CardHeader>
      <CardBody>
        <Card>
          <CardBody>
            <DataTable data={dummyData} columns={orderListCol} noHeader />
          </CardBody>
        </Card>
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

export default DirectPrint
