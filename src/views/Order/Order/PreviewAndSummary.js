import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"
import DataTable from "react-data-table-component"
import Footer from "../../CommonFooter"
import { XMLParser } from "fast-xml-parser"
import axios from "@axios"
import { useTranslation } from "react-i18next"

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  // App States
  const [sizeData, setSizeData] = useState([])
  const [defaultSizeData, setDefaultSizeData] = useState(null)

  const sizeCols = [
    {
      name: t("Sr No."),
      selector: "Sequence",
      sortable: true
    },
    {
      name: t("SIZE"),
      selector: "SIZE",
      sortable: true
    },
    {
      name: t("QTY ITEM REF 0"),
      selector: "QTY ITEM REF 0"
    },
    {
      name: t("QTY ITEM REF 1"),
      selector: "QTY ITEM REF 1"
    },
    {
      name: t("QTY ITEM REF 2"),
      selector: "QTY ITEM REF 2"
    },
    {
      name: t("UPC/EAN CODE"),
      selector: "UPC/EAN CODE"
    }
  ]

  // Other Functions
  const formatColToRow = (xmlStr) => {
    const parser = new XMLParser()
    const jsObj = parser.parse(xmlStr)
    console.log("jsObj", jsObj)
    const nRows = Object.keys(jsObj?.SizeMatrix?.Table).length - 2 // gets the no of rows
    let data = [] // initialized data to fill row by row
    let currentRow = 0 + 2 // because actual data begins at Column2
    for (let i = 0; i < nRows; i++) {
      let row = {} // initialise empty row
      jsObj?.SizeMatrix?.Table.map((col) => {
        row[col["Column1"]] = col[`Column${currentRow}`] // row[column_name] = column_value
      })
      data.push(row) // push the row to data
      currentRow += 1 // increment row count
    }
    return data
  }

  // API Sevices
  const fetchSizeTableList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      item_key: props.selectedItems.map((item) => item.guid_key),
      query_str: ""
    }
    axios
      .post("/SizeTable/GetSizeTableList", body)
      .then((res) => {
        if (res.status === 200) {
          fetchSizeTableDetails(res?.data[0]?.guid_key)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchSizeTableDetails = (guid_key) => {
    const body = {
      guid_key
    }
    axios
      .post("/SizeTable/GetSizeTableDetail", body)
      .then((res) => {
        if (res.status === 200) {
          // preprocessing
          if (res?.data[0]?.size_content) {
            props.setSizeTable(res?.data[0]?.size_content)
            setSizeData(formatColToRow(res?.data[0]?.size_content))
            console.log(
              "processed data",
              formatColToRow(res?.data[0]?.size_content)
            )
          } else {
            setSizeData([])
          }
          if (res?.data[0]?.default_size_content) {
            props.setDefaultSizeTable(res?.data[0]?.default_size_content)
            setDefaultSizeData(
              formatColToRow(res?.data[0]?.default_size_content)
            )
            console.log(
              "processed data",
              formatColToRow(res?.data[0]?.default_size_content)
            )
          } else {
            setDefaultSizeData([])
          }
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSizeTableList()
  }, [])

  useEffect(() => {
    console.log("sizeData", sizeData)
  }, [sizeData])

  return (
    <Card>
      <CardBody>
        <Row>
          <Col xs="12" sm="12" md="6" md="4" lg="3" xl="3">
            <Card>
              <CardBody style={{ minHeight: "450px", maxHeight: "450px" }}>
                <div
                  style={{ height: "100%", width: "100%", maxHeight: "450px" }}
                >
                  <img
                    style={{
                      width: "100%",
                      minHeight: "100%",
                      maxHeight: "422px",
                      overflow: "hidden"
                    }}
                    src={
                      "https://demo.i-wanna.com/1Label_New_Order_System/html/html/Order/ArtWork/Item/Lanius%20GmbH.jpg"
                    }
                  />
                </div>
              </CardBody>
              <CardFooter>
                <h4>Preview Item 1: LNU-LNU-LANIUS-CARE-02</h4>
              </CardFooter>
            </Card>
          </Col>
          <Col xs="12" sm="12" md="6" md="4" lg="3" xl="3">
            <Card>
              <CardBody
                style={{
                  height: "100%",
                  width: "100%",
                  maxHeight: "450px",
                  objectFit: "cover"
                }}
              >
                <div
                  style={{ height: "100%", width: "100%", maxHeight: "450px" }}
                >
                  <img
                    style={{
                      height: "100%",
                      width: "100%",
                      maxHeight: "422px",
                      overflow: "hidden"
                    }}
                    src={
                      "https://demo.i-wanna.com/1Label_New_Order_System/html/html/Order/ArtWork/Item/Nike.jpg"
                    }
                  />
                </div>
              </CardBody>
              <CardFooter>
                <h4>Preview Item 2: Ind-Ind-INDISKA-SOCK-HT</h4>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable
              data={sizeData ? sizeData : []}
              columns={sizeCols}
              noHeader
            />
            {sizeData.length <= 0 ? (
              <div
                style={{
                  display: "flex",
                  minHeight: "200px",
                  justifyContent: "center"
                }}
              >
                <div>No Data To Display</div>
              </div>
            ) : null}
          </Col>
        </Row>
      </CardBody>
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

export default PreviewAndSummary
