import { useState, useEffect } from "react"
import { Spinner, Card, CardHeader, CardBody, Row, Col } from "reactstrap"
import { useTranslation } from "react-i18next"
import axios from "@axios"
import DataTable from "react-data-table-component"

const Listing = () => {
  const [orderList, setOrderList] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  const cols = [
    {
      name: t("ORDER CONFIRMATION"),
      selector: "order_no",
      sortable: true,
      width: "225px"
    },
    {
      name: t("REV NO"),
      selector: "rev_no",
      sortable: false
    },
    {
      name: t("DESSIN"),
      selector: "Supplier Ref",
      sortable: false
    },
    {
      name: t("CUSTOMER ORDER REF"),
      selector: "Supplier Colour",
      sortable: false
    },
    {
      name: t("CREATE DATE"),
      selector: "order_date",
      sortable: false,
      width: "175px"
    },
    {
      name: t("ORDER DATE"),
      selector: "order_confirm_date",
      width: "175px",
      sortable: false
    },
    {
      name: t("EXPECTED DELIVERY DATE"),
      selector: "order_expdate",
      width: "200px",
      sortable: false
    },
    {
      name: t("CONTACT PERSON"),
      selector: "invoice_contact",
      sortable: false,
      width: "150px"
    },
    {
      name: t("EMAIL"),
      selector: "invoice_email",
      sortable: false,
      width: "250px"
    },
    {
      name: t("ORDER STATUS"),
      selector: "order_status",
      sortable: false
    },
    {
      name: t("CREATE BY"),
      selector: "order_user"
    },
    {
      name: t("CLIENT NAME"),
      selector: "order_user"
    },
    {
      name: t("LAST UPDATE PERSON"),
      selector: "update_user"
    }
  ]

  const copyConfirmOrder = () => {
    const body = {
      order_user: "innoa",
      brand_key: "e8c439c4-2bc0-4304-8053-e818071b5293",
      order_no: "JJ2-PO2022040006"
    }

    axios
      .post(Order / CopyOrder, body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const sendOrderEmail = (orderStatus) => {
    const body = {
      order_user: "innoa",
      brand_key: "e8c439c4-2bc0-4304-8053-e818071b5293",
      order_no: "JJ2-PO2022040006",
      order_status: "Draft"
    }

    axios
      .post("Order/SendOrderEmail", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const fetchOrderList = () => {
    const body = {
      order_user: "innoa",
      page_index: "1",
      page_size: "10",
      order_date_from: "2022-01-1",
      order_date_to: "2022-05-5"
    }

    axios
      .post("/Order/GetOrderList", body)
      .then((res) => {
        setOrderList(res.data)
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchOrderList()
  }, [])

  return (
    <Card>
      <CardHeader>
        <h3>Order List</h3>
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            {loading ? (
              <div
                style={{
                  minHeight: "560px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Spinner color="primary" />
              </div>
            ) : (
              <DataTable
                data={orderList}
                columns={cols}
                noHeader={true}
                style={{ minHeight: "500px" }}
              />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default Listing
