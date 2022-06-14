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
import { connect, useDispatch } from "react-redux"
import { getUserData } from "@utils"
import { savePOOrder } from "@redux/actions/views/common"
import {
  setInvoiceAddressDetails,
  setDeliveryAddressDetails,
  setContactDetails
} from "@redux/actions/views/Order/POOrder"

const InvoiceAndDelivery = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [clientDetails, setClientDetails] = useState({})
  const [, setInvoiceAddressList] = useState({})
  const [, setDeiveryAddresList] = useState({})

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

  const processSummarySizeTable = (size_matrix_type) => {
    return Object.keys(props.summaryTable).map((key) => {
      const returnDict = {
        group_type: key,
        size_matrix_type
      }
      if (props.wastageApplied === "N") {
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

  const handleContactDetailsChange = (value, field) => {
    const tempState = { ...props.contactDetails }
    tempState[field] = value
    dispatch(setContactDetails(tempState))
  }

  const handleAddressChange = (value, index, dispatchFun, initState) => {
    const tempAdd = initState ? initState.split("|") : []
    tempAdd[index] = value
    dispatch(
      dispatchFun({
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
      contact: setContactDetails
    }

    Object.keys(addressTypes).map((addType) => {
      const body = {
        order_user: getUserData().admin,
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
                      onChange={(e) =>
                        handleAddressChange(
                          e.target.value,
                          0,
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails?.address
                        )
                      }
                    />
                  </Col>
                  <Col xs="12" sm="12" md="6" lg="6" xl="6">
                    <Label>{t("Landmark e.g. near apollo hospital")}</Label>
                    <Input
                      value={
                        props.invoiceAddressDetails?.address?.split("|")[1]
                      }
                      style={{ marginBottom: "15px" }}
                      onChange={(e) =>
                        handleAddressChange(
                          e.target.value,
                          1,
                          setInvoiceAddressDetails,
                          props.invoiceAddressDetails?.address
                        )
                      }
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
                      onClick={() => {
                        dispatch(savePOOrder(clientDetails))
                      }}
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
                        handleAddressChange(
                          e.target.value,
                          0,
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails?.address
                        )
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
                        handleAddressChange(
                          e.target.value,
                          1,
                          setDeliveryAddressDetails,
                          props.deliveryAddressDetails?.address
                        )
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
  brand: state.poOrderReducer.brand,
  selectedItems: state.poOrderReducer.selectedItems,
  careData: state.poOrderReducer.careData,
  washCareData: state.poOrderReducer.washCareData,
  dynamicFieldData: state.poOrderReducer.dynamicFieldData,
  fibreInstructionData: state.poOrderReducer.fibreInstructionData,
  contentCustomNumber: state.poOrderReducer.contentCustomNumber,
  careCustomNumber: state.poOrderReducer.careCustomNumber,
  projectionLocation: state.poOrderReducer.projectionLocation,
  orderReference: state.poOrderReducer.orderReference,
  expectedDeliveryDate: state.poOrderReducer.expectedDeliveryDate,
  contentNumberData: state.poOrderReducer.contentNumberData,
  defaultContentData: state.poOrderReducer.defaultContentData,
  careNumberData: state.poOrderReducer.careNumberData,
  contentGroup: state.poOrderReducer.contentGroup,
  coo: state.poOrderReducer.coo,
  sizeContentData: state.poOrderReducer.sizeContentData,
  summaryTable: state.poOrderReducer.summaryTable,
  sizeTable: state.poOrderReducer.sizeTable,
  defaultSizeTable: state.poOrderReducer.defaultSizeTable,
  sizeMatrixType: state.poOrderReducer.sizeMatrixType,
  deliveryAddressDetails: state.poOrderReducer.deliveryAddressDetails,
  invoiceAddressDetails: state.poOrderReducer.invoiceAddressDetails,
  contactDetails: state.poOrderReducer.contactDetails,
  wastageApplied: state.poOrderReducer.wastageApplied
})

export default connect(mapStateToProps, null)(InvoiceAndDelivery)
