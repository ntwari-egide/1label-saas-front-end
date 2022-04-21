import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  Row,
  Spinner,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ListGroup,
  ListGroupItem
} from "reactstrap"
import { ChevronDown } from "react-feather"
import Chart from "react-apexcharts"
import { useTranslation } from "react-i18next"

// Pie Chart component for dashboard
const OrderSummaryChart = (props) => {
  const { t } = useTranslation()
  // APP Constants
  const seq = ["primary-chart", "warning", "danger"]
  const options = {
    chart: {
      dropShadow: {
        enable: false,
        blur: 5,
        left: 1,
        top: 1,
        opacity: 0.2
      }
    },
    dataLabels: {
      enable: false
    },
    colors: [props.primary, props.warning, props.danger],
    toolbar: {
      show: false
    },
    fill: {
      type: "gradient",
      gradient: {
        gradientToColors: [
          props.primaryLight,
          props.warningLight,
          props.dangerLight
        ]
      }
    },
    stroke: {
      width: 5
    },
    legend: {
      show: false
    },
    labels: ["Confirmed", "Draft", "New"]
  }
  // const [series, setSeries] = useState([1, 3, 3])

  return (
    <div style={{ height: "100%" }}>
      <Card style={{ height: "95%", minHeight: "95%" }}>
        <CardHeader>
          <CardTitle>{t("Summary")}</CardTitle>
          {/*}
        <UncontrolledDropdown>
          <DropdownToggle tag="small" className="text-bold-500 cursor-pointer">
            Last 7 days <ChevronDown size={10} />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>Last 28 days</DropdownItem>
            <DropdownItem>Last Month</DropdownItem>
            <DropdownItem>Last Year</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
    */}
        </CardHeader>
        <CardBody className="pt-0">
          {props.data.length > 0 ? (
            <Chart
              options={options}
              series={props.data.map((ord) => ord.total)}
              type="pie"
              // height={485}
            />
          ) : (
            <Row
              style={{
                justifyContent: "center",
                alignItems: "center",
                minHeight: "505px"
              }}
            >
              <div style={{ width: "50px", height: "50px" }}>
                <Spinner color="primary" />
              </div>
            </Row>
          )}
        </CardBody>
        <ListGroup flush>
          {props.data.map((ord, index) => (
            <ListGroupItem className="d-flex justify-content-between">
              <div className="item-info">
                <div
                  className={`bg-${seq[index]}`}
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    display: "inline-block",
                    margin: "0 5px"
                  }}
                />
                <span className="text-bold-600">
                  {t(`${ord.order_status}`)}
                </span>
              </div>
              <div className="product-result">
                <span>{ord.total}</span>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Card>
    </div>
  )
}
export default OrderSummaryChart
