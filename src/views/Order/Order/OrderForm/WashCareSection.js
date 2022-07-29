import { useState } from "react"
import Select from "react-select"
import {
  Label,
  Row,
  Col,
  Input,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap"
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
                    onMouseLeave={() => {
                      if (
                        props.brandSettings.content_msg_show_model === "Hover"
                      ) {
                        setIconTip("")
                      }
                    }}
                  >
                    <Select
                      id={`icon-select-${index}`}
                      className="React"
                      classNamePrefix="select"
                      styles={{
                        control: (base) => {
                          if (
                            props.orderFormValidations.icon &&
                            props.orderFormValidations.icon[index]?.icon_status
                          ) {
                            return { ...base, border: "1px solid #ea5455" }
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
                      onBlur={() => {
                        if (
                          props.brandSettings.content_msg_show_model === "Focus"
                        ) {
                          setIconTip("")
                        }
                      }}
                      isClearable={true}
                      isDisabled={
                        props.isOrderConfirmed ||
                        props.brandSettings.create_content_model === "Admin"
                      }
                      isLoading={
                        !props.washCareOptions[iconObj?.icon_type_id]?.length
                      }
                    />
                    {props.orderFormValidations.icon ? (
                      props.orderFormValidations.icon[index]?.icon_status ? (
                        <CustomFormFeedback
                          errMsg={
                            props.orderFormValidations.icon[index]?.icon_msg
                          }
                        />
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

const mapStateToProps = (state) => ({
  careNumberData: state.orderReducer.careNumberData,
  contentGroup: state.orderReducer.contentGroup,
  washCareData: state.orderReducer.washCareData,
  isOrderConfirmed: state.orderReducer.isOrderConfirmed,
  brandSettings: state.orderReducer.brandSettings,
  orderFormValidations: state.orderReducer.orderFormValidations
})

export default connect(mapStateToProps, null)(WashCareSection)
