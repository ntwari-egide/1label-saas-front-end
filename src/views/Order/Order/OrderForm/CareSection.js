import { useState } from "react"
import Select from "react-select"
import {
  Label,
  Row,
  Col,
  Input,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap"
import { X, Plus } from "react-feather"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import {
  setFibreInstructionData,
  setCareData,
  setWashCareData,
  setCareNumberData,
  setCareCustomNumber
} from "@redux/actions/views/Order/Order"
import CustomFormFeedback from "@components/CustomFormFeedback"

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
                    isLoading={
                      props.contentGroup === "ABC"
                        ? !props.contentGroupOptions["ABC"]?.length
                        : props.contentGroup === "A/BC"
                        ? !props.contentGroupOptions["BC"]?.length
                        : !props.contentGroupOptions["C"]?.length
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
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
              onMouseLeave={() => {
                if (props.brandSettings.content_msg_show_model === "Hover") {
                  setCareTip("")
                }
              }}
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
                onBlur={() => {
                  if (props.brandSettings.content_msg_show_model === "Focus") {
                    setCareTip("")
                  }
                }}
                isDisabled={
                  props.isOrderConfirmed ||
                  props.brandSettings.create_content_model === "Admin"
                }
                isLoading={!props.additionalCareOptions.length}
              />
              {props.orderFormValidations.care ? (
                props.orderFormValidations.care[index]?.care_status ? (
                  <CustomFormFeedback
                    errMsg={props.orderFormValidations.care[index]?.care_msg}
                  />
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

const mapStateToProps = (state) => ({
  contentGroup: state.orderReducer.contentGroup,
  brand: state.orderReducer.brand,
  careData: state.orderReducer.careData,
  careCustomNumber: state.orderReducer.careCustomNumber,
  careNumberData: state.orderReducer.careNumberData,
  isOrderConfirmed: state.orderReducer.isOrderConfirmed,
  brandSettings: state.orderReducer.brandSettings,
  orderFormValidations: state.orderReducer.orderFormValidations
})

export default connect(mapStateToProps, null)(CareSection)
