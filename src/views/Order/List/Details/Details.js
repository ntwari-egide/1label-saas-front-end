import { useState, useEffect } from "react"
import { Card, CardHeader, CardBody, Row, Col, Button } from "reactstrap"

const Details = () => {
  const fetchItemDetails = () => {
    const body = {
      guid_key: ""
    }

    axios
      .post("Item/GetItemRefDetail", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const fetchBrandDetails = () => {
    const body = {
      brand_key: ""
    }

    axios
      .post("brand/GetBrandDetail", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const deleteOrder = () => {
    const body = {
      order_user: "",
      brand_key: "",
      order_no: ""
    }

    axios
      .post("/Order/DeleteOrder", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  const confirmOrder = () => {
    const body = {
      brand_key: "e8c439c4-2bc0-4304-8053-e818071b5293",
      order_user: "innoa",
      order_no: "",
      guid_key: "",
      num: "",
      order_status: "Confirm",
      is_copy_order: "N",
      po_number: "Test-PO-Number-2022.4.27",
      factory_code: "",
      location_code: "HK",
      draft_order_email: "jia.zhu@innoways.com",
      approver_email_address: "jia1.zhu@innoways.com",
      order_expdate_delivery_date: "2022-05-06",
      invoice_address: [
        {
          invoice_address_id: "",
          invoice_contact_id: "",
          invoice_cpyname: "SHADMAN COTTON MILLS LIMITED",
          invoice_contact: "Rene_ Hald",
          invoice_phone: "12345679__",
          invoice_fax: "",
          invoice_email: "jia.zhu@innoways.com",
          invoice_addr:
            "2-E, BLOCK G,|MUSHTAQ AHMED GURMANI ROAD,|GULBERG II, LAHORE,|54660 (VAT#0698472-0)||, 54000 , Lahore, Pakistan",
          invoice_addr2: "",
          invoice_addr3: ""
        }
      ],
      delivery_address: [
        {
          delivery_address_id: "",
          delivery_contact_id: "",
          delivery_cpyname: "SHADMAN COTTON MILLS LIMITED",
          delivery_contact: "Rene_ Hald",
          delivery_phone: "12345679__",
          delivery_fax: "",
          delivery_email: "",
          delivery_city: "Lahore",
          delivery_country: "PAK",
          delivery_post_code: "54000",
          delivery_addr:
            "2-E, BLOCK G,|MUSHTAQ AHMED GURMANI ROAD,|GULBERG II, LAHORE,|54660||, 54000 , Lahore, Pakistan",
          delivery_addr2: "",
          delivery_addr3: ""
        }
      ],
      dynamic_field: [
        {
          field_id: "F1",
          field_value: "1",
          field_label: "Sample"
        },
        {
          field_id: "F2",
          field_value: "NO LOGO",
          field_label: "Sample"
        },
        {
          field_id: "F3",
          field_value: "Test-style name-1",
          field_label: "Sample"
        },
        {
          field_id: "F4",
          field_value: "dessin8",
          field_label: "Sample"
        },
        {
          field_id: "F5",
          field_value: "AKK",
          field_label: "Sample"
        },
        {
          field_id: "F6",
          field_value: "AAA",
          field_label: "Sample"
        },
        {
          field_id: "F7",
          field_value: "Made in China",
          field_label: "Sample"
        },
        {
          field_id: "F8",
          field_value: "2018",
          field_label: "Sample"
        },
        {
          field_id: "F9",
          field_value: "Male",
          field_label: "Sample"
        },
        {
          field_id: "F10",
          field_value: "Belts",
          field_label: "Sample"
        },
        {
          field_id: "F11",
          field_value: "test test -1",
          field_label: "Sample"
        },
        {
          field_id: "F12",
          field_value: "121",
          field_label: "Sample"
        },
        {
          field_id: "F13",
          field_value: "FEATHERS AND DOWN",
          field_label: "Sample"
        },
        {
          field_id: "F14",
          field_value: "Pink",
          field_label: "Sample"
        },
        {
          field_id: "F15",
          field_value: "pppp nnnn",
          field_label: "Sample"
        },
        {
          field_id: "F16",
          field_value: "jia.zhu",
          field_label: "Sample"
        },
        {
          field_id: "F17",
          field_value: "CHINA",
          field_label: "Sample"
        },
        {
          field_id: "F18",
          field_value: "N/A",
          field_label: "Sample"
        },
        {
          field_id: "F19",
          field_value: "N/A",
          field_label: "Sample"
        },
        {
          field_id: "F20",
          field_value: "s-00",
          field_label: "Sample"
        }
      ],
      size_matrix_type: "Size For Short 001",
      size_content: "",
      size_pointer: "1",
      coo: "Made in China",
      shrinkage_percentage: "",
      item_ref: [
        {
          item_key: "d0fb9e25-d2f1-4364-880a-0636462a079d",
          item_ref: "D365 Sized Item(20210831A02)",
          qty: 60,
          price: 0,
          currency: ""
        }
      ],
      is_wastage: "N",
      update_user: "innoa",
      update_date: "2022-4-26 10:30:251",
      contents: [
        {
          brand_key: "e8c439c4-2bc0-4304-8053-e818071b5293",
          order_user: "innoa",
          content_custom_number: "Content-jia",
          content_number: "",
          content_number_key: "",
          care_custom_number: "Care-jia",
          care_number: "",
          care_number_key: "",
          content_group: "A/BC",
          content: [
            {
              part_translation: "Back",
              part_key: "36C4B890-E6CD-49BD-9197-7DAAA998F222",
              cont_translation: "Acrylic",
              cont_key: "6D386D49-A9C2-4C2B-8B88-486AFAFA879F",
              percentage: "50",
              seqno: 10
            },
            {
              part_translation: "",
              part_key: "",
              cont_translation: "Down",
              cont_key: "5CC03D1E-81B4-4983-8D7A-C5EFE2054A48",
              percentage: "50",
              seqno: 20
            },
            {
              part_translation: "part-1",
              part_key: "B92E89A4-3EBE-4DE8-8488-40EA8EB9A290",
              cont_translation: "contetn-1",
              cont_key: "5637F99E-F08E-40B0-91B5-7F5091269BE5",
              percentage: "100",
              seqno: 30
            },
            {
              part_translation: "part-2",
              part_key: "d644bec7-7ea5-46a9-b3be-e88ed6870c5e",
              cont_translation: "content-2",
              cont_key: "22576c9d-0a3c-4cc3-a40b-7057d6d1a59c",
              percentage: "100",
              seqno: 40
            }
          ],
          default_content: [
            {
              cont_key: "66E665F2-87CE-4F24-BF83-6031995B33BF",
              seqno: 10
            },
            {
              cont_key: "E42863F6-E9E0-46BA-8E20-D183B433DD3E",
              seqno: 20
            }
          ],
          care: [
            {
              care_key: "D6714A88-C409-4E54-84ED-29C2A20BA234",
              seqno: 10
            },
            {
              care_key: "905C6C95-E84D-402A-8AD7-D6A02D47F70A",
              seqno: 20
            }
          ],
          icon: [
            {
              icon_key: "b0638f08-c614-46cc-90d3-5590d5adf311",
              seqno: 10,
              icon_type_id: 1,
              icon_group: "A"
            },
            {
              icon_key: "22fb7888-6dbc-47c4-b118-42dfd54dd2c4",
              seqno: 20,
              icon_type_id: 2,
              icon_group: "A"
            },
            {
              icon_key: "8e0676ba-704b-442d-bb56-87287a599cea",
              seqno: 30,
              icon_type_id: 6,
              icon_group: "A"
            },
            {
              icon_key: "8e622c9e-59cd-4daf-ba6d-ccc84b4359f8",
              seqno: 60,
              icon_type_id: 10,
              icon_group: "A"
            },
            {
              icon_key: "fa8eddae-cb77-4b8f-81c5-f9725c5f3680",
              seqno: 40,
              icon_type_id: 4,
              icon_group: "A"
            },
            {
              icon_key: "578c991d-4776-43d7-935c-56bc3761c2b1",
              seqno: 50,
              icon_type_id: 3,
              icon_group: "A"
            }
          ]
        }
      ]
    }

    axios
      .post("/Order/SaveOrder", body)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <Row>
        <Col xs="12" sm="12" md="12" lg="8" xl="8">
          <Card>
            <CardBody></CardBody>
          </Card>
        </Col>
        <Col xs="12" sm="12" md="12" lg="4" xl="4">
          <Card>
            <CardHeader>
              <p className="text-muted">OPTIONS</p>
            </CardHeader>
            <CardBody>
              <Row>
                <Col>Price Details</Col>
              </Row>
              <Row style={{ marginTop: "15px" }}>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                  <p className="text-muted" style={{ marginBottom: 0 }}>
                    Total MRP
                  </p>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                  <div style={{ textAlign: "right" }}>
                    <p style={{ marginBottom: 0 }}>$0.1</p>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                  <p className="text-muted" style={{ marginBottom: 0 }}>
                    Delivery Charges
                  </p>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                  <div style={{ textAlign: "right" }}>
                    <p style={{ marginBottom: 0 }}>$10</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <hr
                  style={{
                    widht: "100%",
                    border: "1px solid",
                    color: "#80808026",
                    marginLeft: "10px",
                    marginRight: "10px"
                  }}
                />
              </Row>
              <Row style={{ marginTop: "15px" }}>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                  <p style={{ marginBottom: 0 }}>Total</p>
                </Col>
                <Col xs="6" sm="6" md="6" lg="6" xl="6">
                  <div style={{ textAlign: "right" }}>
                    <p style={{ marginBottom: 0 }}>$10.01</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    color="primary"
                    style={{ width: "100%", marginTop: "5px" }}
                  >
                    Place Order
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Details
