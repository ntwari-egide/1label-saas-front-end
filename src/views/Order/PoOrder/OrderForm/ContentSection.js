import { useState } from "react"
import {
  Col,
  Button,
  Input,
  Row,
  Label,
  Popover,
  PopoverBody,
  PopoverHeader
} from "reactstrap"
import { X, Plus } from "react-feather"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { connect, useDispatch } from "react-redux"
import {
  setCareData,
  setWashCareData,
  setFibreInstructionData,
  setContentCustomNumber,
  setContentNumberData,
  setDefaultContentData
} from "@redux/actions/views/Order/POOrder"

let timerId = null
const ContentSection = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // states for custom tooltip
  const [componentTip, setComponentTip] = useState("")
  const [fabricTip, setFabricTip] = useState("")
  const [percentTip, setPercentTip] = useState("")

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
          props.handleMatchContentNumber("content")
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <div>
      <Row style={{ marginBottom: "10px" }}>
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
                    isDisabled={
                      props.isOrderConfirmed ||
                      props.brandSettings.create_content_model === "Admin"
                    }
                  />
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
                          {props.tooltipStatus.content?.map((msg) => {
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
                  disabled={
                    props.isOrderConfirmed ||
                    props.brandSettings.create_content_model === "Admin"
                  }
                />
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

export default ContentSection