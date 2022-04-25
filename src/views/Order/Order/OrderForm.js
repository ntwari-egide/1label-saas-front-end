import { useState, useEffect } from "react"
import axios from "@axios"
import Select, { components } from "react-select"
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
import Flatpickr from "react-flatpickr"
import { useTranslation } from "react-i18next"
import "@styles/react/libs/flatpickr/flatpickr.scss"

const OrderForm = (props) => {
  const { t } = useTranslation()
  // states for Collapse component
  const [itemInfoCollapse, setItemInfoCollapse] = useState(true)
  const [careContentCollapse, setCareContentCollapse] = useState(true)
  const [washCareCollapse, setWashCareCollapse] = useState(true)
  // Data
  const [sizeTableDetails, setSizeTableDetails] = useState([])
  const [itemInfoFields, setItemInfoFields] = useState([])
  const [fibreInstructionData, setFibreInstructionData] = useState([{}])
  const [careData, setCareData] = useState([{}])
  const [itemInfoOptions, setItemInfoOptions] = useState({})
  const [minExpectedDeliveryDate, setMinExpectedDeliveryDate] = useState("")
  const [iconSequence, setIconSequence] = useState([])
  const [washCareData, setWashCareData] = useState([])
  const [defaultContentData, setDefaultContentData] = useState({})
  // select options
  const [fabricOptions, setFabricOptions] = useState([])
  const [componentOptions, setComponentOptions] = useState([])
  const [additionalCareOptions, setAdditionalCareOptions] = useState([])
  const [projectionLocationOptions, setProjectionLocationOptions] = useState([])
  const [contentNumberOptions, setContentNumberOptions] = useState([])
  const [washCareOptions, setWashCareOptions] = useState({})

  // API services
  const fetchItemInfoData = () => {
    const body = {
      guid_key: "204681f9-c63a-435c-96e9-e6838ed56775"
    }
    axios.post("/Item/GetItemRefDetail", body).then((res) => {
      // console.log(res)
    })
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

  const fetchMinDeliveryDate = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      erp_id: 8,
      item_key: props.selectedItems ? props.selectedItems : null
    }

    axios
      .post("/Order/GetMinExpectedDeliveryDate", body)
      .then((res) => setMinExpectedDeliveryDate(res.data.min_delivery_date))
  }

  const fetchSizeTableList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      item_key: props.selectedItems ? props.selectedItems : [],
      query_str: ""
    }

    axios
      .post("/SizeTable/GetSizeTableList", body)
      .then((res) => {
        // console.log("sizetablelist", res)
      })
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
      .then((res) => {
        if (res.status === 200) {
          setContentNumberOptions(
            res.data.map((opt) => ({
              value: opt.guid_key,
              label: opt.style_number
            }))
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchIconSequenceList = () => {
    const iconGroups = ["A", "B"]
    let tempIconSeq = []
    let tempIconTranslation = {}
    iconGroups.map((iconGroup) => {
      const body = {
        brand_key: props.brand ? props.brand.value : "",
        icon_group: iconGroup,
        icon_key: ""
      }

      axios
        .post("/ContentNumber/GetIconSequence", body)
        .then((res) => {
          if (res.status === 200) {
            // data not garunteed for B group
            if (res?.data?.length > 0) {
              console.log("res", res)
              fetchIconTranslationList(res.data, tempIconTranslation, iconGroup)
              tempIconSeq = [...tempIconSeq, ...res.data]
              setIconSequence([...tempIconSeq])
            }
          }
        })
        .catch((err) => console.log(err))
    })
  }

  const fetchIconTranslationList = (
    iconSeq,
    tempIconTranslation,
    iconGroup
  ) => {
    if (iconSeq && iconSeq.length > 0) {
      iconSeq.map((icon) => {
        const body = {
          brand_key: props.brand ? props.brand.value : "",
          page_type: "icon",
          query_str: "",
          icon_type_key: icon.icon_type_id,
          product_line_key: ""
        }
        axios
          .post("/Translation/GetTranslationList", body)
          .then((res) => {
            if (res.status === 200) {
              tempIconTranslation[icon.sys_icon_name] = res.data.map((opt) => ({
                value: opt.guid_key,
                label: opt.gb_translation,
                icon: (
                  <img
                    src={
                      "https://portalpredeploy.1-label.com/upload/layout_file/icon/Icon_A_9f215010-c75f-4257-b27f-7cbf74740274.jpg"
                    }
                  />
                ),
                iconGroup,
                iconTypeId: icon.icon_type_id
              }))
              setWashCareOptions({ ...washCareOptions, ...tempIconTranslation })
            }
          })
          .catch((err) => console.log(err))
      })
    }
  }

  const fetchContentTranslationList = () => {
    // page types: content, part, care, icon
    const pageTypesDataDict = {
      content: setFabricOptions,
      part: setComponentOptions,
      care: setAdditionalCareOptions
    }

    Object.keys(pageTypesDataDict).map((pageType) => {
      const body = {
        brand_key: props.brand ? props.brand?.value : "",
        page_type: `${pageType}`,
        query_sr: "",
        icon_type_key: "",
        product_line_key: ""
      }

      axios
        .post("/Translation/GetTranslationList", body)
        .then((res) => {
          if (res.status === 200) {
            pageTypesDataDict[pageType](
              res.data.map((opt) => ({
                value: opt?.guid_key,
                label: opt?.gb_translation,
                percent: opt?.ist_percentage
              }))
            )
          }
        })
        .catch((err) => console.log(err))
    })
  }

  const fetchProductLocationList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_user: "innoa",
      order_no: ""
    }

    axios
      .post("/Order/GetLocationList", body)
      .then((res) => {
        if (res.status === 200) {
          setProjectionLocationOptions(
            res.data.map((loc) => ({ value: loc.erp_id, label: loc.erp_name }))
          )
        }
      })
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
              <Label>{field?.title}</Label>
            </Col>
            <Col xs="12" sm="12" md="6" lg="5" xl="5">
              <Select
                options={itemInfoOptions[field.title]}
                className="React"
                classNamePrefix="select"
              />
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
              <Label>{field?.title}</Label>
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

  const assignStateToItemInfo = (fields) => {
    let tempItemInfoData = {}
    if (fields.length > 0) {
      fields.map((field) => {
        fetch(field?.effect?.fetch?.action, {
          method: field?.effect?.fetch?.method,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...field?.effect?.fetch?.json_key_name,
            order_user: "innoa"
          })
        })
          .then((res) => res.json())
          .then((data) => {
            tempItemInfoData[field.title] = data.map((opt) => ({
              value: opt[field?.effect?.fetch?.json_value_key],
              label: opt[field?.effect?.fetch?.json_label_key]
            }))
            setItemInfoOptions({ ...tempItemInfoData })
          })
          .catch((err) => console.log(err))
      })
    }
  }

  useEffect(() => {
    console.log("washCareData", washCareData)
  }, [washCareData])

  useEffect(() => {
    assignStateToItemInfo(itemInfoFields)
  }, [itemInfoFields])

  useEffect(() => {
    console.log("fibreInstructionData", fibreInstructionData)
  }, [fibreInstructionData])

  useEffect(() => {
    console.log("washCareOptions", washCareOptions)
  }, [washCareOptions])

  useEffect(() => {
    fetchSizeTableList()
    fetchItemInfoData()
    fetchSizeTableDetails()
    fetchItemInfoFields()
    fetchContentNumberList()
    fetchIconSequenceList()
    fetchContentTranslationList()
    fetchProductLocationList()
    fetchMinDeliveryDate()
  }, [])

  return (
    <Card>
      <CardHeader>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>{t("Customer Order Reference")}</Label>
          <span className="text-danger">*</span>
          <Input style={{ margin: "5px" }} />
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>{t("Expected Delivery Date")}</Label>
          <span className="text-danger">*</span>
          <Flatpickr
            className="form-control"
            value={new Date()}
            style={{ margin: "5px" }}
            options={{
              minDate: minExpectedDeliveryDate
            }}
            onChange={(e) => {
              console.log(e)
            }}
            disabled={false}
          />
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>{t("Projection Location")}</Label>
          <span className="text-danger">*</span>
          <div style={{ margin: "5px" }}>
            <Select
              className="React"
              classNamePrefix="select"
              options={projectionLocationOptions}
            />
          </div>
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
                  <h4 className="text-primary">{t("Item Info")}</h4>
                </div>
              </CardHeader>
              <Collapse isOpen={itemInfoCollapse}>
                <CardBody>
                  {itemInfoFields.map((field) => {
                    return renderSwitch(field)
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
                  <h4 className="text-primary">{t("Care And Content")}</h4>
                </div>
              </CardHeader>
              <Collapse isOpen={careContentCollapse}>
                <CardBody>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Content#</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Select
                        className="React"
                        classNamePrefix="select"
                        options={contentNumberOptions}
                      />
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
                      <h5>{t("Fibre Instructions")}</h5>
                    </CardHeader>
                    <CardBody>
                      {fibreInstructionData.map((rec, index) => (
                        <Row style={{ marginBottom: "5px" }}>
                          <Col xs="12" sm="12" md="4" lg="4" xl="4">
                            <Label>Component</Label>
                            <Select
                              className="React"
                              classNamePrefix="select"
                              options={componentOptions}
                              value={componentOptions.filter(
                                (opt) => opt.value === rec.part_key
                              )}
                              onChange={(e) => {
                                const tempData = fibreInstructionData
                                tempData[index] = {
                                  ...fibreInstructionData[index],
                                  part_key: e.value
                                }
                                setFibreInstructionData([...tempData])
                              }}
                            />
                          </Col>
                          <Col xs="12" sm="12" md="3" lg="3" xl="3">
                            <Label>Fabric</Label>
                            <Select
                              className="React"
                              classNamePrefix="select"
                              options={fabricOptions}
                              value={fabricOptions.filter(
                                (opt) => opt.value === rec.cont_key
                              )}
                              onChange={(e) => {
                                const tempData = fibreInstructionData
                                tempData[index] = {
                                  ...fibreInstructionData[index],
                                  cont_key: e.value
                                }
                                setFibreInstructionData([...tempData])
                              }}
                            />
                          </Col>
                          <Col xs="12" sm="12" md="2" lg="2" xl="2">
                            <Label>%</Label>
                            <Input
                              value={fibreInstructionData[index].percentage}
                              onChange={(e) => {
                                const tempData = fibreInstructionData
                                tempData[index] = {
                                  ...fibreInstructionData[index],
                                  percentage: e.target.value
                                }
                                setFibreInstructionData([...tempData])
                              }}
                            />
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
                              onClick={() => {
                                const tempData = fibreInstructionData
                                tempData.splice(index, 1)
                                setFibreInstructionData([...tempData])
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <X />
                                <div style={{ marginTop: "5px" }}>Delete</div>
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </CardBody>
                    <CardFooter>
                      <Button
                        onClick={() => {
                          const tempFibreInstructions = fibreInstructionData
                          tempFibreInstructions.push({})
                          setFibreInstructionData([...tempFibreInstructions])
                        }}
                        color="primary"
                        style={{ padding: "10px" }}
                      >
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
                      <h5>{t("Care")}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col>
                          <Label>Additional Care & Mandatory Statements </Label>
                        </Col>
                      </Row>
                      {careData.map((rec, index) => (
                        <Row style={{ marginBottom: "7px" }}>
                          <Col xs="12" sm="12" md="8" lg="8" xl="8">
                            <Select
                              className="React"
                              classNamePrefix="select"
                              options={additionalCareOptions}
                              value={additionalCareOptions.filter(
                                (opt) => opt.value === rec.care_key
                              )}
                              onChange={(e) => {
                                const tempData = careData
                                careData[index] = {
                                  ...careData[index],
                                  care_key: e.value
                                }
                                setCareData([...tempData])
                              }}
                            />
                          </Col>
                          <Col xs="12" sm="12" md="1" lg="1" xl="1">
                            <Button
                              style={{ padding: "7px" }}
                              outline
                              className="btn btn-outline-danger"
                              onClick={() => {
                                const tempCare = careData
                                tempCare.splice(index, 1)
                                setCareData([...tempCare])
                              }}
                            >
                              <div style={{ display: "flex" }}>
                                <X />
                                <div style={{ marginTop: "5px" }}>Delete</div>
                              </div>
                            </Button>
                          </Col>
                        </Row>
                      ))}
                    </CardBody>
                    <CardFooter>
                      <Button
                        onClick={() => {
                          const tempCare = careData
                          tempCare.push({})
                          setCareData([...tempCare])
                        }}
                        color="primary"
                        style={{ padding: "10px" }}
                      >
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
                  <h4 className="text-primary">{t("Wash Care Symbol")} </h4>
                </div>
              </CardHeader>
              <Collapse isOpen={washCareCollapse}>
                <CardBody>
                  {iconSequence.map((iconObj) => {
                    return (
                      <Row style={{ marginBottom: "10px" }}>
                        <Col xs="12" s="12" md="2" lg="2" xl="2">
                          <Label style={{ marginTop: "12px" }}>
                            {iconObj.sys_icon_name}
                          </Label>
                        </Col>
                        <Col xs="12" s="12" md="8" lg="8" xl="8">
                          <Select
                            options={washCareOptions[iconObj?.sys_icon_name]}
                            onChange={(e) => {
                              const tempData = {}
                              tempData[iconObj.sys_icon_name] = {
                                icon_key: e.value,
                                icon_type_id: e.iconTypeId,
                                icon_group: e.iconGroup
                              }
                              setWashCareData({ ...washCareData, ...tempData })
                            }}
                            className="React"
                            classNamePrefix="select"
                            getOptionLabel={(e) => (
                              <div>
                                {e.icon}
                                {e.label}
                              </div>
                            )}
                          />
                        </Col>
                      </Row>
                    )
                  })}
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
