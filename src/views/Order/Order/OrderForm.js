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
  FormGroup,
  FormFeedback,
  Row,
  Col,
  Input,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
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
  setBrandDetails,
  setItemInfoFields,
  setBrandSettings
} from "@redux/actions/views/Order/Order"
import { matchContentNumber } from "@redux/actions/views/common"
import { getUserData } from "@utils"

const errorStyles = {
  border: "1px solid red",
  boxShadow: 0
}
// page components
const ContentSection = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // states for custom tooltip
  const [componentTip, setComponentTip] = useState("")
  const [fabricTip, setFabricTip] = useState("")
  const [percentTip, setPercentTip] = useState("")

  //other funcitons
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
          props.handleMatchContentNumber("content")
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <Row>
        <Col xs="6" sm="6" md="6" lg="6" xl="6">
          <Row>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Label style={{ marginTop: "12px" }}>{props.contentName}</Label>
            </Col>
          </Row>
          <Row>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Select
                className="React"
                classNamePrefix="select"
                styles={{
                  control: (base) => {
                    // const value =
                    //   props.contentGroup === "ABC"
                    //     ? props.contentGroupOptions["ABC"]?.filter(
                    //         (opt) =>
                    //           opt.value === props.contentNumberData?.value
                    //       )
                    //     : props.contentGroup === "A/BC"
                    //     ? props.contentGroupOptions["A"]?.filter(
                    //         (opt) =>
                    //           opt.value === props.contentNumberData?.value
                    //       )
                    //     : props.contentGroupOptions["AB"]?.filter(
                    //         (opt) =>
                    //           opt.value === props.contentNumberData?.value
                    //       )
                    // if (
                    //   props.validations?.content_number_status &&
                    //   value.value
                    // ) {
                    //   return { ...base, ...errorStyles }
                    // }
                    return { ...base }
                  }
                }}
                value={
                  props.contentGroup === "ABC"
                    ? props.contentGroupOptions["ABC"]?.filter(
                        (opt) => opt.value === props.contentNumberData?.value
                      )
                    : props.contentGroup === "A/BC"
                    ? props.contentGroupOptions["A"]?.filter(
                        (opt) => opt.value === props.contentNumberData?.value
                      )
                    : props.contentGroupOptions["AB"]?.filter(
                        (opt) => opt.value === props.contentNumberData?.value
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
        </Col>
      </Row>
      {props.brandSettings?.display_custom_content_number === "Y" ? (
        <Row style={{ marginBottom: "10px" }}>
          <Col xs="6" sm="6" md="6" lg="6" xl="6">
            <Row>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Label style={{ marginTop: "12px" }}>Save/Edit</Label>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Input
                  value={props.contentCustomNumber}
                  onChange={(e) =>
                    dispatch(setContentCustomNumber(e.target.value))
                  }
                  disabled={props.isOrderConfirmed}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : null}
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
                <div
                  onMouseEnter={() => {
                    if (
                      props.brandSettings.content_msg_show_model === "Hover"
                    ) {
                      setComponentTip(`component-select-${index}`)
                    }
                  }}
                  onMouseLeave={() => {
                    setComponentTip("")
                  }}
                >
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
                      props.handleMatchContentNumber("content")
                    }}
                    onFocus={() => {
                      if (
                        props.brandSettings.content_msg_show_model === "Focus"
                      ) {
                        setComponentTip(`component-select-${index}`)
                      }
                    }}
                    onBlur={() => {
                      setComponentTip("")
                    }}
                    isClearable={true}
                    isDisabled={
                      props.isOrderConfirmed ||
                      props.brandSettings.create_content_model === "Admin"
                    }
                  />
                  {props.orderFormValidations.content ? (
                    props.orderFormValidations.content[index]
                      ?.part_key_status ? (
                      <div style={{ fontSize: 12, color: "#ea5455" }}>
                        {props.orderFormValidations.content[index]?.part_msg}
                      </div>
                    ) : null
                  ) : null}
                </div>
                {props.tooltipStatus.part ? (
                  <div>
                    <Popover
                      target={`component-select-${index}`}
                      isOpen={componentTip === `component-select-${index}`}
                    >
                      <PopoverHeader>Tip </PopoverHeader>
                      <PopoverBody>
                        <ol type="i">
                          {props.tooltipMsg.part?.map((msg) => {
                            if (msg.length) {
                              return <li>{msg}</li>
                            }
                          })}
                        </ol>
                      </PopoverBody>
                    </Popover>
                  </div>
                ) : null}
              </Col>
              <Col xs="12" sm="12" md="3" lg="3" xl="3">
                <Label>Fabric</Label>
                <div
                  onMouseEnter={() => {
                    if (
                      props.brandSettings.content_msg_show_model === "Hover"
                    ) {
                      setFabricTip(`fabric-select-${index}`)
                    }
                  }}
                  onMouseLeave={() => {
                    setFabricTip("")
                  }}
                >
                  <Select
                    id={`fabric-select-${index}`}
                    className="React"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => {
                        if (props.orderFormValidations.content) {
                          if (
                            props.orderFormValidations.content[index]
                              ?.content_key_status
                          ) {
                            return { ...base, border: "1px solid #ea5455" }
                          }
                        }
                        return { ...base }
                      }
                    }}
                    options={props.fabricOptions}
                    value={props.fabricOptions?.filter(
                      (opt) => opt.value === rec?.cont_key
                    )}
                    onChange={(e) => {
                      handleFibreChange(e, index)
                    }}
                    isClearable={true}
                    onFocus={() => {
                      if (
                        props.brandSettings.content_msg_show_model === "Focus"
                      ) {
                        setFabricTip(`fabric-select-${index}`)
                      }
                    }}
                    onBlur={() => {
                      setFabricTip("")
                    }}
                    onMouseEnter={() => {
                      if (
                        props.brandSettings.content_msg_show_model === "Hover"
                      ) {
                        setFabricTip(`fabric-select-${index}`)
                      }
                    }}
                    onMouseLeave={() => {
                      setFabricTip("")
                    }}
                    isDisabled={
                      props.isOrderConfirmed ||
                      props.brandSettings.create_content_model === "Admin"
                    }
                  />
                  {props.orderFormValidations.content ? (
                    props.orderFormValidations.content[index]
                      ?.content_key_status ? (
                      <div style={{ fontSize: 12, color: "#ea5455" }}>
                        {props.orderFormValidations.content[index]?.content_msg}
                      </div>
                    ) : null
                  ) : null}
                </div>
                {props.tooltipStatus.content ? (
                  <div>
                    <Popover
                      target={`fabric-select-${index}`}
                      isOpen={fabricTip === `fabric-select-${index}`}
                    >
                      <PopoverHeader>Tip</PopoverHeader>
                      <PopoverBody>
                        <ol type="i">
                          {props.tooltipMsg.content?.map((msg) => {
                            if (msg.length) {
                              return <li>{msg}</li>
                            }
                          })}
                        </ol>
                      </PopoverBody>
                    </Popover>
                  </div>
                ) : null}
              </Col>
              <Col xs="12" sm="12" md="2" lg="2" xl="2">
                <Label>%</Label>
                <div
                  onMouseEnter={() => {
                    if (
                      props.brandSettings.content_msg_show_model === "Hover"
                    ) {
                      setPercentTip(`percent-select-${index}`)
                    }
                  }}
                  onMouseLeave={() => {
                    setPercentTip("")
                  }}
                >
                  <Input
                    id={`percent-select-${index}`}
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
                    onFocus={() => {
                      if (
                        props.brandSettings.content_msg_show_model === "Focus"
                      ) {
                        setPercentTip(`percent-select-${index}`)
                      }
                    }}
                    onBlur={() => {
                      setPercentTip("")
                    }}
                    disabled={
                      props.isOrderConfirmed ||
                      props.brandSettings.create_content_model === "Admin"
                    }
                  />
                </div>
                {props.tooltipStatus.percentage ? (
                  <div>
                    <Popover
                      target={`percent-select-${index}`}
                      isOpen={percentTip === `percent-select-${index}`}
                    >
                      <PopoverHeader>Tip</PopoverHeader>
                      <PopoverBody>
                        <ol type="i">
                          {props.tooltipMsg.percentage?.map((msg) => {
                            if (msg.length) {
                              return <li>{msg}</li>
                            }
                          })}
                        </ol>
                      </PopoverBody>
                    </Popover>
                  </div>
                ) : null}
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
                    props.handleMatchContentNumber("content")
                  }}
                  disabled={
                    props.isOrderConfirmed ||
                    props.brandSettings.create_content_model === "Admin"
                  }
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
              props.handleMatchContentNumber("content")
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
          <Label style={{ marginTop: "12px" }}>Default Content</Label>
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
  const [careTip, setCareTip] = useState("")
  return (
    <div style={{ paddingTop: props.contentGroup === "AB/C" ? "20px" : 0 }}>
      {props.contentGroup === "AB/C" ? (
        <Row>
          <Col>
            <h4 className="text-primary">{t("Care")}</h4>
          </Col>
        </Row>
      ) : null}
      {props.contentGroup === "A/BC" ? (
        <>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="6" sm="6" md="6" lg="6" xl="6">
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Label style={{ marginTop: "12px" }}>{props.careName}</Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
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
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="6" sm="6" md="6" lg="6" xl="6">
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Label style={{ marginTop: "12px" }}>Save/Edit:</Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Input
                    value={props.careCustomNumber}
                    onChange={(e) =>
                      dispatch(setCareCustomNumber(e.target.value))
                    }
                    disabled={props.isOrderConfirmed}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
      <Row>
        <Col>
          <Label>Additional Care & Mandatory Statements </Label>
        </Col>
      </Row>
      {props.careData.map((rec, index) => (
        <Row style={{ marginBottom: "7px" }}>
          <Col xs="12" sm="12" md="8" lg="8" xl="8">
            <div
              onMouseEnter={() => {
                if (props.brandSettings.content_msg_show_model === "Hover") {
                  setCareTip(`care-select-${index}`)
                }
              }}
              onMouseLeave={() => setCareTip("")}
            >
              <Select
                className="React"
                id={`care-select-${index}`}
                classNamePrefix="select"
                styles={{
                  control: (base) => {
                    if (props.orderFormValidations.care) {
                      if (props.orderFormValidations.care[index]?.care_status) {
                        return { ...base, border: "1px solid #ea5455" }
                      }
                    }
                    return { ...base }
                  }
                }}
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
                  props.handleMatchContentNumber("care")
                }}
                isClearable={true}
                onFocus={() => {
                  if (props.brandSettings.content_msg_show_model === "Focus") {
                    setCareTip(`care-select-${index}`)
                  }
                }}
                onBlur={() => setCareTip("")}
                isDisabled={
                  props.isOrderConfirmed ||
                  props.brandSettings.create_content_model === "Admin"
                }
              />
              {props.orderFormValidations.care ? (
                props.orderFormValidations.care[index]?.care_status ? (
                  <div style={{ fontSize: 12, color: "#ea5455" }}>
                    {props.orderFormValidations.care[index]?.care_msg}
                  </div>
                ) : null
              ) : null}
            </div>
            {props.tooltipStatus.care ? (
              <div>
                <Popover
                  target={`care-select-${index}`}
                  isOpen={careTip === `care-select-${index}`}
                >
                  <PopoverHeader>Tip </PopoverHeader>
                  <PopoverBody>
                    <ol type="i">
                      {props.tooltipMsg.care?.map((msg) => {
                        if (msg.length) {
                          return <li>{msg}</li>
                        }
                      })}
                    </ol>
                  </PopoverBody>
                </Popover>
              </div>
            ) : null}
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
                props.handleMatchContentNumber("care")
              }}
              disabled={
                props.isOrderConfirmed ||
                props.brandSettings.create_content_model === "Admin"
              }
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
  const [iconTip, setIconTip] = useState("")

  return (
    <div style={{ paddingTop: props.contentGroup === "A/BC" ? "20px" : 0 }}>
      {props.contentGroup === "A/BC" ? (
        <Row>
          <Col>
            <h4 className="text-primary">{t("Wash Care")}</h4>
          </Col>
        </Row>
      ) : null}
      {props.contentGroup === "AB/C" ? (
        <>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="6" sm="6" md="6" lg="6" xl="6">
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Label style={{ marginTop: "12px" }}>{props.iconName}</Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
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
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="6" sm="6" md="6" lg="6" xl="6">
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Label style={{ marginTop: "12px" }}>Save/Edit:</Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <Input
                    value={props.careCustomNumber}
                    onChange={(e) =>
                      dispatch(setCareCustomNumber(e.target.value))
                    }
                    disabled={props.isOrderConfirmed}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ) : null}
      {props.iconSequence?.map((iconObj, index) => {
        return (
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="6" s="6" md="6" lg="6" xl="6">
              <Row>
                <Col xs="12" s="12" md="12" lg="12" xl="12">
                  <Label style={{ marginTop: "12px" }}>
                    {iconObj.sys_icon_name}
                  </Label>
                </Col>
              </Row>
              <Row>
                <Col xs="12" s="12" md="12" lg="12" xl="12">
                  <div
                    onMouseEnter={() => {
                      if (
                        props.brandSettings.content_msg_show_model === "Hover"
                      ) {
                        setIconTip(`icon-select-${index}`)
                      }
                    }}
                    onMouseLeave={() => setIconTip("")}
                  >
                    <Select
                      id={`icon-select-${index}`}
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => {
                          if (props.orderFormValidations.icon) {
                            if (
                              props.orderFormValidations.icon[index]
                                ?.icon_status
                            ) {
                              return { ...base, border: "1px solid #ea5455" }
                            }
                          }
                          return { ...base }
                        }
                      }}
                      options={props.washCareOptions[iconObj?.icon_type_id]}
                      value={
                        props.washCareOptions[iconObj?.icon_type_id]
                          ? props.washCareOptions[
                              iconObj?.icon_type_id
                            ]?.filter(
                              (opt) =>
                                opt.value ===
                                props.washCareData[iconObj?.icon_type_id]
                                  ?.icon_key
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
                        props.handleMatchContentNumber("washCare")
                      }}
                      getOptionLabel={(e) => (
                        <div>
                          {e.icon}
                          {e.label}
                        </div>
                      )}
                      filterOption={(options, query) =>
                        options.data.label
                          .toLowerCase()
                          .includes(query.toLowerCase())
                      }
                      onFocus={() => {
                        if (
                          props.brandSettings.content_msg_show_model === "Focus"
                        ) {
                          setIconTip(`icon-select-${index}`)
                        }
                      }}
                      onBlur={() => setIconTip("")}
                      isClearable={true}
                      isDisabled={
                        props.isOrderConfirmed ||
                        props.brandSettings.create_content_model === "Admin"
                      }
                    />
                    {props.orderFormValidations.icon ? (
                      props.orderFormValidations.icon[index]
                        ?.icon_status ? (
                        <div style={{ fontSize: 12, color: "#ea5455" }}>
                          {props.orderFormValidations.icon[index]?.icon_msg}
                        </div>
                      ) : null
                    ) : null}
                  </div>
                  {props.tooltipStatus.icon ? (
                    <div>
                      <Popover
                        target={`icon-select-${index}`}
                        isOpen={iconTip === `icon-select-${index}`}
                      >
                        <PopoverHeader>Tip </PopoverHeader>
                        <PopoverBody>
                          <ol type="i">
                            {props.tooltipMsg.icon?.map((msg) => {
                              if (msg.length) {
                                return <li>{msg}</li>
                              }
                            })}
                          </ol>
                        </PopoverBody>
                      </Popover>
                    </div>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        )
      })}
    </div>
  )
}

let timerId = null
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
                  style={{ margin: "5px" }}
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
                      margin: "5px",
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
                    <div style={{ fontSize: 12, color: "#ea5455" }}>
                      {props.orderFormValidations.expected_delivery_date?.msg}
                    </div>
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
