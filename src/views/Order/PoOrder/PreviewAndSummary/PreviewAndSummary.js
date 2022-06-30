import { useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Spinner, Row, Col } from "reactstrap"
import DataTable from "react-data-table-component"
import Select from "react-select"
import Footer from "../../../CommonFooter"
import { XMLParser } from "fast-xml-parser"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import {
  setSummaryTable,
  setSizeTable,
  setDefaultSizeTable,
  setSizeMatrixType
} from "@redux/actions/views/Order/POOrder"
import { calculateSummaryTable } from "@utils"

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App States
  const [sizeData, setSizeData] = useState([])
  const [defaultSizeData, setDefaultSizeData] = useState(null)
  const [sizeMatrixOptions, setSizeMatrixOptions] = useState([])
  const [loading, setLoading] = useState(false)

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
      selector:
        props.wastageApplied === "Y"
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

  const processSummaryTable = () => {
    dispatch(
      setSummaryTable(calculateSummaryTable(structuredClone(props.sizeData)))
    )
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

  const fetchSizeTableDetails = (guid_key) => {
    setLoading(true)
    const body = {
      guid_key
    }
    axios
      .post("/SizeTable/GetSizeTableDetail", body)
      .then((res) => {
        if (res.status === 200) {
          //  set size content if available
          if (res?.data[0]?.size_content) {
            dispatch(setSizeTable(res?.data[0]?.size_content)) // to send it to invoice and delivery for save order
            dispatch(setSizeMatrixType(res.data[0]?.size_matrix_type)) // to send it to invoice and delivery for save order
            setSizeData(formatColToRow(res?.data[0]?.size_content))
          }
          // set default size content if available
          if (res?.data[0]?.default_size_content) {
            dispatch(setDefaultSizeTable(res?.data[0]?.default_size_content)) // to send it to invoice and delivery for save order
            setDefaultSizeData(
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
    processSummaryTable()
  }, [])

  return (
    <Card>
      <CardBody>
        <Row>
          {props.selectedItems.map((item) => (
            <Col xs="12" sm="12" md="6" md="4" lg="3" xl="3">
              <Card>
                <CardBody style={{ minHeight: "450px", maxHeight: "450px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      maxHeight: "450px"
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        minHeight: "100%",
                        maxHeight: "422px",
                        overflow: "hidden"
                      }}
                      src={item.layout_file ? item.layout_file : ""}
                    />
                  </div>
                </CardBody>
                <CardFooter>
                  <Row style={{ height: "60px" }}>
                    <Col
                      xs={8}
                      sm={8}
                      md={8}
                      lg={8}
                      xl={8}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div>
                        <h5>{item.item_ref}</h5>
                      </div>
                    </Col>
                    <Col
                      xs={4}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around"
                      }}
                    >
                      <Row>
                        <Col style={{ textAlign: "center" }}>Total QTY</Col>
                      </Row>
                      <Row>
                        {item.is_non_size === "N" ? (
                          <Col style={{ textAlign: "center" }}>
                            {item.total ? item.total : 0}
                          </Col>
                        ) : (
                          <Col style={{ textAlign: "center" }}>
                            <Input
                              value={item.total ? item.total : 0}
                              style={{ textAlign: "center", height: "35px" }}
                              onChange={(e) => {
                                const tempState = [...props.selectedItems]
                                tempState[index] = {
                                  ...tempState[index],
                                  total: parseInt(e.target.value)
                                }
                                dispatch(setSelectedItems(tempState))
                              }}
                              disabled={props.isOrderConfirmed}
                            />
                          </Col>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
        {props.brandDetails.display_SizeTable === "Y" ? (
          <div>
            <Row style={{ marginBottom: "10px", marginTop: "10px" }}>
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
                  menuPlacement={"auto"}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  isDisabled={props.isOrderConfirmed}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                {Object.keys(props.summaryTable).map((key) => (
                  <DataTable
                    data={props.summaryTable[key]}
                    columns={sizeCols}
                    noHeader={true}
                  />
                ))}
              </Col>
            </Row>
          </div>
        ) : (
          <></>
        )}
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

const mapStateToProps = (state) => ({
  brand: state.poOrderReducer.brand,
  selectedItems: state.poOrderReducer.selectedItems,
  sizeData: state.poOrderReducer.sizeData,
  summaryTable: state.poOrderReducer.summaryTable,
  defaultSizeTable: state.poOrderReducer.defaultSizeTable,
  wastageApplied: state.poOrderReducer.wastageApplied,
  brandDetails: state.poOrderReducer.brandDetails,
  isOrderConfirmed: state.listReducer.isOrderConfirmed
})

export default connect(mapStateToProps, null)(PreviewAndSummary)
