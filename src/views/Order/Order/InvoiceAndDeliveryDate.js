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
import Footer from "../../CommonFooter"
import { useTranslation } from "react-i18next"
import { formatDateYMD } from "@utils"
import { connect, useDispatch } from "react-redux"
import { getUserData } from "@utils"
import {
  setDeliveryAddressDetails,
  setInvoiceAddressDetails,
  setContactDetails
} from "@redux/actions/views/Order/Order"

const InvoiceAndDelivery = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [clientDetails, setClientDetails] = useState({})
  const [invoiceAddressList, setInvoiceAddressList] = useState({})
  const [deliveryAddressList, setDeiveryAddresList] = useState({})
  const [contactInfo, setContactInfo] = useState({})
  const [tempDeliveryAdd, setTempDeliveryAdd] = useState([])

  const handleContactDetailsChange = (value, field) => {
    const tempState = { ...props.contactDetails }
    tempState[field] = value
    dispatch(setContactDetails(tempState))
  }

  const handleDeliveryAddChange = (value, index) => {
    const tempAdd = props.deliveryAddressDetails?.address
      ? props.deliveryAddressDetails?.address?.split("|")
      : []
    console.log("tempstate", tempAdd)
    tempAdd[index] = value
    dispatch(
      setDeliveryAddressDetails({
        ...props.deliveryAddressDetails,
        address: tempAdd.join("|")
      })
    )
  }

  const handleDetailsChange = (value, field, dispatchFun, initState) => {
    const tempState = { ...initState }
    tempState[field] = value
    dispatch(dispatchFun(tempState))
  }

  //API Services
  const saveOrder = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_user: getUserData().admin,
      order_no: "",
      num: "",
      order_status: "Draft",
      is_copy_order: "N",
      po_number: props.orderReference,
      factory_code: "",
      location_code: props.projectionLocation ? props.projectionLocation : "",
      draft_order_email: clientDetails.draft_email,
      order_expdate_delivery_date: formatDateYMD(
        new Date(props.expectedDeliveryDate)
      ),
      invoice_address: [
        {
          invoice_address_id: props.invoiceAddressDetails?.dyn_address_id,
          invoice_contact_id: props.contactDetails?.dyn_customer_id,
          invoice_cpyname: props.invoiceAddressDetails?.name,
          invoice_contact: props.contactDetails?.name,
          invoice_phone: props.contactDetails?.phone,
          invoice_fax: props.contactDetails?.fax,
          invoice_email: props.contactDetails?.email,
          invoice_addr: props.invoiceAddressDetails?.address,
          invoice_addr2: props.invoiceAddressDetails?.address2,
          invoice_addr3: props.invoiceAddressDetails?.address3
        }
      ],
      delivery_address: [
        {
          delivery_address_id: props.deliveryAddressDetails?.dyn_address_id,
          delivery_contact_id: props.deliveryAddressDetails?.dyn_customer_id,
          delivery_cpyname: props.deliveryAddressDetails?.name,
          delivery_contact: props.contactDetails?.name,
          delivery_phone: props.contactDetails?.phone,
          delivery_fax: props.contactDetails?.fax,
          delivery_email: props.contactDetails?.email,
          delivery_city: props.deliveryAddressDetails?.city,
          delivery_country: props.deliveryAddressDetails?.country,
          delivery_post_code: props.deliveryAddressDetails?.post_code,
          delivery_addr: props.deliveryAddressDetails?.address,
          delivery_addr2: props.deliveryAddressDetails?.address2,
          delivery_addr3: props.deliveryAddressDetails?.address3
        }
      ],
      dynamic_field: Object.values(props.dynamicFieldData),
      size_matrix_type: props.sizeMatrixType,
      size_content: props.sizeTable,
      default_size_content: props.defaultSizeTable,
      size_pointer: "",
      coo: props.coo,
      shrinkage_percentage: "",
      item_ref: props.selectedItems.map((item) => ({
        item_key: item.guid_key,
        item_ref: item.item_ref,
        qty: 1, // static for now
        price: item.price,
        currency: item.currency
      })),
      is_wastage: "",
      update_user: "innoa",
      update_date: formatDateYMD(new Date()),
      contents: [
        {
          brand_key: props.brand?.value,
          order_user: getUserData().admin,
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
      ]
    }
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
      order_user: getUserData().admin
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
    const body = {
      order_user: getUserData().admin
    }
    Object.keys(addressTypes).map((addType) => {
      body.address_type = addType
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
      contact: setContactDetails
    }
    const body = {
      order_user: getUserData().admin,
      address_type: addType,
      address_id: add.address_id
    }
    axios
      .post("/Client/GetClientAddressDetail", body)
      .then((res) => {
        if (res.status === 200) {
          dispatch(addressTypes[addType](res?.data[0]))
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
                      value={props.invoiceAddressDetails?.name}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "name",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={props.contactDetails?.phone}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleContactDetailsChange(e.target.value, "phone")
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={
                        props.invoiceAddressDetails?.address?.split("|")[0]
                      }
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={
                        props.invoiceAddressDetails?.address?.split("|")[1]
                      }
                      style={{ marginBottom: "15px" }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.city}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "city",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={props.invoiceAddressDetails?.post_code}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "post_code",
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails
                        )
                      }
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
                      value={props.deliveryAddressDetails?.name}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "name",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Mobile Number")}</Label>
                    <Input
                      value={props.contactDetails?.phone}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) => {
                        handleContactDetailsChange(e.target.value, "phone")
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Flat, House No")}</Label>
                    <Input
                      value={
                        props.deliveryAddressDetails?.address?.split("|")[0]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDeliveryAddChange(e.target.value, 0)
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={
                        props.deliveryAddressDetails?.address?.split("|")[1]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDeliveryAddChange(e.target.value, 1)
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Town/City")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.city}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "city",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Pincode")}</Label>
                    <Input
                      value={props.deliveryAddressDetails?.post_code}
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleDetailsChange(
                          e.target.value,
                          "post_code",
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails
                        )
                      }
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

const mapStateToProps = (state) => ({
  brand: state.orderReducer.brand,
  selectedItems: state.orderReducer.selectedItems,
  projectionLocation: state.orderReducer.projectionLocation,
  orderReference: state.orderReducer.orderReference,
  expectedDeliveryDate: state.orderReducer.expectedDeliveryDate,
  coo: state.orderReducer.coo,
  contentNumberData: state.orderReducer.contentNumberData,
  defaultContentData: state.orderReducer.defaultContentData,
  fibreInstructionData: state.orderReducer.fibreInstructionData,
  careData: state.orderReducer.careData,
  washCareData: state.orderReducer.washCareData,
  careNumberData: state.orderReducer.careNumberData,
  careCustomNumber: state.orderReducer.careCustomNumber,
  contentCustomNumber: state.orderReducer.contentCustomNumber,
  dynamicFieldData: state.orderReducer.dynamicFieldData,
  contentGroup: state.orderReducer.contentGroup,
  sizeMatrixType: state.orderReducer.sizeMatrixType,
  sizeTable: state.orderReducer.sizeTable,
  defaultSizeTable: state.orderReducer.defaultSizeTable,
  invoiceAddressDetails: state.orderReducer.invoiceAddressDetails,
  deliveryAddressDetails: state.orderReducer.deliveryAddressDetails,
  contactDetails: state.orderReducer.contactDetails
})

export default connect(mapStateToProps, null)(InvoiceAndDelivery)
