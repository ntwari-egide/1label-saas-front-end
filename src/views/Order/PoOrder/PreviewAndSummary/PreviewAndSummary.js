import { useState, useEffect } from "react"
import { Input, Card, CardBody, CardFooter, Row, Col } from "reactstrap"
import DataTable from "react-data-table-component"
import Footer from "../../../CommonFooter"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import { connect, useDispatch } from "react-redux"
import {
  setSummaryTable,
  setSizeTable,
  setDefaultSizeTable,
  setSizeMatrixType,
  setSelectedItems
} from "@redux/actions/views/Order/POOrder"

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App States
  const [sizeMatrixOptions, setSizeMatrixOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [summaryCols, setSummaryCols] = useState([])

  // Other Functions
  const calculateSummaryCols = (sizeCols) => {
    const cols = []
    try {
      if (sizeCols.length) {
        sizeCols.forEach((col) => {
          const tempCol = { ...col }
          if (
            col.selector.includes("QTY ITEM REF") ||
            col.selector.includes("UPC/EAN CODE")
          ) {
            // get rid of custom input cell
            delete tempCol.cell
            cols.push(tempCol)
          } else {
            cols.push(tempCol)
          }
        })
      }
    } catch (err) {
      console.log("Something went wrong while processing summary table", err)
    }
    return cols
  }

  const calculateTotal = (itemList, summaryTable) => {
    const tempList = [...itemList]
    try {
      tempList.forEach((_, itmIndex) => {
        let total = 0
        Object.keys(summaryTable).forEach((key) => {
          summaryTable[key].forEach((row) => {
            if (row[`QTY ITEM REF ${itmIndex + 1} WITH WASTAGE`]) {
              total += parseInt(
                row[`QTY ITEM REF ${itmIndex + 1} WITH WASTAGE`]
              )
            } else if (row[`QTY ITEM REF ${itmIndex + 1}`]) {
              total += parseInt(row[`QTY ITEM REF ${itmIndex + 1}`])
            }
          })
        })
        tempList[itmIndex] = {
          ...tempList[itmIndex],
          qty: total
        }
      })
    } catch (err) {
      console.log(
        "something went wrong while processing total for item ref",
        err
      )
    }
    return tempList
  }

  const calculateSummaryTable = (sizeData) => {
    const tempState = {} // init temp state for summary data
    try {
      // get all unique content groups
      const contentGroups = [
        ...new Set(sizeData.map((data) => data.group_type))
      ]
      // for each group calculate summary table
      contentGroups.map((group) => {
        //get all the table with same group
        const tables = sizeData
          .filter((data) => data.group_type === group)
          .map((data) => data.size_content)
        // calculate summary table
        const tempTable = []
        tables.forEach((table, tIndex) => {
          table.forEach((row, rIndex) => {
            if (tIndex === 0) {
              tempTable.push({ ...row })
            } else {
              let tempRow = tempTable[rIndex]
              Object.keys(row).forEach((col) => {
                if (col.includes("QTY ITEM REF")) {
                  tempRow = {
                    ...tempRow,
                    [`${col}`]: parseInt(tempRow[col]) + parseInt(row[col])
                  }
                }
              })
              tempTable[rIndex] = tempRow
            }
          })
        })
        tempState[group] = tempTable
      })
    } catch (err) {
      console.log("Something went wrong while processing summary table", err)
    }
    return tempState
  }

  const processSummaryTable = () => {
    dispatch(setSummaryTable(calculateSummaryTable(props.sizeData)))
  }

  const processSummaryCols = () => {
    setSummaryCols(calculateSummaryCols(props.cols[0]))
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
          }
          // set default size content if available
          if (res?.data[0]?.default_size_content) {
            dispatch(setDefaultSizeTable(res?.data[0]?.default_size_content)) // to send it to invoice and delivery for save order
          }
          setLoading(false)
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSizeTableList()
    processSummaryTable()
    processSummaryCols(props.cols[0])
  }, [])

  useEffect(() => {
    if (Object.keys(props.summaryTable).length) {
      dispatch(
        setSelectedItems(
          calculateTotal(props.selectedItems, props.summaryTable)
        )
      )
    }
  }, [props.summaryTable])

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
                      src={item.layout_file || ""}
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
                            {item.qty ? item.qty : 0}
                          </Col>
                        ) : (
                          <Col style={{ textAlign: "center" }}>
                            <Input
                              value={item.qty ? item.qty : 0}
                              style={{ textAlign: "center", height: "35px" }}
                              onChange={(e) => {
                                const tempState = [...props.selectedItems]
                                tempState[index] = {
                                  ...tempState[index],
                                  qty: parseInt(e.target.value)
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
                  <div>Size Matrix Type</div>
                </div>
              </Col>
              <Col xs="12" sm="12" md="5" lg="5" xl="5">
                <Input
                  value={props.sizeMatrixType || ""}
                  onChange={(e) => {
                    // setLoading(true)
                    // fetchSizeTableDetails(e.value)
                    dispatch(setSizeMatrixType(e.target.value))
                  }}
                  disabled={true}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                {Object.keys(props.summaryTable).map((key) => (
                  <DataTable
                    key={`data-table-${key}`}
                    data={props.summaryTable[key]}
                    columns={summaryCols}
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
  sizeMatrixType: state.poOrderReducer.sizeMatrixType,
  isOrderConfirmed: state.listReducer.isOrderConfirmed
})

export default connect(mapStateToProps, null)(PreviewAndSummary)
