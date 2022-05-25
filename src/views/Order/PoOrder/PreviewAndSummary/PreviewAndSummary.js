import { useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Spinner, Row, Col } from "reactstrap"
import DataTable from "react-data-table-component"
import Select from "react-select"
import Footer from "../../../CommonFooter"
import { XMLParser } from "fast-xml-parser"
import axios from "@axios"
import { useTranslation } from "react-i18next"

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  // App States
  const [sizeData, setSizeData] = useState([])
  const [defaultSizeData, setDefaultSizeData] = useState(null)
  const [sizeMatrixOptions, setSizeMatrixOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialSummaryProcessing, setInitialSummaryProcessing] = useState(true)
  const [summaryTable, setSummaryTable] = useState({})

  const sizeCols = [
    {
      name: t("SIZE DESCRIPTION"),
      selector: "Size Description",
      sortable: true
    },
    {
      name: t("SIZE"),
      selector: "Size",
      sortable: true
    },
    {
      name: t("SUPPLIER REF"),
      selector: "Supplier Ref",
      sortable: false
    },
    {
      name: t("SUPPLIER COLOR"),
      selector: "Supplier Colour",
      sortable: false
    },
    {
      name: t("OPTION ID"),
      selector: "Option ID",
      sortable: false
    },
    {
      name: t("BUYING GROUP ID"),
      selector: "Buying Group ID",
      sortable: false
    },
    {
      name: t("PRODUCT GROUP DESCRIPTION"),
      selector: "Product Group Description",
      width: "200px",
      sortable: false
    },
    {
      name: t("SKU Code"),
      selector: "SKU Code",
      sortable: false
    },
    {
      name: t("STYLE NUMBER"),
      selector: "Style Number",
      sortable: false
    },
    {
      name: t("BARCODE"),
      selector: "Barcode",
      sortable: false
    },
    {
      name: t("ASBAR1"),
      selector: props.wastageApplied
        ? "QTY ITEM REF 1 WITH WASTAGE"
        : "QTY ITEM REF 1"
    },
    {
      name: t("QTY ITEM REF 2"),
      selector: "QTY ITEM REF 2"
    },
    {
      name: t("QTY ITEM REF 3"),
      selector: "QTY ITEM REF 3"
    },
    {
      name: t("QTY ITEM REF 4"),
      selector: "QTY ITEM REF 4"
    },
    {
      name: t("QTY ITEM REF 5"),
      selector: "QTY ITEM REF 5"
    },
    {
      name: t("QTY ITEM REF 6"),
      selector: "QTY ITEM REF 6"
    },
    {
      name: t("QTY ITEM REF 7"),
      selector: "QTY ITEM REF 7"
    },
    {
      name: t("QTY ITEM REF 8"),
      selector: "QTY ITEM REF 8"
    },
    {
      name: t("QTY ITEM REF 9"),
      selector: "QTY ITEM REF 9"
    },
    {
      name: t("QTY ITEM REF 10"),
      selector: "QTY ITEM REF 10"
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

  const calculateSummaryTable = () => {
    const tempState = {}
    Object.keys(props.sizeContentData).map((key) => {
      const tempData = []
      props.sizeContentData[key].map((table, tabIndex) => {
        table.map((row, index) => {
          // initialize for first table else add to existing
          if (tabIndex === 0) {
            tempData.push(row)
          } else {
            let col = "QTY ITEM REF 1"
            if (tempData[index]["QTY ITEM REF 1 WITH WASTAGE"]) {
              col = "QTY ITEM REF 1 WITH WASTAGE"
            }
            if (row[col]) {
              const tempRow = { ...tempData[index] }
              tempRow[col] += row[col]
              tempData[index] = tempRow
            }
          }
        })
      })
      tempState[key] = tempData
    })
    setSummaryTable({ ...tempState })
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
          setSizeMatrixOptions(
            res.data.map((sz) => ({
              value: sz.guid_key,
              label: sz.size_matrix_type
            }))
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchSizeTableDetails = () => {
    setLoading(true)
    const body = {
      guid_key: 134023
    }
    axios
      .post("/SizeTable/GetSizeTableDetail", body)
      .then((res) => {
        if (res.status === 200) {
          //  set size content if available
          if (res?.data[0]?.size_content) {
            props.setSizeTable(res?.data[0]?.size_content) // to send it to invoice and delivery for save order
            props.setSizeMatrixType(res.data[0]?.size_matrix_type) // to send it to invoice and delivery for save order
            setSizeData(formatColToRow(res?.data[0]?.size_content))
            console.log(
              "processed data",
              formatColToRow(res?.data[0]?.size_content)
            )
          }
          // set default size content if available
          if (res?.data[0]?.default_size_content) {
            props.setDefaultSizeTable(res?.data[0]?.default_size_content) // to send it to invoice and delivery for save order
            setDefaultSizeData(
              formatColToRow(res?.data[0]?.default_size_content)
            )
            console.log(
              "processed data",
              formatColToRow(res?.data[0]?.default_size_content)
            )
          }
          setLoading(false)
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSizeTableList()
    calculateSummaryTable()
  }, [])

  // useEffect(() => {
  //   console.log("sizeData", sizeData)
  // }, [sizeData])

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
            {Object.keys(summaryTable).map((key) => (
              <DataTable
                data={summaryTable[key]}
                columns={sizeCols}
                noHeader={true}
              />
            ))}
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col
            xs="12"
            sm="12"
            md="3"
            lg="1.5"
            xl="1.5"
            style={{
              marginRight: "0px",
              paddingRight: "0px",
              maxWidth: "150px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                height: "100%",
                alignItems: "center"
              }}
            >
              <div>Size Matrix Type:</div>
            </div>
          </Col>
          <Col xs="12" sm="12" md="5" lg="5" xl="5">
            <Select
              className="React"
              classNamePrefix="select"
              options={sizeMatrixOptions}
              onChange={(e) => {
                setLoading(true)
                fetchSizeTableDetails(e.value)
              }}
            />
          </Col>
        </Row>
        {/*}
        <Row>
          <Col>
            {sizeData.length > 0 ? (
              <DataTable
                progressPending={loading}
                progressComponent={<Spinner />}
                data={sizeData}
                columns={sizeCols}
              />
            ) : null}
          </Col>
        </Row>
    */}
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
