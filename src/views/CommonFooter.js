import { Button, Row, Col } from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"
import { useTranslation } from "react-i18next"

const Footer = (props) => {
  const { t } = useTranslation()
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
              if (props.validationField && props.validationField.length <= 0) {
                alert("Please Select Item/s to proceed")
                return
              }
              if (props.currentStep < props.lastStep) {
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
