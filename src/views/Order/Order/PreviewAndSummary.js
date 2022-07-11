import { useState, useEffect } from "react"
import {
  Card,
  Input,
  CardBody,
  CardFooter,
  Spinner,
  Row,
  Col,
  Button
} from "reactstrap"
import DataTable from "react-data-table-component"
import Select from "react-select"
import Footer from "../../CommonFooter"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import { useDispatch, connect } from "react-redux"
import { XMLParser } from "fast-xml-parser"
import { toast } from "react-toastify"
import {
  setSizeMatrixType,
  setSizeTable,
  setDefaultSizeTable,
  setSizeData,
  setWastage,
  setDefaultSizeData,
  setWastageApplied,
  setCols,
  setSelectedItems
} from "@redux/actions/views/Order/Order"
import { formatColToRow } from "@utils"
import { store } from "@redux/storeConfig/store"
import { resetTotal } from "@utils"

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App States
  const [sizeMatrixOptions, setSizeMatrixOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showWastage, setShowWastage] = useState(false)
  const [wastageOptions, setWastageOptions] = useState([])
  const [showSizeData, setShowSizeData] = useState(true)

  // other functions
  const handleQtyChange = (value, row, col, index) => {
    const tempState = [...store.getState().orderReducer.sizeData]
    // update the table
    row = { ...row, [`${col.selector}`]: parseInt(value) }
    tempState[index] = row
    dispatch(setSizeData(tempState))
  }

  const calculateTotal = (col, itm_index) => {
    // update the total in item card
    const tempRef = [...store.getState().orderReducer.selectedItems]
    const tempTotal = store
      .getState()
      .orderReducer.sizeData.map((row) => row[col.selector])
      .reduce((a, b) => {
        if (a && b) {
          return a + b
        } else {
          return a ? a : b ? b : 0
        }
      })
    tempRef[itm_index] = {
      ...tempRef[itm_index],
      qty: tempTotal
    }
    dispatch(setSelectedItems(tempRef))
  }

  const populateCols = (xmlStr, wastageStatus) => {
    let wastageApp
    if (wastageStatus) {
      wastageApp = wastageStatus
    } else {
      wastageApp = props.wastageApplied
    }
    // dynamically assigning cols to data-table
    const parser = new XMLParser()
    const jsObj = parser.parse(xmlStr)
    const cols = []
    // pushing known static cols
    cols.push({
      name: "Sr No.",
      selector: "Sequence"
    })
    // pushing size col
    if (jsObj?.SizeMatrix?.Table[0]) {
      jsObj?.SizeMatrix?.Table?.map((col) => {
        cols.push({
          name: String(col.Column1),
          selector: String(col.Column1)
        })
      })
    } else {
      cols.push({
        name: String(jsObj?.SizeMatrix?.Table?.Column1),
        selector: String(jsObj?.SizeMatrix?.Table?.Column1)
      })
    }
    // pushing item ref cols
    props.selectedItems.map((item, itm_index) => {
      cols.push({
        name: item.item_ref,
        selector:
          wastageApp === "N"
            ? `QTY ITEM REF ${itm_index + 1}`
            : `QTY ITEM REF ${itm_index + 1} WITH WASTAGE`,
        cell: (row, index, col) => {
          return (
            <div>
              <Input
                key={`${index}-${col?.selector}`}
                id={`${index}-${col?.selector}`}
                value={row[col.selector] ? row[col.selector] : ""}
                onChange={(e) => {
                  handleQtyChange(e.target.value, row, col, index)
                  calculateTotal(col, itm_index)
                }}
                disabled={item.is_non_size === "Y" || props.isOrderConfirmed}
              />
            </div>
          )
        }
      })
    })
    cols.push({
      name: "UPC/EAN CODE",
      selector: "UPC/EAN CODE",
      cell: (row, index, col) => (
        <div>
          <Input
            value={row[col.selector]}
            onChange={(e) => {
              const tempState = [...store.getState().orderReducer.sizeData]
              row = { ...row, [`${col.selector}`]: e.target.value }
              tempState[index] = row
              dispatch(setSizeData(tempState))
            }}
            disabled={props.isOrderConfirmed}
          />
        </div>
      )
    })
    // finally assign it to state
    dispatch(setCols(cols))
  }

  const handleAddResetWastage = (operation) => {
    // just to avoid computation
    if (props.wastage === 0) {
      return
    }
    if (operation === "add") {
      // adding wastage to sizeData
      try {
        // actual algo
        // iterates throuch size content data and returns the same object with modifications to size_content field
        const tempState = props.sizeData.map((row) => {
          Object.keys(row).map((key) => {
            // subtracting 0.06 because want to round at 0.55 instead of 0.5
            if (key.includes("QTY ITEM REF")) {
              if (props.wastageApplied === "N") {
                row[`${key} WITH WASTAGE`] = Math.round(
                  row[key] + row[key] * props.wastage - 0.05
                )
              }
              if (
                props.wastageApplied === "Y" &&
                key.includes("WITH WASTAGE")
              ) {
                row[`${key}`] = Math.round(
                  row[key] + row[key] * props.wastage - 0.05
                )
              }
            }
          })
          return row
        })
        // dispatch new state
        dispatch(setSizeData([...tempState]))
        // re-calculate total for itemRef
        const tempRefState = props.selectedItems.map((item, index) => {
          let total = 0
          tempState.map((row) => {
            if (row[`QTY ITEM REF ${index + 1} WITH WASTAGE`]) {
              total += row[`QTY ITEM REF ${index + 1} WITH WASTAGE`]
            }
          })
          return { ...item, qty: total }
        })
        dispatch(setSelectedItems(tempRefState))
        // will need to re-calculate cols to render latest changes
        populateCols(props.sizeTable, "Y")
        dispatch(setWastageApplied("Y"))
      } catch (err) {
        console.log("Something went wrong while processing wastage", err)
        alert(
          "Something went wrong while processing wastage. Please try again later"
        )
        dispatch(setWastage(0))
        return
      }
      toast(`${props.wastage * 100}% Wastage Applied.`)
    } else {
      try {
        // re calculate total for selected items in case wastage was applied
        if (props.wastageApplied === "Y") {
          const tempRefState = props.selectedItems.map((item, index) => {
            let total = 0
            props.sizeData.map((row) => {
              if (row[`QTY_ITEM_REF_${index}`]) {
                total += row[`QTY_ITEM_REF_${index}`]
              }
            })
            return { ...item, qty: total }
          })
          dispatch(setSelectedItems(tempRefState))
        }
        // will need to recalculate cols since change in selector field
        populateCols(props.sizeTable, "N")
        dispatch(setWastage(0))
        dispatch(setWastageApplied("N"))
        toast("Wastage Reset.")
      } catch (err) {
        console.log("Something went wrong while resetting wastage", err)
        alert(
          "Something went wrong while resetting wastage. Please try again later"
        )
      }
    }
  }

  // API Sevices
  const fetchWastageList = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : ""
    }
    axios
      .post("/Brand/GetWastageList", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data[0]?.show_status === "Y") {
            setShowWastage(true)
          } else {
            setShowWastage(false)
          }
          setWastageOptions(res.data[0]?.wastage_value)
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchSizeTableList = () => {
    const body = {
      brand_key: props.brand?.value,
      item_key: props.selectedItems.map((item) => item.guid_key),
      query_str: ""
    }
    axios
      .post("/SizeTable/GetSizeTableList", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length) {
            setSizeMatrixOptions(
              res.data.map((sz) => ({
                value: sz.guid_key,
                label: sz.size_matrix_type
              }))
            )
          } else {
            // do not render size table section if no size matrix options
            setShowSizeData(false)
            // reset size table data if no size matrix options.
            dispatch(setSizeData([]))
          }
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
      .then(async (res) => {
        if (res.status === 200) {
          //  set size content if available
          const size_content = res.data[0]?.size_content
          const default_content = res.data[0]?.default_size_content
          const size_matrix = res.data[0]?.size_matrix_type
          if (size_content) {
            dispatch(setSizeTable(size_content)) // to send it to invoice and delivery for save order
            dispatch(setSizeData(await formatColToRow(size_content)))
            dispatch(setSizeMatrixType(size_matrix)) // to send it to invoice and delivery for save order
          }
          // set default size content if available
          if (default_content) {
            dispatch(setDefaultSizeTable(default_content)) // to send it to invoice and delivery for save order
            dispatch(setDefaultSizeData(await formatColToRow(default_content)))
          }
        }
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSizeTableList()
    fetchWastageList()
  }, [])

  useEffect(() => {
    // to calculate when change in size matrix type
    if (
      !props.cols.length &&
      props.sizeData?.length &&
      props.sizeTable?.length
    ) {
      populateCols(props.sizeTable)
    }
  }, [props.sizeData])

  return (
    <Card>
      <CardBody>
        <Row>
          {props.selectedItems.map((itm, index) => (
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
                      src={itm.layout_file || ""}
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
                        <h5>{itm.item_ref}</h5>
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
                        {itm.is_non_size === "N" ? (
                          <Col style={{ textAlign: "center" }}>
                            {itm.qty ? itm.qty : 0}
                          </Col>
                        ) : (
                          <Col style={{ textAlign: "center" }}>
                            <Input
                              value={itm.qty ? itm.qty : 0}
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
          showSizeData ? (
            <div>
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
                    value={sizeMatrixOptions.filter(
                      (opt) => opt.label === props.sizeMatrixType
                    )}
                    options={sizeMatrixOptions}
                    onChange={(e) => {
                      setLoading(true)
                      dispatch(setCols([]))
                      fetchSizeTableDetails(e.value)
                      dispatch(setSizeMatrixType(e.label))
                      // reset total for selected items
                      dispatch(
                        setSelectedItems(resetTotal([...props.selectedItems]))
                      )
                    }}
                    menuPlacement={"auto"}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 })
                    }}
                    isDisabled={props.isOrderConfirmed}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px"
                      }}
                    >
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <div style={{ minHeight: "175px" }}>
                      <DataTable
                        data={props.sizeData}
                        columns={props.cols}
                        noHeader={true}
                        persistTableHead={true}
                        noDataComponent={
                          <div style={{ padding: "20px" }}>
                            <h5>Select a size matrix type to display data.</h5>
                          </div>
                        }
                      />
                    </div>
                  )}
                </Col>
              </Row>
              {showWastage ? (
                <Row style={{ marginTop: "20px" }}>
                  <Col xs="12" sm="12" md="2" lg="1" xl="1">
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        alignItems: "center"
                      }}
                    >
                      <div>Wastage:</div>
                    </div>
                  </Col>
                  <Col xs="12" sm="12" md="3" lg="2" xl="2">
                    <Select
                      className="React"
                      classNamePrefix="select"
                      options={wastageOptions}
                      value={wastageOptions.filter(
                        (opt) => opt.value === `${props.wastage}`
                      )}
                      onChange={(e) =>
                        dispatch(setWastage(parseFloat(e.value)))
                      }
                      isDisabled={!showWastage}
                      menuPlacement={"auto"}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                      }}
                      isDisabled={props.isOrderConfirmed}
                    />
                  </Col>
                  <Col xs="12" sm="12" md="7" lg="4" xl="4">
                    <Button
                      color="primary"
                      style={{
                        marginRight: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px"
                      }}
                      onClick={() => handleAddResetWastage("add")}
                    >
                      Add Wastage
                    </Button>
                    <Button
                      color="primary"
                      style={{ paddingLeft: "10px", paddingRight: "10px" }}
                      onClick={() => handleAddResetWastage("reset")}
                      disabled={props.wastaje === 0}
                    >
                      Reset Wastage
                    </Button>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
            </div>
          ) : null
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
  brand: state.orderReducer.brand,
  selectedItems: state.orderReducer.selectedItems,
  sizeMatrixType: state.orderReducer.sizeMatrixType,
  sizeTable: state.orderReducer.sizeTable,
  defaultSizeTable: state.orderReducer.defaultSizeTable,
  sizeData: state.orderReducer.sizeData,
  defaultSizeData: state.orderReducer.defaultSizeData,
  wastage: state.orderReducer.wastage,
  cols: state.orderReducer.cols,
  wastageApplied: state.orderReducer.wastageApplied,
  brandDetails: state.orderReducer.brandDetails,
  sizeTable: state.orderReducer.sizeTable,
  isOrderConfirmed: state.listReducer.isOrderConfirmed
})

export default connect(mapStateToProps, null)(PreviewAndSummary)
