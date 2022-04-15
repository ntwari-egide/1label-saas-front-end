import { useSate, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"

const PreviewAndSummary = (props) => {
  return (
    <Card>
      <CardHeader>Preview And Summary</CardHeader>
      <CardBody></CardBody>
      <CardFooter>
        <Row>
          <Col>
            <Button
              color="primary"
              onClick={() => {
                props.setCurrentStep(props.currentStep - 1)
              }}
              disabled={props.currentStep === 1}
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
                  props.setCurrentStep(props.currentStep + 1)
                }}
                disabled={props.currentStep === 6}
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
      </CardFooter>
    </Card>
  )
}

export default PreviewAndSummary
