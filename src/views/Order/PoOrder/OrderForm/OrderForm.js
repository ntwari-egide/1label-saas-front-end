import { useState, useEffect } from "react"
import ContentSection from "./ContentSection"
import CareSection from "./CareSection"
import WashCareSection from "./WashCareSection"
import {
  Card,
  Col,
  Spinner,
  Input,
  Row,
  CardBody,
  Label,
  Collapse,
  CardHeader,
  CardFooter
} from "reactstrap"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import Footer from "../../../CommonFooter"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { connect, useDispatch } from "react-redux"
import {
  setCareData,
  setWashCareData,
  setDynamicFieldData,
  setFibreInstructionData,
  setProductionLocation,
  setOrderReference,
  setExpectedDeliveryDate,
  setDefaultContentData,
  setContentGroup,
  setCoo,
  setBrandDetails,
  setItemInfoFields,
  setBrandSettings
} from "@redux/actions/views/Order/POOrder"
import { matchContentNumber } from "@redux/actions/views/common"
import { getUserData } from "@utils"

const errorStyles = {
  border: "1px solid red",
  boxShadow: 0
}

const OrderForm = (props) => {
  // constants
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // states for Collapse component
  const [itemInfoCollapse, setItemInfoCollapse] = useState(true)
  const [careContentCollapse, setCareContentCollapse] = useState(true)
  const [washCareCollapse, setWashCareCollapse] = useState(true)
  // Data
  const [itemInfoOptions, setItemInfoOptions] = useState([])
  const [contentGroupOptions, setContentGroupOptions] = useState({})
  const [iconSequence, setIconSequence] = useState([])
  const [washCareOptions, setWashCareOptions] = useState({})
  const [fabricOptions, setFabricOptions] = useState([])
  const [componentOptions, setComponentOptions] = useState([])
  const [additionalCareOptions, setAdditionalCareOptions] = useState([])
  const [productionLocationOptions, setProductionLocationOptions] = useState([])
  // content setting data
  const [contentName, setContentName] = useState("")
  const [careName, setCareName] = useState("")
  const [iconName, setIconName] = useState("")

  // states for custom tooltip
  const [componentTip, setComponentTip] = useState({})
  const [fabricTip, setFabricTip] = useState({})
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
      dispatch(matchContentNumber("POOrder", content_group, section))
    }
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
                    className="React"
                    classNamePrefix="select"
                    options={itemInfoOptions[field?.title]}
                    value={itemInfoOptions[field?.title]?.filter(
                      (opt) =>
                        opt.value ===
                        props.dynamicFieldData[field?.title]?.field_value
                    )}
                    onChange={(e) => {
                      // set coo to use later in invoice and delivery component
                      if (field.field === "F3") {
                        dispatch(setCoo(e.label))
                      }
                      let tempData = props.dynamicFieldData
                      tempData[field?.title] = {
                        ...tempData[field?.title],
                        field_value: e.value,
                        field_label: e.label
                      }
                      dispatch(setDynamicFieldData({ ...tempData }))
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
                    disable={props.isOrderConfirmed}
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
    if (fields.length) {
      fields.map((field) => {
        // assigns initial state to dynamic fields data.
        tempItemInfoState[field.title] = {
          field_id: field.field,
          field_value: field.label,
          field_label: field.label
        }
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

  const handleFibreChange = (e, index) => {
    // updating the fibreInstructionData state.
    const tempData = props.fibreInstructionData
    tempData[index] = {
      ...props.fibreInstructionData[index],
      cont_key: e ? e.value : "",
      cont_translation: e ? e.label : ""
    }
    dispatch(setFibreInstructionData([...tempData]))
    // fetching default content for fabric and updating default content state
    let tempDefData = props.defaultContentData
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      cont_key: e ? e.value : "",
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
          dispatch(setDefaultContentData([...tempDefData]))
          dispatch(matchContentNumber("POOrder"))
        }
      })
      .catch((err) => console.log(err))
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

  const fetchItemInfoFields = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      show_status: "Y",
      order_user: getUserData().admin,
      order_no: props.combinedPOOrderKey || "",
      is_po_order_temp: props.isPoOrderTemp || ""
    }

    axios
      .post("/brand/GetDynamicFieldList", body)
      .then((res) => {
        if (res.status === 200) {
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
          fetchContentNumberList(res.data[0]?.content_model?.split("/")) // passes content_group as an array
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
        brand_key: props.brand ? props.brand.value : "",
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

  const fetchContentNumberDetail = (content_number_key, style_number) => {
    // fetches props.fibreInstructionData and props.careData for a selected content and care select fields respectively.
    const body = {
      order_user: getUserData().admin,
      content_number_key,
      brand_key: props.brand ? props.brand.value : "",
      style_number
    }
    axios.post("/ContentNumber/GetContentNumberDetail", body).then((res) => {
      if (res.status === 200) {
        if (res.data?.content) {
          dispatch(setFibreInstructionData(res?.data?.content))
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
        if (res.data?.care) {
          dispatch(setCareData(res?.data?.care))
        }
        if (res.data?.icon) {
          const tempData = {}
          res?.data?.icon.map((icon) => {
            tempData[icon.icon_type_id] = {
              icon_group: icon.icon_group,
              icon_type_id: icon.icon_type_id,
              icon_key: icon.icon_key
            }
          })
          dispatch(setWashCareData({ ...tempData }))
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
          if (
            tempData
              .map((data) => data.cont_key)
              .includes(res.data[0]?.guid_key)
          ) {
            return
          }
          tempData.push({
            cont_key: res.data[0]?.guid_key,
            cont_translation: res.data[0]?.gb_translation
          })
          dispatch(setDefaultContentData([...tempData]))
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchIconSequenceList = (showFootwear) => {
    // fetched icon sequence list
    const iconGroups = ["A", "B"]
    let tempIconSeq = []
    let tempIconTranslation = {}
    iconGroups.map((iconGroup) => {
      // do not fetch for footwear if not required
      console.log(showFootwear, iconGroup)
      if (showFootwear === "N" && iconGroup === "B") {
        console.log("ret")
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
      order_user: getUserData().admin,
      order_no: props.combinedPOOrderKey || ""
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

  useEffect(() => {
    fetchBrandDetails()
    if (props.isOrderNew) {
      fetchItemInfoFields()
    } else {
      if (props.itemInfoFields.length) {
        assignStateToItemInfo(props.itemInfoFields)
      }
    }
    fetchContentNumberSettings()
    fetchContentTranslationList()
    fetchProductLocationList()
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
              <Input
                value={props.orderReference}
                onChange={(e) => {
                  dispatch(setOrderReference(e.target.value))
                }}
                style={{
                  marginTop: "5px",
                  border: props.orderFormValidations.customer_order_reference
                    ?.status
                    ? "1px solid #ea5455"
                    : "1px solid #d8d6de"
                }}
                disabled={props.isOrderConfirmed}
              />
              {props.orderFormValidations.customer_order_reference?.status ? (
                <CustomFormFeedback
                  errMsg={
                    props.orderFormValidations.customer_order_reference?.msg
                  }
                ></CustomFormFeedback>
              ) : null}
            </Col>
            <Col xs="12" sm="12" md="6" lg="4" xl="4">
              <div>
                <Label>{t("Expected Delivery Date")}</Label>
                <span className="text-danger">*</span>
                <Flatpickr
                  className="form-control"
                  value={
                    props.expectedDeliveryDate ? props.expectedDeliveryDate : ""
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
                      styles={{
                        control: (base) => {
                          const value = productionLocationOptions?.filter(
                            (opt) => opt.label === props.productionLocation
                          )
                          if (
                            props.validations?.content_number_status &&
                            value.value
                          ) {
                            return { ...base, ...errorStyles }
                          }
                          return { ...base }
                        }
                      }}
                      options={productionLocationOptions}
                      value={productionLocationOptions?.filter(
                        (opt) => opt.label === props.productionLocation
                      )}
                      onChange={(e) => {
                        dispatch(setProductionLocation(e.label))
                      }}
                      isDisabled={props.isOrderConfirmed}
                    />
                    {props.orderFormValidations.production_location?.status ? (
                      <CustomFormFeedback>
                        {props.orderFormValidations.production_location?.msg}
                      </CustomFormFeedback>
                    ) : null}
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
              style={{
                cursor: "pointer"
              }}
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
                    />
                    <WashCareSection
                      iconSequence={iconSequence}
                      washCareOptions={washCareOptions}
                      iconName={iconName}
                      contentGroupOptions={contentGroupOptions}
                      fetchContentNumberDetail={fetchContentNumberDetail}
                      careNumberData={props.careNumberData}
                      contentGroup={props.contentGroup}
                      washCareData={props.washCareData}
                      handleMatchContentNumber={handleMatchContentNumber}
                      isOrderConfirmed={props.isOrderConfirmed}
                      brandSettings={props.brandSettings}
                      tooltipStatus={tooltipStatus}
                      tooltipMsg={tooltipMsg}
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
                      />
                      <WashCareSection
                        iconSequence={iconSequence}
                        washCareOptions={washCareOptions}
                        iconName={iconName}
                        contentGroupOptions={contentGroupOptions}
                        fetchContentNumberDetail={fetchContentNumberDetail}
                        careNumberData={props.careNumberData}
                        contentGroup={props.contentGroup}
                        washCareData={props.washCareData}
                        handleMatchContentNumber={handleMatchContentNumber}
                        isOrderConfirmed={props.isOrderConfirmed}
                        brandSettings={props.brandSettings}
                        tooltipStatus={tooltipStatus}
                        tooltipMsg={tooltipMsg}
                      />
                    </div>
                  ) : props.contentGroup === "AB/C" ? (
                    <div>
                      <WashCareSection
                        iconSequence={iconSequence}
                        washCareOptions={washCareOptions}
                        iconName={iconName}
                        contentGroupOptions={contentGroupOptions}
                        fetchContentNumberDetail={fetchContentNumberDetail}
                        careNumberData={props.careNumberData}
                        contentGroup={props.contentGroup}
                        washCareData={props.washCareData}
                        handleMatchContentNumber={handleMatchContentNumber}
                        isOrderConfirmed={props.isOrderConfirmed}
                        brandSettings={props.brandSettings}
                        tooltipStatus={tooltipStatus}
                        tooltipMsg={tooltipMsg}
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
  brand: state.poOrderReducer.brand,
  careData: state.poOrderReducer.careData,
  washCareData: state.poOrderReducer.washCareData,
  dynamicFieldData: state.poOrderReducer.dynamicFieldData,
  fibreInstructionData: state.poOrderReducer.fibreInstructionData,
  contentCustomNumber: state.poOrderReducer.contentCustomNumber,
  careCustomNumber: state.poOrderReducer.careCustomNumber,
  productionLocation: state.poOrderReducer.productionLocation,
  orderReference: state.poOrderReducer.orderReference,
  expectedDeliveryDate: state.poOrderReducer.expectedDeliveryDate,
  contentNumberData: state.poOrderReducer.contentNumberData,
  defaultContentData: state.poOrderReducer.defaultContentData,
  careNumberData: state.poOrderReducer.careNumberData,
  brandDetails: state.poOrderReducer.brandDetails,
  itemInfoFields: state.poOrderReducer.itemInfoFields,
  contentGroup: state.poOrderReducer.contentGroup,
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  isOrderNew: state.listReducer.isOrderNew,
  selectedOrder: state.listReducer.selectedOrder,
  brandSettings: state.poOrderReducer.brandSettings,
  orderFormValidations: state.poOrderReducer.orderFormValidations
})

export default connect(mapStateToProps, null)(OrderForm)
