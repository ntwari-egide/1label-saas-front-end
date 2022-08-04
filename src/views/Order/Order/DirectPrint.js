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
import Footer from "../../CommonFooter"
import { useTranslation } from "react-i18next"

const DirectPrint = (props) => {
  const { t } = useTranslation()
  const orderListCol = [
    {
      name: t("ITEM REF."),
      selector: "item_ref",
      sortable: true,
      cell: (row) => <p>{row.item_ref}</p>,
      minWidth: "250px"
    },
    {
      name: t("SIZE"),
      selector: "size",
      sortable: true
    },
    {
      name: t("SIZE 1"),
      selector: "size1",
      sortable: true
    },
    {
      name: t("SIZE 2"),
      selector: "size2",
      sortable: true
    },
    {
      name: t("SIZE 3"),
      selector: "size3",
      sortable: true
    },
    {
      name: t("SIZE 4"),
      selector: "size4",
      sortable: true
    },
    {
      name: t("TEST PRINT"),
      button: true,
      cell: (row) => (
        <Button style={{ padding: "5px" }} color="primary">
          <Printer />
        </Button>
      )
    },
    {
      name: t("ORDER QTY"),
      selector: "order_qty",
      Sortable: true
    },
    {
      name: t("WASTAGE ALLOWANCE"),
      selector: "wastage_allowance",
      Sortable: true
    },
    {
      name: t("PRINTED QTY"),
      selector: "printed_quantity",
      Sortable: true
    },
    {
      name: t("START SEQ NO."),
      cell: (row) => (
        <Input value={row.start_seq_no} onChange={(e) => console.log(row)} />
      )
    },
    {
      name: t("END SEQ NO."),
      cell: (row) => <Input value={row.end_seq_no} />
    },
    {
      name: t("PRINT"),
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
      <CardBody>
        <Card>
          <CardBody>
            <DataTable data={dummyData} columns={orderListCol} noHeader />
          </CardBody>
        </Card>
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

export default DirectPrint
