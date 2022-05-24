import { useState, useEffect } from "react"
import {
  Card,
  Col,
  Spinner,
  Button,
  Input,
  Row,
  CardBody,
  Label,
  Collapse,
  CardHeader,
  CardFooter
} from "reactstrap"
import { X, Plus } from "react-feather"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import Footer from "../../../CommonFooter"
import { use } from "i18next"

const OrderForm = (props) => {
  // constants
  const { t } = useTranslation()
  // states for Collapse component
  const [itemInfoCollapse, setItemInfoCollapse] = useState(true)
  const [careContentCollapse, setCareContentCollapse] = useState(true)
  const [washCareCollapse, setWashCareCollapse] = useState(true)
  // Data
  const [itemInfoFields, setItemInfoFields] = useState([])
  const [itemInfoOptions, setItemInfoOptions] = useState([])
  const [contentGroupOptions, setContentGroupOptions] = useState({})
  const [iconSequence, setIconSequence] = useState([])
  const [washCareOptions, setWashCareOptions] = useState({})
  const [fabricOptions, setFabricOptions] = useState([])
  const [componentOptions, setComponentOptions] = useState([])
  const [additionalCareOptions, setAdditionalCareOptions] = useState([])
  const [projectionLocationOptions, setProjectionLocationOptions] = useState([])

  const renderSwitch = (field) => {
    // renders dynamic fields under Item Info
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
                className="React"
                classNamePrefix="select"
                options={itemInfoOptions[field?.title]}
                value={itemInfoOptions[field?.title]?.filter(
                  (opt) =>
                    opt.value ===
                    props.dynamicFieldData[field?.title]?.field_value
                )}
                onChange={(e) => {
                  let tempData = props.dynamicFieldData
                  tempData[field?.title] = {
                    ...tempData[field?.title],
                    field_value: e.value,
                    field_label: e.label
                  }
                  props.setDynamicFieldData({ ...tempData })
                }}
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
              <Input
                value={props.dynamicFieldData[field.title]?.field_value}
                onChange={(e) => {
                  const tempState = props.dynamicFieldData
                  tempState[field.title] = {
                    ...tempState[field.title],
                    field_value: e.target.value
                  }
                  props.setDynamicFieldData({ ...tempState })
                }}
              />
            </Col>
          </Row>
        )
      default:
        return null
    }
  }

  const assignStateToItemInfo = (fields) => {
    // assign state for options in select fields for dynamic fields of Item Info
    let tempItemInfoOptions = {}
    let tempItemInfoState = {}
    if (fields.length > 0) {
      fields.map((field) => {
        // assigns initial state to dynamic fields data.
        tempItemInfoState[field.title] = {
          field_id: field.field,
          field_value: "",
          field_label: ""
        }
        if (field?.effect?.fetch?.action) {
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
              tempItemInfoOptions[field.title] = data.map((opt) => ({
                value: opt[field?.effect?.fetch?.json_value_key],
                label: opt[field?.effect?.fetch?.json_label_key]
              }))
              setItemInfoOptions({ ...tempItemInfoOptions })
            })
            .catch((err) => console.log(err))
        }
      })
      // initialises only if not previously set,
      // important for when the component is revisited since only initialises initial state when first visited.
      if (Object.keys(props.dynamicFieldData).length <= 0) {
        props.setDynamicFieldData({ ...tempItemInfoState })
      }
    }
  }

  const handleFibreChange = (e, index) => {
    // updating the fibreInstructionData state.
    const tempData = props.fibreInstructionData
    tempData[index] = {
      ...props.fibreInstructionData[index],
      cont_key: e.value,
      cont_translation: e.label
    }
    props.setFibreInstructionData([...tempData])
    // fetching default content for fabric and updating default content state
    let tempDefData = props.defaultContentData
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      cont_key: e.value,
      page_type: "content"
    }

    axios
      .post("/Translation/GetDefaultContentByContentKey", body)
      .then((res) => {
        if (res.status === 200) {
          tempDefData[index] = {
            cont_key: res.data[0]?.guid_key,
            cont_translation: res.data[0]?.gb_translation
          }
          props.setDefaultContentData([...tempDefData])
        }
      })
      .catch((err) => console.log(err))
  }

  // API services
  const fetchItemInfoFields = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      show_status: "Y",
      order_user: "innoa",
      order_no: props.combinedPOOrderKey || "",
      is_po_order_temp: props.isPoOrderTemp || ""
    }

    axios
      .post("/brand/GetDynamicFieldList", body)
      .then((res) => {
        if (res.status === 200) {
          setItemInfoFields(res.data)
          assignStateToItemInfo(res.data)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchPOOrderDetails = () => {
    const body = {
      order_user: "innoa",
      order_no: props.combinedPOOrderkey ? props.combinedPOOrderkey : "",
      brand_key: props.brand ? props.brand.value : "",
      is_po_order_temp: props.isPoOrderTemp ? props.isPoOrderTemp : ""
    }
    axios
      .post("/Order/GetOrderDetail", body)
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchContentNumberSettings = () => {
    // fetches content model either of: "ABC" or "A/BC"
    const body = {
      brand_key: props.brand ? props.brand.value : ""
    }

    axios
      .post("/Brand/GetContentNumberSetting", body)
      .then((res) => {
        if (res.status === 200) {
          props.setContentGroup(res.data[0]?.content_model) // to send to invoice and delivery for save order api
          fetchContentNumberList(res.data[0]?.content_model.split("/")) // passes content_group as an array
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchContentNumberList = (contentGroup) => {
    // fetches options for content and care select fields.
    const tempData = {}
    contentGroup.map((content_group) => {
      const body = {
        order_user: "innoa",
        brand_key: props.brand ? props.brand.value : "",
        content_group
      }
      axios
        .post("/ContentNumber/GetContentNumberList", body)
        .then((res) => {
          if (res.status === 200) {
            tempData[content_group] = res.data.map((opt) => ({
              value: opt.guid_key,
              label: opt.style_number
            }))
            setContentGroupOptions({ ...tempData })
          }
        })
        .catch((err) => console.log(err))
    })
  }

  const fetchContentNumberDetail = (
    content_number_key,
    style_number,
    group
  ) => {
    // fetches props.fibreInstructionData and props.careData for a selected content and care select fields respectively.
    const body = {
      order_user: "innoa",
      content_number_key,
      brand_key: props.brand ? props.brand.value : "",
      style_number
    }
    axios.post("/ContentNumber/GetContentNumberDetail", body).then((res) => {
      if (res.status === 200) {
        if (group === "A") {
          res?.data?.content
            ? props.setFibreInstructionData(res?.data?.content)
            : props.setFibreInstructionData([{}]) // default value, null throws eslint err
          const tempDefaultContentData = []
          res?.data?.content?.map((cont, index) => {
            // fetches default content data for fabric
            fetchDefaultContentData(
              cont.cont_key,
              index,
              tempDefaultContentData
            )
          })
        } else if (group === "BC") {
          res?.data?.care
            ? props.setCareData(res?.data?.care)
            : props.setCareData([{}]) // default value, null throws eslint err
          if (res?.data?.icon.length > 0) {
            const tempData = {}
            res?.data?.icon.map((icon) => {
              tempData[icon.icon_type_id] = {
                icon_group: icon.icon_group,
                icon_type_id: icon.icon_type_id,
                sys_icon_key: icon.sys_icon_key
              }
            })
            props.setWashCareData({ ...tempData })
          }
        }
      }
    })
  }

  const fetchDefaultContentData = (contKey, index, tempData) => {
    // fetches default Content Data as per option selected in fabric select field.
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      cont_key: contKey,
      page_type: "content"
    }

    axios
      .post("/Translation/GetDefaultContentByContentKey", body)
      .then((res) => {
        if (res.status === 200) {
          tempData[index] = {
            cont_key: res.data[0]?.guid_key,
            cont_translation: res.data[0]?.gb_translation
          }
          props.setDefaultContentData([...tempData])
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchIconSequenceList = () => {
    // fetched icon sequence list
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
    // fetches options for fields in wash care symbol
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
              tempIconTranslation[icon.icon_type_id] = res.data.map((opt) => ({
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
    // fetches options for below stated select fields.
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
    // fetches options for projection location select field.
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_user: "innoa",
      order_no: props.combinedPOOrderKey || ""
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

  const fetchItemInfoData = () => {
    const body = {
      guid_key: props.brand ? props.brand.value : ""
    }
    axios.post("/Item/GetItemRefDetail", body).then((res) => {
      // console.log(res)
    })
  }

  useEffect(() => {
    console.log("dynamicFieldData", props.dynamicFieldData)
  }, [props.dynamicFieldData])

  useEffect(() => {
    console.log("washCareOptions", washCareOptions)
  }, [washCareOptions])

  useEffect(() => {
    console.log("washCareData", props.washCareData)
  }, [props.washCareData])

  useEffect(() => {
    fetchItemInfoData()
    fetchPOOrderDetails()
    fetchItemInfoFields()
    fetchContentNumberSettings()
    fetchIconSequenceList()
    fetchContentTranslationList()
    fetchProductLocationList()
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
            style={{ margin: "5px" }}
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
              // value={projectionLocationOptions.filter(
              //   (opt) => opt.label === props.projectionLocation
              // )}
              // onChange={(e) => props.setProjectionLocation(e.label)}
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
                  {itemInfoFields.length > 0 ? (
                    itemInfoFields.map((field) => {
                      return renderSwitch(field)
                    })
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        height: "400px",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <Spinner color="primary" />
                      </div>
                    </div>
                  )}
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
                        // value={contentGroupOptions["A"]?.filter(
                        //   (opt) => opt.label === props.contentNumberData?.label
                        // )}
                        options={contentGroupOptions["A"]}
                        onChange={(e) => {
                          props.setContentNumberData(e)
                          fetchContentNumberDetail(e.value, e.label, "A")
                        }}
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
                      {props.fibreInstructionData
                        ? props.fibreInstructionData.map((rec, index) => (
                            <Row style={{ marginBottom: "5px" }}>
                              <Col xs="12" sm="12" md="4" lg="4" xl="4">
                                <Label>Component</Label>
                                <Select
                                  className="React"
                                  classNamePrefix="select"
                                  options={componentOptions}
                                  value={componentOptions.filter(
                                    (opt) => opt.value === rec?.part_key
                                  )}
                                  onChange={(e) => {
                                    const tempData = props.fibreInstructionData
                                    tempData[index] = {
                                      ...props.fibreInstructionData[index],
                                      part_key: e.value,
                                      part_translation: e.label
                                    }
                                    props.setFibreInstructionData([...tempData])
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
                                    (opt) => opt.value === rec?.cont_key
                                  )}
                                  onChange={(e) => {
                                    handleFibreChange(e, index)
                                  }}
                                />
                              </Col>
                              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                                <Label>%</Label>
                                <Input
                                // value={
                                //   props.fibreInstructionData[index]
                                //     ?.en_percent
                                // }
                                // onChange={(e) => {
                                //   const tempData = props.fibreInstructionData
                                //   tempData[index] = {
                                //     ...props.fibreInstructionData[index],
                                //     en_percent: e.target.value
                                //   }
                                //   props.setFibreInstructionData([...tempData])
                                //   debounceFun()
                                // }}
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
                                    let tempData = props.fibreInstructionData
                                    tempData.splice(index, 1)
                                    props.setFibreInstructionData([...tempData])
                                    tempData = props.defaultContentData
                                    tempData.splice(index, 1)
                                    props.setDefaultContentData([...tempData])
                                  }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <X />
                                    <div style={{ marginTop: "5px" }}>
                                      Delete
                                    </div>
                                  </div>
                                </Button>
                              </Col>
                            </Row>
                          ))
                        : null}
                    </CardBody>
                    <CardFooter>
                      <Button
                        onClick={() => {
                          const tempFibreInstructions =
                            props.fibreInstructionData
                          tempFibreInstructions.push({})
                          props.setFibreInstructionData([
                            ...tempFibreInstructions
                          ])
                          const tempDefaultContent = props.defaultContentData
                          tempDefaultContent.push("")
                          props.setDefaultContentData([...tempDefaultContent])
                        }}
                        color="primary"
                        style={{ padding: "10px" }}
                      >
                        <Plus />
                        Add New
                      </Button>
                    </CardFooter>
                  </Card>
                  <Row>
                    <Col>
                      <Label style={{ marginTop: "12px" }}>
                        Default Content:
                      </Label>
                    </Col>
                  </Row>
                  {props.defaultContentData.map((data, index) => (
                    <Row style={{ marginBottom: "10px" }}>
                      <Col xs="12" sm="12" md="9" lg="9" xl="9">
                        <Input
                        // value={
                        //   data?.cont_translation ? data?.cont_translation : ""
                        // }
                        // onChange={(e) => {
                        //   const tempState = props.defaultContentData
                        //   tempState[index] = {
                        //     ...tempState[index],
                        //     cont_translation: e.target.value
                        //   }
                        //   props.setDefaultContentData([...tempState])
                        // }}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Care:</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Select
                        className="React"
                        classNamePrefix="select"
                        //   value={contentGroupOptions["BC"]?.filter(
                        //     (opt) => opt.value === props.careNumberData?.value
                        //   )}
                        //   options={contentGroupOptions["BC"]}
                        onChange={(e) => {
                          props.setCareNumberData(e)
                          fetchContentNumberDetail(e.value, e.label, "BC")
                        }}
                      />
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "10px" }}>
                    <Col xs="12" sm="12" md="1" lg="1" xl="1">
                      <Label style={{ marginTop: "12px" }}>Save/Edit:</Label>
                    </Col>
                    <Col xs="12" sm="12" md="9" lg="9" xl="9">
                      <Input
                      // value={props.careCustomNumber}
                      // onChange={(e) =>
                      //   props.setCareCustomNumber(e.target.value)
                      // }
                      />
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
                      {props.careData.map((rec, index) => (
                        <Row style={{ marginBottom: "7px" }}>
                          <Col xs="12" sm="12" md="8" lg="8" xl="8">
                            <Select
                              className="React"
                              classNamePrefix="select"
                              options={additionalCareOptions}
                              value={additionalCareOptions.filter(
                                (opt) => opt.value === rec.cont_key
                              )}
                              onChange={(e) => {
                                const tempData = props.careData
                                props.careData[index] = {
                                  ...props.careData[index],
                                  cont_key: e.value
                                }
                                props.setCareData([...tempData])
                              }}
                            />
                          </Col>
                          <Col xs="12" sm="12" md="1" lg="1" xl="1">
                            <Button
                              style={{ padding: "7px" }}
                              outline
                              className="btn btn-outline-danger"
                              onClick={() => {
                                const tempCare = props.careData
                                tempCare.splice(index, 1)
                                props.setCareData([...tempCare])
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
                          const tempCare = props.careData
                          tempCare.push({})
                          props.setCareData([...tempCare])
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
                            className="React"
                            classNamePrefix="select"
                            options={washCareOptions[iconObj?.icon_type_id]}
                            value={
                              washCareOptions[iconObj?.icon_type_id]
                                ? washCareOptions[iconObj?.icon_type_id].filter(
                                    (opt) =>
                                      opt.value ===
                                      props.washCareData[iconObj?.icon_type_id]
                                        ?.sys_icon_key
                                  )
                                : ""
                            }
                            onChange={(e) => {
                              const tempData = {}
                              tempData[iconObj.icon_type_id] = {
                                sys_icon_key: e.value,
                                icon_type_id: e.iconTypeId,
                                icon_group: e.iconGroup
                              }
                              props.setWashCareData({
                                ...props.washCareData,
                                ...tempData
                              })
                            }}
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
          selectedItems={props.selectedItems}
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

export default OrderForm
