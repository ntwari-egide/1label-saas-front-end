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
  CardFooter,
  Popover,
  PopoverBody,
  PopoverHeader
} from "reactstrap"
import { X, Plus } from "react-feather"
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
  setContentCustomNumber,
  setCareCustomNumber,
  setProductionLocation,
  setOrderReference,
  setExpectedDeliveryDate,
  setContentNumberData,
  setDefaultContentData,
  setCareNumberData,
  setContentGroup,
  setCoo,
  setBrandDetails,
  setItemInfoFields
} from "@redux/actions/views/Order/POOrder"
import { matchContentNumber } from "@redux/actions/views/common"
import { getUserData } from "@utils"

// page components
const ContentSection = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // states for custom tooltip
  const [componentTip, setComponentTip] = useState({})
  const [fabricTip, setFabricTip] = useState({})

  //other funcitons
  //
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
          props.handleMatchContentNumber(0)
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <Row>
        <Col>
          <h4 className="text-primary">{t("Content")}</h4>
        </Col>
      </Row>
      <Row style={{ marginBottom: "10px" }}>
        <Col xs="12" sm="12" md="1" lg="1" xl="1">
          <Label style={{ marginTop: "12px" }}>{props.contentName}</Label>
        </Col>
        <Col xs="12" sm="12" md="9" lg="9" xl="9">
          <Select
            className="React"
            classNamePrefix="select"
            value={
              props.contentGroup === "ABC"
                ? props.contentGroupOptions["ABC"]?.filter(
                    (opt) => opt.label === props.contentNumberData?.label
                  )
                : props.contentGroup === "A/BC"
                ? props.contentGroupOptions["A"]?.filter(
                    (opt) => opt.label === props.contentNumberData?.label
                  )
                : props.contentGroupOptions["AB"]?.filter(
                    (opt) => opt.label === props.contentNumberData?.label
                  )
            }
            options={
              props.contentGroup === "ABC"
                ? props.contentGroupOptions["ABC"]
                : props.contentGroup === "A/BC"
                ? props.contentGroupOptions["A"]
                : props.contentGroupOptions["AB"]
            }
            onChange={(e) => {
              dispatch(setContentNumberData(e ? e : {}))
              if (e) {
                props.fetchContentNumberDetail(e.value, e.label)
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
            isDisabled={props.isOrderConfirmed}
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
            onChange={(e) => dispatch(setContentCustomNumber(e.target.value))}
            disabled={props.isOrderConfirmed}
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: "20px" }}>
        <Col>
          <h5>{t("Fibre Instructions")}</h5>
        </Col>
      </Row>
      {props.fibreInstructionData
        ? props.fibreInstructionData.map((rec, index) => (
            <Row style={{ marginBottom: "5px" }}>
              <Col xs="12" sm="12" md="4" lg="4" xl="4">
                <Label>Component</Label>
                <Select
                  id={`component-select-${index}`}
                  className="React"
                  classNamePrefix="select"
                  options={props.componentOptions}
                  value={props.componentOptions?.filter(
                    (opt) => opt.value === rec?.part_key
                  )}
                  onChange={(e) => {
                    const tempData = props.fibreInstructionData
                    // ternary to handle isClearable event
                    tempData[index] = {
                      ...props.fibreInstructionData[index],
                      part_key: e ? e.value : "",
                      part_translation: e ? e.label : ""
                    }
                    dispatch(setFibreInstructionData([...tempData]))
                    props.handleMatchContentNumber(0)
                  }}
                  onFocus={() => {
                    setComponentTip({
                      [`component-select-${index}`]: true
                    })
                  }}
                  onBlur={() => {
                    setComponentTip({})
                  }}
                  isClearable={true}
                  isDisabled={props.isOrderConfirmed}
                />
                <div>
                  <Popover
                    target={`component-select-${index}`}
                    isOpen={
                      componentTip[`component-select-${index}`]
                        ? componentTip[`component-select-${index}`]
                        : false
                    }
                  >
                    <PopoverHeader>Tip </PopoverHeader>
                    <PopoverBody>
                      <ol type="i">
                        <li>
                          Style containing two or more garment components of
                          different textile fibre, each component must be
                          stated. e.g. lining, padding etc..
                        </li>
                        <li>
                          However if a component is less than 30% of the total
                          garment it must not be mentioned. e.g. rib
                        </li>
                      </ol>
                    </PopoverBody>
                  </Popover>
                </div>
              </Col>
              <Col xs="12" sm="12" md="3" lg="3" xl="3">
                <Label>Fabric</Label>
                <Select
                  id={`fabric-select-${index}`}
                  className="React"
                  classNamePrefix="select"
                  options={props.fabricOptions}
                  value={props.fabricOptions?.filter(
                    (opt) => opt.value === rec?.cont_key
                  )}
                  onChange={(e) => {
                    handleFibreChange(e, index)
                  }}
                  isClearable={true}
                  onFocus={() => {
                    setFabricTip({
                      [`fabric-select-${index}`]: true
                    })
                  }}
                  onBlur={() => {
                    setFabricTip({})
                  }}
                  isDisabled={props.isOrderConfirmed}
                />
                <div>
                  <Popover
                    target={`fabric-select-${index}`}
                    isOpen={
                      fabricTip[`fabric-select-${index}`]
                        ? fabricTip[`fabric-select-${index}`]
                        : false
                    }
                  >
                    <PopoverHeader>Tip</PopoverHeader>
                    <PopoverBody>
                      <p>
                        Fabrics that are made up of multiple layer must call out
                        each other seperately. Contact CS for help on correct
                        setup
                      </p>
                    </PopoverBody>
                  </Popover>
                </div>
              </Col>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <Label>%</Label>
                <Input
                  value={
                    props.fibreInstructionData[index]?.percentage
                      ? props.fibreInstructionData[index]?.percentage
                      : ""
                  }
                  onChange={(e) => {
                    const tempData = props.fibreInstructionData
                    tempData[index] = {
                      ...props.fibreInstructionData[index],
                      percentage: e.target.value
                    }
                    dispatch(setFibreInstructionData([...tempData]))
                    debounceFun()
                  }}
                  disabled={props.isOrderConfirmed}
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
                    dispatch(setFibreInstructionData([...tempData]))
                    tempData = props.defaultContentData
                    tempData.splice(index, 1)
                    dispatch(setDefaultContentData([...tempData]))
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <X />
                    <div style={{ marginTop: "5px" }}>Delete</div>
                  </div>
                </Button>
              </Col>
            </Row>
          ))
        : null}
      <Row style={{ paddingTop: "5px" }}>
        <Col>
          <Button
            onClick={() => {
              const tempFibreInstructions = props.fibreInstructionData
              tempFibreInstructions.push({})
              dispatch(setFibreInstructionData([...tempFibreInstructions]))
              const tempDefaultContent = props.defaultContentData
              tempDefaultContent.push("")
              dispatch(setDefaultContentData([...tempDefaultContent]))
            }}
            color="primary"
            style={{ padding: "10px" }}
          >
            <Plus />
            Add New
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Label style={{ marginTop: "12px" }}>Default Content:</Label>
        </Col>
      </Row>
      {processDefaultContent(props.defaultContentData).map((item) => (
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="12" sm="12" md="9" lg="9" xl="9">
            <Input value={item ? item : ""} disabled={true} />
          </Col>
        </Row>
      ))}
    </div>
  )
}

