import { Button, Row, Col } from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"
import { useTranslation } from "react-i18next"
import { sweetAlert } from "@utils"

const Footer = (props) => {
  const { t } = useTranslation()

  const selectedItemsValidation = () => {
    // selectedItems validation for Select Item page.
    if (props.selectedItems && props.selectedItems.length <= 0) {
      sweetAlert("", "Please Select Item/s to proceed", "warning", "warning")
      return false
    }
    return true
  }

  const poSelectedOrderValidation = () => {
    // validation for order selection in PO Order Listing page
    if (props.poSelectedOrders && props.poSelectedOrders.length <= 0) {
      sweetAlert("", "Please select an order to proceed", "warning", "warning")
      return false
    }
    return true
  }

  const orderFormManFieldValidation = () => {
    // validation for mandatory fields in Order Form
    let localFlag = true
    if (props.validationFields?.orderFormManFields) {
      Object.keys(props.validationFields?.orderFormManFields).map((key) => {
        if (
          key === "expectedDeliveryDate" &&
          props.brandDetails?.is_show_expected_date === "N"
        ) {
          return
        }
        if (
          key === "productionLocation" &&
          props.brandDetails?.display_location_code === "N"
        ) {
          return
        }
        if (
          props.validationFields?.orderFormManFields[key].length <= 0 &&
          localFlag
        ) {
          sweetAlert(
            "",
            "Please fill the mandatory fields to proceed",
            "warning",
            "warning"
          )
          localFlag = false
          return localFlag
        }
      })
    }
    return localFlag
  }

  const handleStep = (direction) => {
    const index = props.stepperMenu.indexOf(props.currentStep)
    if (direction === "back") {
      props.setCurrentStep(props.stepperMenu[index - 1])
    } else {
      props.setCurrentStep(props.stepperMenu[index + 1])
    }
  }

  return (
    <Row>
      <Col>
        <Button
          color="primary"
          onClick={() => handleStep("back")}
          disabled={props.currentStep === props.stepperMenu[0]}
        >
          <div style={{ display: "flex" }}>
            <div>
              <ArrowLeft size={15} />
            </div>
            <div style={{ marginTop: "2px" }}>{t("Previous")}</div>
          </div>
        </Button>
      </Col>
      <Col>
        <div style={{ float: "right" }}>
          <Button
            color="primary"
            onClick={() => {
              if (
                selectedItemsValidation() &&
                poSelectedOrderValidation() &&
                orderFormManFieldValidation()
              ) {
                handleStep("forward")
              }
            }}
            disabled={
              props.currentStep ===
                props.stepperMenu[props.stepperMenu.length - 1] ||
              props.currentStep === "Invoice & Delivery"
            }
          >
            <div style={{ display: "flex" }}>
              <div style={{ marginTop: "2px" }}>{t("Next")}</div>
              <div>
                <ArrowRight size={15} />
              </div>
            </div>
          </Button>
        </div>
      </Col>
    </Row>
  )
}

export default Footer
