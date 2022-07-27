import { useState, useEffect } from "react"
import axios from "@axios"
import Select from "react-select"
import ContentSection from "./ContentSection"
import CareSection from "./CareSection"
import WashCareSection from "./WashCareSection"
import {
  Card,
  Label,
  Collapse,
  CardHeader,
  Spinner,
  CardBody,
  CardFooter,
  FormGroup,
  FormFeedback,
  Row,
  Col,
  Input
} from "reactstrap"
import Footer from "../../../CommonFooter"
import Flatpickr from "react-flatpickr"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import {
  setExpectedDeliveryDate,
  setProductionLocation,
  setOrderReference,
  setCoo,
  setDefaultContentData,
  setFibreInstructionData,
  setCareData,
  setWashCareData,
  setDynamicFieldData,
  setContentGroup,
  setBrandDetails,
  setItemInfoFields,
  setBrandSettings
} from "@redux/actions/views/Order/Order"
import { matchContentNumber } from "@redux/actions/views/common"
import { getUserData } from "@utils"
import CustomFormFeedback from "@components/CustomFormFeedback"
import "@styles/react/libs/flatpickr/flatpickr.scss"

const errorStyles = {
  border: "1px solid red",
  boxShadow: 0
}

const OrderForm = (props) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  // states for Collapse component
  const [itemInfoCollapse, setItemInfoCollapse] = useState(true)
  const [careContentCollapse, setCareContentCollapse] = useState(true)
  const [washCareCollapse, setWashCareCollapse] = useState(true)
  // Data
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
  // tooltip states and messages
  const [tooltipMsg, setTooltipMsg] = useState({})
  const [tooltipStatus, setTooltipStatus] = useState({})

  const handleMatchContentNumber = (section) => {
    let content_group
    if (props.contentGroup === "ABC") {
      content_group = "ABC"
    } else {
      if (props.contentGroup.length) {
        if (props.contentGroup === "AB/C") {
          if (section === "washCare") {
            content_group = "C"
          } else {
            content_group = "AB"
          }
        } else if (props.contentGroup === "A/BC") {
          if (section === "content") {
            content_group = "A"
          } else {
            content_group = "BC"
          }
        }
      }
    }
    if (content_group) {
      dispatch(matchContentNumber("Order", content_group, section))
    }
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
              icon_key: icon.icon_key
            }
          })
          // props.setWashCareData({ ...tempData })
          dispatch(setWashCareData({ ...tempData }))
        }
      }
    })
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
          dispatch(setItemInfoFields(res.data))
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
          // tooltip
          const tempTooltipStatus = {}
          const tempTooltipMsg = {}
          if (res.data[0]?.part_msg?.length) {
            tempTooltipStatus.part = true
            tempTooltipMsg.part = res.data[0]?.part_msg?.split("\r\n")
          }
          if (res.data[0]?.content_msg?.length) {
            tempTooltipStatus.content = true
            tempTooltipMsg.content = res.data[0]?.content_msg?.split("\r\n")
          }
          if (res.data[0]?.care_msg?.length) {
            tempTooltipStatus.care = true
            tempTooltipMsg.care = res.data[0]?.care_msg?.split("\r\n")
          }
          if (res.data[0]?.icon_msg?.length) {
            tempTooltipStatus.icon = true
            tempTooltipMsg.icon = res.data[0]?.icon_msg?.split("\r\n")
          }
          if (res.data[0]?.percentage_msg?.length) {
            tempTooltipStatus.percentage = true
            tempTooltipMsg.percentage =
              res.data[0]?.percentage_msg?.split("\r\n")
          }
          setTooltipStatus({ ...tempTooltipStatus })
          setTooltipMsg({ ...tempTooltipMsg })
          if (res.data[0]) {
            dispatch(setBrandSettings(res.data[0]))
          }
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchContentNumberList = (contentGroup) => {
    // fetches options for content and care select fields.
    const tempData = {}
    contentGroup?.map((content_group) => {
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
              label: opt.custom_number
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
          <Row style={{ margin: "5px", marginBottom: "10px" }}>
            <Col xs="6" sm="6" md="6" lg="6" xl="6">
              <Row>
                <Col
                  xs="12"
                  sm="12"
                  md="12"
                  lg="12"
                  xl="12"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Label>{field?.title}</Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Select
                    options={itemInfoOptions[field.title]}
                    className="React"
                    classNamePrefix="select"
                    value={itemInfoOptions[field.title]?.filter(
                      (opt) =>
                        opt.label ===
                        props.dynamicFieldData[field?.title]?.field_label
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
                    isDisabled={props.isOrderConfirmed}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        )
      case "input":
        return (
          <Row style={{ margin: "5px", marginBottom: "10px" }}>
            <Col xs="6" sm="6" md="6" lg="6" xl="6">
              <Row>
                <Col
                  xs="12"
                  sm="12"
                  md="12"
                  lg="12"
                  xl="12"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Label>{field?.title}</Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Input
                    value={props.dynamicFieldData[field.title]?.field_label}
                    onChange={(e) => {
                      const tempState = props.dynamicFieldData
                      tempState[field.title] = {
                        ...tempState[field.title],
                        field_value: e.target.value,
                        field_label: e.target.value
                      }
                      dispatch(setDynamicFieldData({ ...tempState }))
                    }}
                    disabled={props.isOrderConfirmed}
                  />
                </Col>
              </Row>
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
        if (props.isOrderNew) {
          tempItemInfoState[field.title] = {
            field_id: field.field,
            field_value: "",
            field_label: ""
          }
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

  useEffect(() => {
    fetchBrandDetails()
    fetchContentNumberSettings()
    if (props.isOrderNew) {
      fetchItemInfoFields()
    } else {
      if (props.itemInfoFields.length) {
        assignStateToItemInfo(props.itemInfoFields)
      }
    }
    fetchContentTranslationList()
    fetchProductLocationList()
    fetchMinExpectedDeliveryDate()
  }, [])

  return (
    <div>
      <Card>
        <CardHeader>
          {!props.isOrderNew ? (
            <Row style={{ width: "100%", paddingBottom: "5px" }}>
              <Col xs="12" sm="12" md="6" lg="4" xl="4">
                <Label>{t("Order No.")}</Label>
                <h5>{props.selectedOrder?.order_no}</h5>
              </Col>
            </Row>
          ) : null}
          <Row style={{ width: "100%" }}>
            <Col xs="12" sm="12" md="6" lg="4" xl="4">
              <Label>{t("Customer Order Reference")}</Label>
              <span className="text-danger">*</span>
              <FormGroup>
                <Input
                  value={props.orderReference}
                  onChange={(e) => {
                    dispatch(setOrderReference(e.target.value))
                  }}
                  style={{ marginTop: "5px" }}
                  disabled={props.isOrderConfirmed}
                  invalid={
                    props.orderFormValidations.customer_order_reference?.status
                  }
                />
                {props.orderFormValidations.customer_order_reference?.status ? (
                  <FormFeedback>
                    {props.orderFormValidations.customer_order_reference?.msg}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="4">
              <div>
                <Label>{t("Expected Delivery Date")}</Label>
                <span className="text-danger">*</span>
                <FormGroup
                  invalid={
                    props.orderFormValidations.expected_delivery_date?.status
                  }
                >
                  <Flatpickr
                    className="form-control"
                    value={
                      props.expectedDeliveryDate
                        ? props.expectedDeliveryDate
                        : ""
                    }
                    style={{
                      marginTop: "5px",
                      border: props.orderFormValidations.expected_delivery_date
                        ?.status
                        ? "1px solid #ea5455"
                        : "1px solid #d8d6de"
                    }}
                    options={{
                      minDate: props.minExpectedDeliveryDate
                    }}
                    onChange={(e) => {
                      dispatch(setExpectedDeliveryDate(e))
                    }}
                    disabled={props.isOrderConfirmed}
                  />
                  {props.orderFormValidations.expected_delivery_date?.status ? (
                    <CustomFormFeedback
                      errMsg={
                        props.orderFormValidations.expected_delivery_date?.msg
                      }
                    />
                  ) : null}
                </FormGroup>
              </div>
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="4">
              {props.brandDetails?.display_location_code === "Y" ? (
                <div>
                  <Label>{t("Production Location")}</Label>
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
                      isDisabled={props.isOrderConfirmed}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              {props.brandDetails.display_dynamic_field === "Y" ? (
                <div>
                  {props.itemInfoFields.length ? (
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
                        <CardBody style={{ paddingTop: 0 }}>
                          {props.itemInfoFields?.map((field) => {
                            return renderSwitch(field)
                          })}
                        </CardBody>
                      </Collapse>
                    </Card>
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
                </div>
              ) : (
                <></>
              )}
            </Col>
          </Row>
          <Card>
            <CardHeader
              style={{ cursor: "pointer" }}
              onClick={() => setCareContentCollapse(!careContentCollapse)}
            >
              <h4 className="text-primary">{t("Content")}</h4>
            </CardHeader>
            <Collapse isOpen={careContentCollapse}>
              <CardBody style={{ paddingTop: 0 }}>
                {props.contentGroup === "A/BC" ? (
                  <ContentSection
                    brand={props.brand}
                    contentName={contentName}
                    contentGroupOptions={contentGroupOptions}
                    componentOptions={componentOptions}
                    fabricOptions={fabricOptions}
                    fetchContentNumberDetail={fetchContentNumberDetail}
                    contentGroup={props.contentGroup}
                    fibreInstructionData={props.fibreInstructionData}
                    contentNumberData={props.contentNumberData}
                    contentCustomNumber={props.contentCustomNumber}
                    defaultContentData={props.defaultContentData}
                    handleMatchContentNumber={handleMatchContentNumber}
                    isOrderConfirmed={props.isOrderConfirmed}
                    brandSettings={props.brandSettings}
                    tooltipStatus={tooltipStatus}
                    tooltipMsg={tooltipMsg}
                    orderFormValidations={props.orderFormValidations}
                  />
                ) : props.contentGroup === "AB/C" ? (
                  <div>
                    <ContentSection
                      brand={props.brand}
                      contentName={contentName}
                      contentGroupOptions={contentGroupOptions}
                      componentOptions={componentOptions}
                      fabricOptions={fabricOptions}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      contentGroup={props.contentGroup}
                      fibreInstructionData={props.fibreInstructionData}
                      contentNumberData={props.contentNumberData}
                      contentCustomNumber={props.contentCustomNumber}
                      defaultContentData={props.defaultContentData}
                      handleMatchContentNumber={handleMatchContentNumber}
                      isOrderConfirmed={props.isOrderConfirmed}
                      brandSettings={props.brandSettings}
                      tooltipStatus={tooltipStatus}
                      tooltipMsg={tooltipMsg}
                      orderFormValidations={props.orderFormValidations}
                    />
                    <CareSection
                      careName={careName}
                      contentGroupOptions={contentGroupOptions}
                      additionalCareOptions={additionalCareOptions}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      contentGroup={props.contentGroup}
                      brand={props.brand}
                      careData={props.careData}
                      careCustomNumber={props.careCustomNumber}
                      careNumberData={props.careNumberData}
                      handleMatchContentNumber={handleMatchContentNumber}
                      isOrderConfirmed={props.isOrderConfirmed}
                      brandSettings={props.brandSettings}
                      tooltipStatus={tooltipStatus}
                      tooltipMsg={tooltipMsg}
                      orderFormValidations={props.orderFormValidations}
                    />
                  </div>
                ) : props.contentGroup === "ABC" ? (
                  <div>
                    <ContentSection
                      brand={props.brand}
                      contentName={contentName}
                      contentGroupOptions={contentGroupOptions}
                      componentOptions={componentOptions}
                      fabricOptions={fabricOptions}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      contentGroup={props.contentGroup}
                      fibreInstructionData={props.fibreInstructionData}
                      contentNumberData={props.contentNumberData}
                      contentCustomNumber={props.contentCustomNumber}
                      defaultContentData={props.defaultContentData}
                      handleMatchContentNumber={handleMatchContentNumber}
                      isOrderConfirmed={props.isOrderConfirmed}
                      brandSettings={props.brandSettings}
                      tooltipStatus={tooltipStatus}
                      tooltipMsg={tooltipMsg}
                      orderFormValidations={props.orderFormValidations}
                    />
                    <CareSection
                      careName={careName}
                      contentGroupOptions={contentGroupOptions}
                      additionalCareOptions={additionalCareOptions}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      contentGroup={props.contentGroup}
                      brand={props.brand}
                      careData={props.careData}
                      careCustomNumber={props.careCustomNumber}
                      careNumberData={props.careNumberData}
                      handleMatchContentNumber={handleMatchContentNumber}
                      isOrderConfirmed={props.isOrderConfirmed}
                      brandSettings={props.brandSettings}
                      tooltipStatus={tooltipStatus}
                      tooltipMsg={tooltipMsg}
                      orderFormValidations={props.orderFormValidations}
                    />
                    <WashCareSection
                      iconSequence={iconSequence}
                      washCareOptions={washCareOptions}
                      iconName={iconName}
                      contentGroupOptions={contentGroupOptions}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      handleMatchContentNumber={handleMatchContentNumber}
                      careNumberData={props.careNumberData}
                      contentGroup={props.contentGroup}
                      washCareData={props.washCareData}
                      isOrderConfirmed={props.isOrderConfirmed}
                      brandSettings={props.brandSettings}
                      tooltipStatus={tooltipStatus}
                      tooltipMsg={tooltipMsg}
                      orderFormValidations={props.orderFormValidations}
                    />
                  </div>
                ) : null}
              </CardBody>
            </Collapse>
          </Card>
          {props.contentGroup != "ABC" ? (
            <Card>
              <CardHeader
                onClick={() => setWashCareCollapse(!washCareCollapse)}
                style={{ cursor: "pointer" }}
              >
                <h4>{props.contentGroup === "A/BC" ? "Care" : "Wash Care"}</h4>
              </CardHeader>
              <Collapse isOpen={washCareCollapse}>
                <CardBody style={{ paddingTop: 0 }}>
                  {props.contentGroup === "A/BC" ? (
                    <div>
                      <CareSection
                        careName={careName}
                        contentGroupOptions={contentGroupOptions}
                        additionalCareOptions={additionalCareOptions}
                        fetchContentNumberDetail={fetchContentNumberDetail}
                        handleMatchContentNumber={handleMatchContentNumber}
                        contentGroup={props.contentGroup}
                        brand={props.brand}
                        careData={props.careData}
                        careCustomNumber={props.careCustomNumber}
                        careNumberData={props.careNumberData}
                        isOrderConfirmed={props.isOrderConfirmed}
                        brandSettings={props.brandSettings}
                        tooltipStatus={tooltipStatus}
                        tooltipMsg={tooltipMsg}
                        orderFormValidations={props.orderFormValidations}
                      />
                      <WashCareSection
                        iconSequence={iconSequence}
                        washCareOptions={washCareOptions}
                        iconName={iconName}
                        fetchContentNumberDetail={fetchContentNumberDetail}
                        handleMatchContentNumber={handleMatchContentNumber}
                        contentGroupOptions={contentGroupOptions}
                        careNumberData={props.careNumberData}
                        contentGroup={props.contentGroup}
                        washCareData={props.washCareData}
                        isOrderConfirmed={props.isOrderConfirmed}
                        brandSettings={props.brandSettings}
                        tooltipStatus={tooltipStatus}
                        tooltipMsg={tooltipMsg}
                        orderFormValidations={props.orderFormValidations}
                      />
                    </div>
                  ) : props.contentGroup === "AB/C" ? (
                    <div>
                      <WashCareSection
                        iconSequence={iconSequence}
                        washCareOptions={washCareOptions}
                        iconName={iconName}
                        handleMatchContentNumber={handleMatchContentNumber}
                        contentGroupOptions={contentGroupOptions}
                        fetchContentNumberDetail={fetchContentNumberDetail}
                        careNumberData={props.careNumberData}
                        contentGroup={props.contentGroup}
                        washCareData={props.washCareData}
                        isOrderConfirmed={props.isOrderConfirmed}
                        brandSettings={props.brandSettings}
                        tooltipStatus={tooltipStatus}
                        tooltipMsg={tooltipMsg}
                        orderFormValidations={props.orderFormValidations}
                      />
                    </div>
                  ) : null}
                </CardBody>
              </Collapse>
            </Card>
          ) : null}
        </CardBody>
        <CardFooter>
          <Footer
            currentStep={props.currentStep}
            setCurrentStep={props.setCurrentStep}
            lastStep={props.lastStep}
            validationFields={{
              orderFormManFields: {
                orderReference: props.orderReference,
                expectedDeliveryDate: props.expectedDeliveryDate,
                productionLocation: props.productionLocation
              }
            }}
            brandDetails={props.brandDetails}
            isOrderConfirmed={props.isOrderConfirmed}
          />
        </CardFooter>
      </Card>
    </div>
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
  brandDetails: state.orderReducer.brandDetails,
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  itemInfoFields: state.orderReducer.itemInfoFields,
  isOrderNew: state.listReducer.isOrderNew,
  selectedOrder: state.listReducer.selectedOrder,
  brandSettings: state.orderReducer.brandSettings,
  orderFormValidations: state.orderReducer.orderFormValidations
})

export default connect(mapStateToProps, null)(OrderForm)
