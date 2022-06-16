import { useState, useEffect } from "react"
import axios from "@axios"
import Select from "react-select"
import {
  Card,
  Label,
  Collapse,
  CardHeader,
  Spinner,
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
import { connect, useDispatch } from "react-redux"
import {
  setExpectedDeliveryDate,
  setProjectionLocation,
  setOrderReference,
  fetchMinExpectedDeliveryDate,
  setCoo,
  fetchContentNumberDetail,
  setContentNumberData,
  handleFibreChange,
  setDefaultContentData,
  setFibreInstructionData,
  setCareData,
  setWashCareData,
  setCareNumberData,
  setContentCustomNumber,
  setCareCustomNumber,
  setDynamicFieldData,
  setContentGroup
} from "@redux/actions/views/Order/Order"
import { getUserData } from "@utils"

let timerId = null
const OrderForm = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // states for Collapse component
  const [itemInfoCollapse, setItemInfoCollapse] = useState(true)
  const [careContentCollapse, setCareContentCollapse] = useState(true)
  const [washCareCollapse, setWashCareCollapse] = useState(true)
  // Data
  const [itemInfoFields, setItemInfoFields] = useState([])
  const [itemInfoOptions, setItemInfoOptions] = useState({})
  const [iconSequence, setIconSequence] = useState([])
  // select options
  const [fabricOptions, setFabricOptions] = useState([])
  const [componentOptions, setComponentOptions] = useState([])
  const [additionalCareOptions, setAdditionalCareOptions] = useState([])
  const [projectionLocationOptions, setProjectionLocationOptions] = useState([])
  const [contentGroupOptions, setContentGroupOptions] = useState({})
  const [washCareOptions, setWashCareOptions] = useState({})
  const [isContentSettingCommon, setIsContentSettingCommon] = useState("")

  // debounce function to fetch /ContentNumber/MatchContentNumber on percent input change event
  const debounceFun = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      matchContentNumber()
      timerId = null
    }, 400)
  }

  const matchContentNumber = () => {
    // fetches content and care option value as per change in props.fibreInstructionData and props.careData
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_user: getUserData().admin,
      custom_number: "Test Number-jia",
      content_group: "A",
      content: props.fibreInstructionData.map((data, index) => ({
        cont_key: data.cont_key,
        part_key: data.part_key,
        percentage: data.en_percent,
        seqno: (index + 1) * 10
      })),
      default_content: props.defaultContentData.map((cont, index) => ({
        cont_key: cont,
        seqno: (index + 1) * 10
      })),
      care: props.careData.map((data, index) => ({
        care_key: data.cont_key,
        seqno: (index + 1) * 10
      })),
      icon: Object.values(props.washCareData).map((obj, index) => ({
        ...obj,
        seqno: (index + 1) * 10
      }))
    }
    console.log("match body", body)
    axios.post("/ContentNumber/MatchContentNumber", body).then((res) => {
      if (res.status === 200) {
        console.log("match content", res)
      }
    })
  }

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
    // fetches dynamic fields under Item Info
    const body = {
      brand_key: props.brand.value,
      show_status: "Y"
    }
    axios
      .post("/Brand/GetDynamicFieldList", body)
      .then((res) => {
        if (res.status === 200) {
          // sets dynamic item info fields which will trigger assignStateToItemInfo()
          // also is used to render fields
          setItemInfoFields(res.data)
          assignStateToItemInfo(res.data)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchSizeTableList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      item_key: props.selectedItems.map((item) => item.guid_key),
      query_str: ""
    }

    axios
      .post("/SizeTable/GetSizeTableList", body)
      .then((res) => {
        // console.log("sizetablelist", res)
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
          dispatch(setContentGroup(res.data[0]?.content_model)) // to send to invoice and delivery for save order api
          // sets state to determine options for care and content for different content settings namely A/BC and ABC
          if (res.data[0]?.content_model === "ABC") {
            setIsContentSettingCommon(true)
          } else {
            setIsContentSettingCommon(false)
          }
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
        order_user: getUserData().admin,
        brand_key: props.brand?.value,
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
                icon: <img src={opt.icon_file} />,
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
      order_user: getUserData().admin,
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
                options={itemInfoOptions[field.title]}
                className="React"
                classNamePrefix="select"
                value={itemInfoOptions[field.title]?.filter(
                  (opt) =>
                    opt.value ===
                    props.dynamicFieldData[field?.title]?.field_value
                )}
                onChange={(e) => {
                  // set coo to use later in invoice and delivery component
                  if (field.field === "F3") {
                    dispatch(setCoo(e.label))
                  }
                  const tempState = props.dynamicFieldData
                  tempState[field.title] = {
                    ...tempState[field.title],
                    field_value: e.value,
                    field_label: e.label
                  }
                  dispatch(setDynamicFieldData({ ...tempState }))
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
                  dispatch(setDynamicFieldData({ ...tempState }))
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
        // to establish a data structure
        tempItemInfoState[field.title] = {
          field_id: field.field,
          field_value: "",
          field_label: ""
        }
        // fetches options for select inputs for dynamic fields.
        if (field?.effect?.fetch?.action) {
          fetch(field?.effect?.fetch?.action, {
            method: field?.effect?.fetch?.method,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...field?.effect?.fetch?.json_key_name,
              order_user: getUserData().admin
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
        dispatch(setDynamicFieldData({ ...tempItemInfoState }))
      }
    }
  }

  // useEffect(() => {
  //   console.log("props.defaultContentData", props.defaultContentData)
  // }, [props.defaultContentData])

  useEffect(() => {
    console.log("props.washCareData", props.washCareData)
  }, [props.washCareData])

  useEffect(() => {
    console.log("props.careData", props.careData)
  }, [props.careData])
  //
  // useEffect(() => {
  //   console.log("additionalCareOptions", additionalCareOptions)
  // }, [additionalCareOptions])

  // useEffect(() => {
  //   assignStateToItemInfo(itemInfoFields)
  // }, [itemInfoFields])

  // useEffect(() => {
  //   console.log("dynamicFieldData", props.dynamicFieldData)
  // }, [props.dynamicFieldData])
  //
  // useEffect(() => {
  //   console.log("itemInfoOptions", itemInfoOptions)
  // }, [itemInfoOptions])

  // useEffect(() => {
  //   console.log("washCareOptions", washCareOptions)
  // }, [washCareOptions])
  //
  // useEffect(() => {
  //   console.log("props.washCareData", props.washCareData)
  // }, [props.washCareData])

  // useEffect(() => {
  //   console.log("contentGroupOptions", contentGroupOptions)
  // }, [contentGroupOptions])
  //
  // useEffect(() => {
  //   console.log("componentOptions", componentOptions)
  // }, [componentOptions])

  // useEffect(() => {
  //   console.log("props.fibreInstructionData", props.fibreInstructionData)
  // }, [props.fibreInstructionData])

  // useEffect(() => {
  //   console.log("contentNumberSettings", contentNumberSettings)
  // }, [contentNumberSettings])

  // useEffect(() => {
  //   console.log("iconSequence", iconSequence)
  // }, [iconSequence])
  //

  useEffect(() => {
    fetchContentNumberSettings()
    fetchSizeTableList()
    fetchItemInfoData()
    fetchItemInfoFields()
    fetchIconSequenceList()
    fetchContentTranslationList()
    fetchProductLocationList()
    // fetchMinDeliveryDate()
    dispatch(fetchMinExpectedDeliveryDate(props.brand, props.selectedItems))
  }, [])

  return (
    <Card>
      <CardHeader>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>{t("Customer Order Reference")}</Label>
          <span className="text-danger">*</span>
          <Input
            value={props.orderReference}
            onChange={(e) => {
              dispatch(setOrderReference(e.target.value))
            }}
            style={{ margin: "5px" }}
          />
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          <Label>{t("Expected Delivery Date")}</Label>
          <span className="text-danger">*</span>
          <Flatpickr
            className="form-control"
            value={props.expectedDeliveryDate ? props.expectedDeliveryDate : ""}
            style={{ margin: "5px" }}
            options={{
              minDate: props.minExpectedDeliveryDate
            }}
            onChange={(e) => {
              dispatch(setExpectedDeliveryDate(e))
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
              value={projectionLocationOptions.filter(
                (opt) => opt.label === props.projectionLocation
              )}
              onChange={(e) => {
                dispatch(setProjectionLocation(e.label))
              }}
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
                        value={contentGroupOptions["A"]?.filter(
                          (opt) => opt.label === props.contentNumberData?.label
                        )}
                        options={
                          isContentSettingCommon
                            ? contentGroupOptions["ABC"]
                            : contentGroupOptions["A"]
                        }
                        onChange={(e) => {
                          dispatch(setContentNumberData(e))
                          // props.setContentNumberData(e)
                          // fetchContentNumberDetail(e.value, e.label)
                          dispatch(
                            fetchContentNumberDetail(
                              e.value,
                              e.label,
                              props.brand
                            )
                          )
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
                        value={props.contentCustomNumber}
                        onChange={(e) =>
                          dispatch(setContentCustomNumber(e.target.value))
                        }
                      />
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
                                    dispatch(
                                      setFibreInstructionData([...tempData])
                                    )
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
                                    dispatch(
                                      handleFibreChange(
                                        e,
                                        index,
                                        props.fibreInstructionData,
                                        props.defaultContentData,
                                        props.brand
                                      )
                                    )
                                  }}
                                />
                              </Col>
                              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                                <Label>%</Label>
                                <Input
                                  value={
                                    props.fibreInstructionData[index]
                                      ?.en_percent
                                  }
                                  onChange={(e) => {
                                    const tempData = props.fibreInstructionData
                                    tempData[index] = {
                                      ...props.fibreInstructionData[index],
                                      en_percent: e.target.value
                                    }
                                    dispatch(
                                      setFibreInstructionData([...tempData])
                                    )
                                    debounceFun()
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
                                    let tempData = props.fibreInstructionData
                                    tempData.splice(index, 1)
                                    dispatch(
                                      setFibreInstructionData([...tempData])
                                    )
                                    tempData = props.defaultContentData
                                    tempData.splice(index, 1)
                                    dispatch(
                                      setDefaultContentData([...tempData])
                                    )
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
                          dispatch(
                            setFibreInstructionData([...tempFibreInstructions])
                          )
                          const tempDefaultContent = props.defaultContentData
                          tempDefaultContent.push("")
                          dispatch(
                            setDefaultContentData([...tempDefaultContent])
                          )
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
                          value={data?.cont_translation || ""}
                          disabled={true}
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
                        value={contentGroupOptions["BC"]?.filter(
                          (opt) => opt.value === props.careNumberData?.value
                        )}
                        options={
                          isContentSettingCommon
                            ? contentGroupOptions["ABC"]
                            : contentGroupOptions["BC"]
                        }
                        onChange={(e) => {
                          dispatch(setCareNumberData(e))
                          // fetchContentNumberDetail(e.value, e.label)
                          dispatch(
                            fetchContentNumberDetail(
                              e.value,
                              e.label,
                              props.brand
                            )
                          )
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
                        value={props.careCustomNumber}
                        onChange={(e) =>
                          dispatch(setCareCustomNumber(e.target.value))
                        }
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
                                dispatch(setCareData([...tempData]))
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
                                dispatch(setCareData([...tempCare]))
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
                          dispatch(setCareData([...tempCare]))
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
                              dispatch(
                                setWashCareData({
                                  ...props.washCareData,
                                  ...tempData
                                })
                              )
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
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
          validationFields={{
            orderFormManFields: {
              orderReference: props.orderReference,
              minExpectedDeliveryDate: props.expectedDeliveryDate,
              projectionLocation: props.projectionLocation
            }
          }}
        />
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  brand: state.orderReducer.brand,
  selectedItems: state.orderReducer.selectedItems,
  expectedDeliveryDate: state.orderReducer.expectedDeliveryDate,
  minExpectedDeliveryDate: state.orderReducer.minExpectedDeliveryDate,
  projectionLocation: state.orderReducer.projectionLocation,
  orderReference: state.orderReducer.orderReference,
  careData: state.orderReducer.careData,
  fibreInstructionData: state.orderReducer.fibreInstructionData,
  washCareData: state.orderReducer.washCareData,
  contentNumberData: state.orderReducer.contentNumberData,
  defaultContentData: state.orderReducer.defaultContentData,
  careNumberData: state.orderReducer.careNumberData,
  contentCustomNumber: state.orderReducer.contentCustomNumber,
  careCustomNumber: state.orderReducer.careCustomNumber,
  dynamicFieldData: state.orderReducer.dynamicFieldData,
  contentGroup: state.orderReducer.contentGroup
})

export default connect(mapStateToProps, null)(OrderForm)
