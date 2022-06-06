import { Button, Row, Col } from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"
import { useTranslation } from "react-i18next"

const Footer = (props) => {
  const { t } = useTranslation()

  const selectedItemsValidation = () => {
    // selectedItems validation for Select Item page.
    if (props.selectedItems && props.selectedItems.length <= 0) {
      alert("Please Select Item/s to proceed")
      return false
    }
    return true
  }

  const poSelectedOrderValidation = () => {
    // validation for order selection in PO Order Listing page
    if (props.poSelectedItems && props.poSelectedItems.length <= 0) {
      alert("Please select an order to proceed")
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
          props.validationFields?.orderFormManFields[key].length <= 0 &&
          localFlag
        ) {
          alert("Please fill the mandatory fields to proceed")
          localFlag = false
          return localFlag
        }
      })
    }
    return localFlag
  }

  const checkBoundary = () => {
    // checks for boundary conditions.
    if (props.currentStep < props.lastStep) {
      return true
    }
    return false
  }

  return (
    <Row>
      <Col>
        <Button
          color="primary"
          onClick={() => {
            if (props.currentStep > 0) {
              props.setCurrentStep(props.currentStep - 1)
            }
          }}
          disabled={props.currentStep === 0}
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
                orderFormManFieldValidation() &&
                checkBoundary()
              ) {
                props.setCurrentStep(props.currentStep + 1)
              }
            }}
            disabled={props.currentStep === props.lastStep}
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
