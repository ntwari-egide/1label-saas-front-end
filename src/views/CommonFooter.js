import { Button, Row, Col } from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"

const Footer = (props) => {
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
            <div style={{ marginTop: "2px" }}>{"Previous  "}</div>
          </div>
        </Button>
      </Col>
      <Col>
        <div style={{ float: "right" }}>
          <Button
            color="primary"
            onClick={() => {
              if (props.currentStep < props.lastStep) {
                props.setCurrentStep(props.currentStep + 1)
              }
            }}
            disabled={props.currentStep === props.lastStep}
          >
            <div style={{ display: "flex" }}>
              <div style={{ marginTop: "2px" }}>{"Next  "}</div>
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
