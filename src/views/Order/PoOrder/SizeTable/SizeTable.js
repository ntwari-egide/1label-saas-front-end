import { Card, CardHeader, CardBody, CardFooter } from "reactstrap"
import Footer from "../../../CommonFooter"

const SizeTable = (props) => {
  return (
    <Card>
      <CardHeader>
        <h4>Size Table</h4>
      </CardHeader>
      <CardBody></CardBody>
      <CardFooter>
        <Footer
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

export default SizeTable