const CareSection = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  return (
    <div style={{ paddingTop: "20px" }}>
      <Row>
        <Col>
          <h4 className="text-primary">{t("Care")}</h4>
        </Col>
      </Row>
      <Row style={{ marginBottom: "10px" }}>
        <Col xs="12" sm="12" md="1" lg="1" xl="1">
          <Label style={{ marginTop: "12px" }}>{props.careName}</Label>
        </Col>
        <Col xs="12" sm="12" md="9" lg="9" xl="9">
          <Select
            className="React"
            classNamePrefix="select"
            value={
              props.contentGroup === "ABC"
                ? props.contentGroupOptions["ABC"]?.filter(
                    (opt) => opt.value === props.careNumberData?.value
                  )
                : props.contentGroup === "A/BC"
                ? props.contentGroupOptions["BC"]?.filter(
                    (opt) => opt.value === props.careNumberData?.value
                  )
                : props.contentGroupOptions["C"]?.filter(
                    (opt) => opt.value === props.careNumberData?.value
                  )
            }
            options={
              props.contentGroup === "ABC"
                ? props.contentGroupOptions["ABC"]
                : props.contentGroup === "A/BC"
                ? props.contentGroupOptions["BC"]
                : props.contentGroupOptions["C"]
            }
            onChange={(e) => {
              dispatch(setCareNumberData(e ? e : {}))
              if (e) {
                props.fetchContentNumberDetail(e.value, e.label)
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
            isDisabled={props.isOrderConfirmed}
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
            onChange={(e) => dispatch(setCareCustomNumber(e.target.value))}
            disabled={props.isOrderConfirmed}
          />
        </Col>
      </Row>
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
              options={props.additionalCareOptions}
              value={props.additionalCareOptions?.filter(
                (opt) => opt.value === rec.care_key
              )}
              onChange={(e) => {
                const tempData = props.careData
                props.careData[index] = {
                  ...props.careData[index],
                  care_key: e ? e.value : ""
                }
                dispatch(setCareData([...tempData]))
                props.handleMatchContentNumber(1)
              }}
              isClearable={true}
              isDisabled={props.isOrderConfirmed}
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
      <Row style={{ paddingTop: "5px" }}>
        <Col>
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
        </Col>
      </Row>
    </div>
  )
}

const WashCareSection = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  return (
    <div style={{ paddingTop: "20px" }}>
      <Row>
        <Col>
          <h4 className="text-primary">{t("Wash Care")}</h4>
        </Col>
      </Row>
      {props.iconSequence?.map((iconObj) => {
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
                options={props.washCareOptions[iconObj?.icon_type_id]}
                value={
                  props.washCareOptions[iconObj?.icon_type_id]
                    ? props.washCareOptions[iconObj?.icon_type_id]?.filter(
                        (opt) =>
                          opt.value ===
                          props.washCareData[iconObj?.icon_type_id]?.icon_key
                      )
                    : ""
                }
                onChange={(e) => {
                  const tempData = {}
                  tempData[iconObj.icon_type_id] = {
                    icon_key: e ? e.value : "",
                    icon_type_id: e ? e.iconTypeId : "",
                    icon_group: e ? e.iconGroup : ""
                  }
                  dispatch(
                    setWashCareData({
                      ...props.washCareData,
                      ...tempData
                    })
                  )
                  props.handleMatchContentNumber(1)
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
                isDisabled={props.isOrderConfirmed}
              />
            </Col>
          </Row>
        )
      })}
    </div>
  )
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
  const [isContentSettingCommon, setIsContentSettingCommon] = useState("")
  // content setting data
  const [contentName, setContentName] = useState("")
  const [careName, setCareName] = useState("")
  const [iconName, setIconName] = useState("")
  // states for custom tooltip
  const [componentTip, setComponentTip] = useState({})
  const [fabricTip, setFabricTip] = useState({})

  const handleMatchContentNumber = (index) => {
    let content_group
    if (props.contentGroup === "ABC") {
      content_group = "ABC"
    } else {
      if (props.contentGroup.length) {
        content_group = props.contentGroup.split("/")[index]
      }
    }
    if (content_group) {
      dispatch(matchContentNumber("Order", content_group))
    }
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
                disable={props.isOrderConfirmed}
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
        if (props.isOrderNew) {
          tempItemInfoState[field.title] = {
            field_id: field.field,
            field_value: "",
            field_label: ""
          }
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
          // sets state to determine options for care and content for different content settings namely A/BC and ABC
          if (res.data[0]?.content_model === "ABC") {
            setIsContentSettingCommon(true)
          } else {
            setIsContentSettingCommon(false)
          }
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
                style={{ margin: "5px" }}
                disabled={props.isOrderConfirmed}
              />
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
                  style={{ margin: "5px" }}
                  options={{
                    minDate: props.minExpectedDeliveryDate
                  }}
                  onChange={(e) => {
                    dispatch(setExpectedDeliveryDate(e))
                  }}
                  disabled={props.isOrderConfirmed}
                />
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
                        <CardBody>
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
            <CardBody>
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
                  />
                  <WashCareSection
                    iconSequence={iconSequence}
                    washCareOptions={washCareOptions}
                    washCareData={props.washCareData}
                    handleMatchContentNumber={handleMatchContentNumber}
                    isOrderConfirmed={props.isOrderConfirmed}
                  />
                </div>
              ) : null}
            </CardBody>
          </Card>
          {props.contentGroup != "ABC" ? (
            props.contentGroup === "A/BC" ? (
              <div>
                <Card>
                  <CardBody>
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
                    />
                    <WashCareSection
                      iconSequence={iconSequence}
                      washCareOptions={washCareOptions}
                      washCareData={props.washCareData}
                      handleMatchContentNumber={handleMatchContentNumber}
                      isOrderConfirmed={props.isOrderConfirmed}
                    />
                  </CardBody>
                </Card>
              </div>
            ) : props.contentGroup === "AB/C" ? (
              <div>
                <Card>
                  <CardBody>
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
                    />
                  </CardBody>
                </Card>
              </div>
            ) : null
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
  selectedOrder: state.listReducer.selectedOrder
})

export default connect(mapStateToProps, null)(OrderForm)
