import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import axios from "@axios"
// ** Utils

// ** Store & Actions
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap"

const Home = () => {
  const fetchChartData = () => {
    const body = {
      order_user: "innoa"
    }
    axios.post("/OrderTotalQuery", body).then((res) => console.log(res))
  }

  useEffect(() => {
    fetchChartData()
  }, [])

  return (
    <div>
      <Card>
        <CardHeader>
          <h4>Dashboard</h4>
        </CardHeader>
        <CardBody>
          <Row></Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default Home
