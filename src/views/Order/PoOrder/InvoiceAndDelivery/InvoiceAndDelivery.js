import { useState, useEffect } from "react"
import axios from "@axios"
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
import Footer from "../../../CommonFooter"
import { useTranslation } from "react-i18next"
import { formatDateYMD } from "@utils"
import { XMLBuilder } from "fast-xml-parser"

const InvoiceAndDelivery = (props) => {
  const { t } = useTranslation()
  const [clientDetails, setClientDetails] = useState({})
  const [invoiceAddressList, setInvoiceAddressList] = useState({})
  const [deliveryAddressList, setDeiveryAddresList] = useState({})
  const [invoiceAddressDetails, setInvoiceAddressDetails] = useState({})
  const [deliveryAddressDetails, setDeliveryAddressDetails] = useState({})
  const [contactInfo, setContactInfo] = useState({})
  const [contactInfoDetails, setContactInfoDetails] = useState({})

  const buildXML = (jsObj) => {
    const builder = new XMLBuilder()
    return builder.build(jsObj)
  }

  const formatRowToCol = (table) => {
    const newTable = []
    table.map((row, rIndex) => {
      Object.keys(row).map((key, index) => {
        const tempData = {}
        if (rIndex === 0) {
          tempData["Column0"] = key.includes("QTY") ? "QTY" : "TITLE"
          tempData["Column1"] = key
          tempData["Column2"] = row[key]
          newTable[index] = { ...tempData }
        } else {
          tempData[`Column${rIndex + 2}`] = row[key]
          newTable[index] = { ...newTable[index], ...tempData }
        }
      })
    })
    return {
      "?xml": "",
      SizeMatrix: {
        Table: newTable
      }
    }
  }

  const processPoSizeTable = (table) => {
    return {
      "?xml": "",
      SizeMatrix: {
        Table: table
      }
    }
  }

  const processSummarySizeTable = () => {
    return Object.keys({ ...props.summaryTable }).map((key) => {
      const returnDict = {
        group_type: key
      }
      if (!props.wastageApplied) {
        return {
          ...returnDict,
          size_content: buildXML(formatRowToCol(props.summaryTable[key])),
          default_size_content: buildXML(
            formatRowToCol(props.summaryTable[key])
          )
        }
      } else {
        // just remove "QTY ITEM REF 1 WITH WASTAGE" col for default_size_content
        const processedDefault = props.summaryTable[key].map((row) => {
          const tempRow = { ...row }
          delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          return tempRow
        })
        // to xml string
        const processedDefaultXML = buildXML(formatRowToCol(processedDefault))
        // preprocess for size_content
        const processedWastage = props.summaryTable[key].map((row) => {
          const tempRow = { ...row }
          tempRow["QTY ITEM REF 1"] = tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          return tempRow
        })
        // to xml string
        const processedWastageXML = buildXML(formatRowToCol(processedWastage))
        return {
          ...returnDict,
          size_content: processedWastageXML,
          default_size_content: processedDefaultXML
        }
      }
    })
  }

  //API Services
  const saveOrder = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_user: "innoa",
      order_key: props.combinedPOOrderKey, // to be
      order_no: "",
      num: "",
      order_status: "Draft",
      is_copy_order: "N",
      po_number: props.orderReference,
      factory_code: "",
      location_code: props.projectionLocation ? props.projectionLocation : "",
      draft_order_email: clientDetails.draft_email,
      approved_email_address: "", // to be
      order_expdate_delivery_date: formatDateYMD(
        new Date(props.expectedDeliveryDate)
      ),
      invoice_address: [
        {
          invoice_address_id: invoiceAddressDetails.dyn_address_id,
          invoice_contact_id: contactInfoDetails.dyn_customer_id,
          invoice_cpyname: invoiceAddressDetails.name,
          invoice_contact: contactInfoDetails.name,
          invoice_phone: contactInfoDetails.phone,
          invoice_fax: contactInfoDetails.fax,
          invoice_email: contactInfoDetails.email,
          invoice_addr: invoiceAddressDetails.address,
          invoice_addr2: invoiceAddressDetails.address2,
          invoice_addr3: invoiceAddressDetails.address3
        }
      ],
      delivery_address: [
        {
          delivery_address_id: deliveryAddressDetails.dyn_address_id,
          delivery_contact_id: deliveryAddressDetails.dyn_customer_id,
          delivery_cpyname: deliveryAddressDetails.name,
          delivery_contact: contactInfoDetails.name,
          delivery_phone: contactInfoDetails.phone,
          delivery_fax: contactInfoDetails.fax,
          delivery_email: contactInfoDetails.email,
          delivery_city: deliveryAddressDetails.city,
          delivery_country: deliveryAddressDetails.country,
          delivery_post_code: deliveryAddressDetails.post_code,
          delivery_addr: deliveryAddressDetails.address,
          delivery_addr2: deliveryAddressDetails.address2,
          delivery_addr3: deliveryAddressDetails.address3
        }
      ],
      dynamic_field: Object.values(props.dynamicFieldData),
      summary_size_table: processSummarySizeTable(),
      size_matrix_type: props.sizeMatrixType,
      size_content: props.sizeTable,
      default_size_content: props.defaultSizeTable,
      size_pointer: "",
      coo: props.coo,
      shrinkage_percentage: "",
      item_ref: props.selectedItems.map((item) => ({
        item_key: item.guid_key || "",
        item_ref: item.item_ref || "",
        qty: 1, // static for now
        price: item.price || "",
        currency: item.currency || ""
      })),
      is_wastage: "",
      update_user: "innoa",
      update_date: formatDateYMD(new Date()),
      contents: [
        {
          brand_key: props.brand?.value,
          order_user: "innoa",
          content_custom_number: props.contentCustomNumber,
          content_number: props.contentNumberData?.label,
          content_number_key: props.contentNumberData?.value,
          care_custom_number: props.careCustomNumber,
          care_number: props.careNumberData?.label,
          care_number_key: props.careNumberData?.value,
          content_group: props.contentGroup,
          content: props.fibreInstructionData?.map((data, index) => ({
            cont_key: data.cont_key,
            cont_translation: data.cont_translation,
            part_key: data.part_key,
            part_translation: data.part_translation,
            percentage: data.en_percent,
            seqno: (index + 1) * 10
          })),
          default_content: props.defaultContentData?.map((cont, index) => ({
            cont_key: cont.cont_key || "",
            seqno: (index + 1) * 10
          })),
          care: props.careData.map((data, index) => ({
            care_key: data.cont_key,
            seqno: (index + 1) * 10
          })),
          icon: Object.values(props.washCareData)?.map((obj, index) => ({
            icon_group: obj.icon_group,
            icon_type_id: obj.icon_type_id,
            icon_key: obj.sys_icon_key,
            seqno: (index + 1) * 10
          }))
        }
      ],
      po_size_table: props.sizeContentData.map((data) => ({
        ...data,
        size_content: buildXML(processPoSizeTable(data.size_content)),
        item_ref: props.selectedItems.map((item) => ({
          item_key: item.guid_key || "",
          item_ref: item.item_ref || "",
          qty: 1, // static for now
          price: item.price || "",
          currency: item.currency || ""
        }))
      }))
    }
    console.log("body", body)
    axios
      .post("Order/SaveOrder", body)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchUserInfo = () => {
    const body = {
      order_user: "innoa"
    }
    axios
      .post("/Client/GetClientDetail", body)
      .then((res) => {
        if (res.status === 200) {
          setClientDetails(res?.data)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchClientAddressList = () => {
    const addressTypes = {
      invoice: setInvoiceAddressList,
      delivery: setDeiveryAddresList,
      contact: setContactInfo
    }

    Object.keys(addressTypes).map((addType) => {
      const body = {
        order_user: "innoa",
        address_type: addType
      }
      axios
        .post("/Client/GetClientAddressList", body)
        .then((res) => {
          if (res.status === 200) {
            addressTypes[addType](res?.data)
            fetchAddressDetail(addType, res?.data[0])
          }
        })
        .catch((err) => console.log(err))
    })
  }

  const fetchAddressDetail = (addType, add) => {
    const addressTypes = {
      invoice: setInvoiceAddressDetails,
      delivery: setDeliveryAddressDetails,
      contact: setContactInfoDetails
    }
    const body = {
      order_user: "innoa",
      address_type: addType,
      address_id: add.address_id
    }
    axios
      .post("/Client/GetClientAddressDetail", body)
      .then((res) => {
        if (res.status === 200) {
          addressTypes[addType](res?.data[0])
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchUserInfo()
    fetchClientAddressList()
  }, [])

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
                    <Input
                      value={invoiceAddressDetails.name}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={contactInfoDetails.phone}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={invoiceAddressDetails?.address?.split("|")[0]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={invoiceAddressDetails?.address?.split("|")[1]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={invoiceAddressDetails.city}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={invoiceAddressDetails.post_code}
                      style={{ marginBottom: "15px" }}
                    />
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
                    <Button
                      onClick={() => saveOrder()}
                      style={{ width: "100%" }}
                      color="primary"
                    >
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
                    <Input
                      value={deliveryAddressDetails.name}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={contactInfoDetails.phone}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={deliveryAddressDetails?.address?.split("|")[0]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={deliveryAddressDetails?.address?.split("|")[1]}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={deliveryAddressDetails.city}
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={deliveryAddressDetails.post_code}
                      style={{ marginBottom: "15px" }}
                    />
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