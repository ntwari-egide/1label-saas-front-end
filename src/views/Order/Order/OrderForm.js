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
  setProductionLocation,
  setOrderReference,
  setCoo,
  setContentNumberData,
  setDefaultContentData,
  setFibreInstructionData,
  setCareData,
  setWashCareData,
  setCareNumberData,
  setContentCustomNumber,
  setCareCustomNumber,
  setDynamicFieldData,
  setContentGroup,
  setBrandDetails
} from "@redux/actions/views/Order/Order"
import { matchContentNumber } from "@redux/actions/views/common"
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
  const [productionLocationOptions, setProductionLocationOptions] = useState([])
  const [contentGroupOptions, setContentGroupOptions] = useState({})
  const [washCareOptions, setWashCareOptions] = useState({})
  // content setting data
  const [contentName, setContentName] = useState("")
  const [careName, setCareName] = useState("")
  const [iconName, setIconName] = useState("")

  // debounce function to fetch /ContentNumber/MatchContentNumber on percent input change event
  const debounceFun = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      // matchContentNumber()
      timerId = null
    }, 400)
  }

  // other functions

  const processDefaultContent = (data) => {
    // get unique values
    const processed = [...new Set(data.map((d) => d?.cont_translation))]
    // delete empty entries
    processed.map((data, index) => {
      if (!data?.length) {
        processed.splice(index, 1)
      }
    })
    // push at least one to render in case of empty
    if (!processed?.length) {
      processed.push("")
    }
    return processed
  }

  // API services
  const fetchBrandDetails = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : ""
    }
    axios
      .post("/brand/GetBrandDetail", body)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setBrandDetails(res.data))
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchDefaultContentData = (contKey, index, tempData) => {
    // fetches default Content Data as per option selected in fabric select field.
    const body = {
      brand_key: props.brand.value || "",
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
          dispatch(setDefaultContentData([...tempData]))
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchContentNumberDetail = (content_number_key, style_number) => {
    // fetches props.fibreInstructionData and props.careData for a selected content and care select fields respectively.
    const body = {
      order_user: "innoa",
      content_number_key,
      brand_key: props.brand.value || "",
      style_number
    }
    axios.post("/ContentNumber/GetContentNumberDetail", body).then((res) => {
      if (res.status === 200) {
        if (res.data.content) {
          dispatch(
            setFibreInstructionData(
              res.data.content.map((data, index) => ({ ...data, id: index }))
            )
          )
          const tempDefaultContentData = []
          res?.data?.content?.map((cont, index) => {
            // fetches default content data for fabric
            fetchDefaultContentData(
              cont.cont_key,
              index,
              tempDefaultContentData
            )
          })
        }
        if (res.data.care) {
          dispatch(setCareData(res.data.care))
        }
        if (res.data.icon) {
          const tempData = {}
          res?.data?.icon.map((icon) => {
            tempData[icon.icon_type_id] = {
              icon_group: icon.icon_group,
              icon_type_id: icon.icon_type_id,
              sys_icon_key: icon.sys_icon_key
            }
          })
          // props.setWashCareData({ ...tempData })
          dispatch(setWashCareData({ ...tempData }))
        }
      }
    })
  }

  const handleFibreChange = (e, index) => {
    // updating the fibreInstructionData state.
    const tempData = [...props.fibreInstructionData]
    tempData[index] = {
      ...props.fibreInstructionData[index],
      cont_key: e ? e.value : "",
      cont_translation: e ? e.label : ""
    }
    dispatch(setFibreInstructionData([...tempData]))
    // fetching default content for fabric and updating default content state
    const body = {
      brand_key: props.brand?.value || "",
      cont_key: e ? e.value : "",
      page_type: "content"
    }
    axios
      .post("/Translation/GetDefaultContentByContentKey", body)
      .then((res) => {
        let tempDefData = [...props.defaultContentData]
        if (res.status === 200) {
          tempDefData[index] = {
            cont_key: res.data[0]?.guid_key,
            cont_translation: res.data[0]?.gb_translation
          }
          dispatch(setDefaultContentData([...tempDefData]))
          dispatch(matchContentNumber("Order"))
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchMinExpectedDeliveryDate = () => {
    // min delivery date for Expected Delivery Date field
    const body = {
      brand_key: props.brand.value || "",
      erp_id: 8,
      item_key: props.selectedItems.map((item) => item.guid_key) || ""
    }

    axios.post("/Order/GetMinExpectedDeliveryDate", body).then((res) => {
      dispatch({
        type: "SET_MIN_EXPECTED_DELIVERY_DATE",
        payload: res.data.min_delivery_date
      })
    })
  }

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
          fetchContentNumberList(res.data[0]?.content_model.split("/")) // passes content_group as an array
        }
        // fetch select fields and respective data for wash care symbol section
        if (res.data[0]?.display_footwear_icon?.length) {
          fetchIconSequenceList(res.data[0]?.display_footwear_icon)
        } else {
          console.log("Err Msg:", "Footwear display status not received")
        }
        // assign section titles
        if (res.data[0]?.acontent_title) {
          setContentName(res.data[0]?.acontent_title)
        } else {
          console.log("Err Msg:", "acontent_title not received")
        }
        if (res.data[0]?.bcontent_title) {
          setCareName(res.data[0]?.bcontent_title)
        } else {
          console.log("Err Msg:", "bcontent_title not received")
        }
        if (res.data[0]?.ccontent_title) {
          setIconName(res.data[0]?.ccontent_title)
        } else {
          console.log("Err Msg:", "ccontent_title not received")
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

  const fetchIconSequenceList = (showFootwear) => {
    // fetched icon sequence list
    const iconGroups = ["A", "B"]
    let tempIconSeq = []
    let tempIconTranslation = {}
    iconGroups.map((iconGroup) => {
      // do not fetch for footwear if not required
      if (showFootwear === "N" && iconGroup === "B") {
        return
      }
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
                icon: <img src={opt.icon_file} style={{ maxHeight: "30px" }} />,
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
          setProductionLocationOptions(
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
                    field_value: e.target.value,
                    field_label: e.target.value
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
    fetchItemInfoData()
    fetchItemInfoFields()
    fetchContentTranslationList()
    fetchProductLocationList()
    fetchMinExpectedDeliveryDate()
    fetchBrandDetails()
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
          {props.brandDetails?.is_show_expected_date === "Y" ? (
            <div>
              <Label>{t("Expected Delivery Date")}</Label>
              <span className="text-danger">*</span>
              <Flatpickr
                className="form-control"
                value={
                  props.expectedDeliveryDate ? props.expectedDeliveryDate : ""
                }
                style={{ margin: "5px" }}
                options={{
                  minDate: props.minExpectedDeliveryDate
                }}
                onChange={(e) => {
                  dispatch(setExpectedDeliveryDate(e))
                }}
                disabled={false}
              />
            </div>
          ) : (
            <></>
          )}
        </Col>
        <Col xs="12" sm="12" md="6" lg="4" xl="4">
          {props.brandDetails?.display_location_code === "Y" ? (
            <div>
              <Label>{t("Projection Location")}</Label>
              <span className="text-danger">*</span>
              <div style={{ margin: "5px" }}>
                <Select
                  className="React"
                  classNamePrefix="select"
                  options={productionLocationOptions}
                  value={productionLocationOptions?.filter(
                    (opt) => opt.label === props.productionLocation
                  )}
                  onChange={(e) => {
                    dispatch(setProductionLocation(e.label))
                  }}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </Col>
      </CardHeader>
      <CardBody>
        <Row style={{ margin: "0" }}>
          <Col>
            {itemInfoFields.length > 0 ? (
              <div>
                {props.brandDetails.display_dynamic_field === "Y" ? (
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
                          <></>
                        )}
                      </CardBody>
                    </Collapse>
                  </Card>
                ) : (
                  <></>
                )}
              </div>
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
          </Col>
        </Row>
        <Row style={{ margin: "0" }}>
          <Col>
            {props.brandDetails?.display_Content === "Y" ? (
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
                        <Label style={{ marginTop: "12px" }}>
                          {contentName}
                        </Label>
                      </Col>
                      <Col xs="12" sm="12" md="9" lg="9" xl="9">
                        <Select
                          className="React"
                          classNamePrefix="select"
                          value={
                            props.contentGroup === "ABC"
                              ? contentGroupOptions["ABC"]?.filter(
                                  (opt) =>
                                    opt.label === props.contentNumberData?.label
                                )
                              : props.contentGroup === "A/BC"
                              ? contentGroupOptions["A"]?.filter(
                                  (opt) =>
                                    opt.label === props.contentNumberData?.label
                                )
                              : contentGroupOptions["AB"]?.filter(
                                  opt.label === props.contentNumberData?.label
                                )
                          }
                          options={
                            props.contentGroup === "ABC"
                              ? contentGroupOptions["ABC"]
                              : props.contentGroup === "A/BC"
                              ? contentGroupOptions["A"]
                              : contentGroupOptions["AB"]
                          }
                          onChange={(e) => {
                            dispatch(setContentNumberData(e ? e : {}))
                            if (e) {
                              fetchContentNumberDetail(e.value, e.label)
                            } else {
                              // to handle isClearable event
                              if (props.contentGroup === "A/BC") {
                                dispatch(setFibreInstructionData([{}]))
                              } else if (props.contentGroup === "AB/C") {
                                dispatch(setFibreInstructionData([{}]))
                                dispatch(setCareData([{}]))
                              } else {
                                dispatch(setFibreInstructionData([{}]))
                                dispatch(setWashCareData([{}]))
                                dispatch(setCareData([{}]))
                              }
                            }
                          }}
                          isClearable={true}
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
                                    value={componentOptions?.filter(
                                      (opt) => opt.value === rec?.part_key
                                    )}
                                    onChange={(e) => {
                                      const tempData =
                                        props.fibreInstructionData
                                      // ternary to handle isClearable event
                                      tempData[index] = {
                                        ...props.fibreInstructionData[index],
                                        part_key: e ? e.value : "",
                                        part_translation: e ? e.label : ""
                                      }
                                      dispatch(
                                        setFibreInstructionData([...tempData])
                                      )
                                      dispatch(matchContentNumber("Order"))
                                    }}
                                    isClearable={true}
                                  />
                                </Col>
                                <Col xs="12" sm="12" md="3" lg="3" xl="3">
                                  <Label>Fabric</Label>
                                  <Select
                                    className="React"
                                    classNamePrefix="select"
                                    options={fabricOptions}
                                    value={fabricOptions?.filter(
                                      (opt) => opt.value === rec?.cont_key
                                    )}
                                    onChange={(e) => {
                                      handleFibreChange(e, index)
                                    }}
                                    isClearable={true}
                                  />
                                </Col>
                                <Col xs="12" sm="12" md="2" lg="2" xl="2">
                                  <Label>%</Label>
                                  <Input
                                    value={
                                      props.fibreInstructionData[index]
                                        ?.en_percent
                                        ? props.fibreInstructionData[index]
                                            ?.en_percent
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const tempData =
                                        props.fibreInstructionData
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
                              setFibreInstructionData([
                                ...tempFibreInstructions
                              ])
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
                    {processDefaultContent(props.defaultContentData).map(
                      (item) => (
                        <Row style={{ marginBottom: "10px" }}>
                          <Col xs="12" sm="12" md="9" lg="9" xl="9">
                            <Input value={item ? item : ""} disabled={true} />
                          </Col>
                        </Row>
                      )
                    )}
                    <Row style={{ marginBottom: "10px" }}>
                      <Col xs="12" sm="12" md="1" lg="1" xl="1">
                        <Label style={{ marginTop: "12px" }}>{careName}</Label>
                      </Col>
                      <Col xs="12" sm="12" md="9" lg="9" xl="9">
                        <Select
                          className="React"
                          classNamePrefix="select"
                          value={
                            props.contentGroup === "ABC"
                              ? contentGroupOptions["ABC"]?.filter(
                                  (opt) =>
                                    opt.value === props.careNumberData?.value
                                )
                              : props.contentGroup === "A/BC"
                              ? contentGroupOptions["BC"]?.filter(
                                  (opt) =>
                                    opt.value === props.careNumberData?.value
                                )
                              : contentGroupOptions["C"]?.filter(
                                  (opt) =>
                                    opt.value === props.careNumberData?.value
                                )
                          }
                          options={
                            props.contentGroup === "ABC"
                              ? contentGroupOptions["ABC"]
                              : props.contentGroup === "A/BC"
                              ? contentGroupOptions["BC"]
                              : contentGroupOptions["C"]
                          }
                          onChange={(e) => {
                            dispatch(setCareNumberData(e ? e : {}))
                            if (e) {
                              fetchContentNumberDetail(e.value, e.label)
                            } else {
                              if (props.contentGroup === "A/BC") {
                                dispatch(setWashCareData([{}]))
                                dispatch(setCareData([{}]))
                              } else if (props.contentGroup === "AB/C") {
                                dispatch(setWashCareData([{}]))
                              } else {
                                dispatch(setFibreInstructionData([{}]))
                                dispatch(setWashCareData([{}]))
                                dispatch(setCareData([{}]))
                              }
                            }
                          }}
                          isClearable={true}
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
                            <Label>
                              Additional Care & Mandatory Statements{" "}
                            </Label>
                          </Col>
                        </Row>
                        {props.careData.map((rec, index) => (
                          <Row style={{ marginBottom: "7px" }}>
                            <Col xs="12" sm="12" md="8" lg="8" xl="8">
                              <Select
                                className="React"
                                classNamePrefix="select"
                                options={additionalCareOptions}
                                value={additionalCareOptions?.filter(
                                  (opt) => opt.value === rec.cont_key
                                )}
                                onChange={(e) => {
                                  const tempData = props.careData
                                  props.careData[index] = {
                                    ...props.careData[index],
                                    cont_key: e ? e.value : ""
                                  }
                                  dispatch(setCareData([...tempData]))
                                  dispatch(matchContentNumber("Order"))
                                }}
                                isClearable={true}
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
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row style={{ margin: "0" }}>
          <Col>
            {props.brandDetails.display_Content === "Y" ? (
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
                                  ? washCareOptions[
                                      iconObj?.icon_type_id
                                    ]?.filter(
                                      (opt) =>
                                        opt.value ===
                                        props.washCareData[
                                          iconObj?.icon_type_id
                                        ]?.sys_icon_key
                                    )
                                  : ""
                              }
                              onChange={(e) => {
                                const tempData = {}
                                tempData[iconObj.icon_type_id] = {
                                  sys_icon_key: e ? e.value : "",
                                  icon_type_id: e ? e.iconTypeId : "",
                                  icon_group: e ? e.iconGroup : ""
                                }
                                dispatch(
                                  setWashCareData({
                                    ...props.washCareData,
                                    ...tempData
                                  })
                                )
                                dispatch(matchContentNumber("Order"))
                              }}
                              getOptionLabel={(e) => (
                                <div>
                                  {e.icon}
                                  {e.label}
                                </div>
                              )}
                              filterOption={(options, query) =>
                                options.data.label.includes(query)
                              }
                              isClearable={true}
                            />
                          </Col>
                        </Row>
                      )
                    })}
                  </CardBody>
                </Collapse>
              </Card>
            ) : (
              <></>
            )}
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
              productionLocation: props.productionLocation
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
  productionLocation: state.orderReducer.productionLocation,
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
  contentGroup: state.orderReducer.contentGroup,
  brandDetails: state.orderReducer.brandDetails
})

export default connect(mapStateToProps, null)(OrderForm)
