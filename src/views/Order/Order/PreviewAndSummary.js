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
  setSelectedItems
} from "@redux/actions/views/Order/Order"
import { formatColToRow } from "@utils"
import { store } from "@redux/storeConfig/store"

const CustomInput = (props) => {
  const dispatch = useDispatch()
  const handleQtyChange = (value, row, col, index) => {
    const tempState = [...store.getState().orderReducer.sizeData]
    if (value === "") {
      row[col.selector] = 0
    }
    if (value != "" && parseInt(value)) {
      // update the table
      row[col.selector] = parseInt(value)
    }
    tempState[index] = row
    console.log("dispatch data", tempState)
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
      total: tempTotal
    }
    dispatch(setSelectedItems(tempRef))
  }

  return (
    <Input
      value={
        store.getState().orderReducer.sizeData[props.index]
          ? store.getState().orderReducer.sizeData[props.index][
              props.col.selector
            ]
          : ""
      }
      onChange={(e) => {
        handleQtyChange(e.target.value, props.row, props.col, props.index)
        calculateTotal(props.col, props.itm_index)
      }}
    />
  )
}

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App States
  const [sizeMatrixOptions, setSizeMatrixOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [cols, setCols] = useState([])
  const [wastageStatus, setWastageStatus] = useState(false)
  const [wastageOptions, setWastageOptions] = useState([])

  // other functions
  const populateCols = (xmlStr) => {
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
    props.selectedItems.map((_, itm_index) => {
      cols.push({
        name: `QTY ITEM REF ${itm_index}`,
        selector: `QTY ITEM REF ${itm_index}`,
        cell: (row, index, col) => {
          return (
            <div>
              <CustomInput
                row={row}
                col={col}
                index={index}
                itm_index={itm_index}
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
            value={
              store.getState().orderReducer.sizeData[index]
                ? store.getState().orderReducer.sizeData[index][col.selector]
                : ""
            }
            onChange={(e) => {
              const tempState = [...store.getState().orderReducer.sizeData]
              row[col.selector] = e.target.value
              tempState[index] = row
              dispatch(setSizeData(tempState))
            }}
          />
        </div>
      )
    })
    // finally assign it to state
    setCols(cols)
  }

  const handleAddResetWastage = (operation) => {
    // just to avoid computation
    if (props.wastage === 0) {
      return
    }
    if (operation === "add") {
      try {
        // actual algo
        // iterates throuch size content data and returns the same object with modifications to size_content field
        const tempState = props.sizeData.map((row) => {
          Object.keys(row).map((key) => {
            if (key.includes("QTY ITEM REF")) {
              row[key] += row[key] * props.wastage
              row[key] = Math.ceil(row[key])
            }
          })
          return row
        })
        // dispatch new state
        dispatch(setSizeData(tempState))
        // re-calculate total for itemRef
        const tempRefState = props.selectedItems.map((item, index) => {
          let total = 0
          props.sizeData.map((row) => {
            if (row[`QTY ITEM REF ${index}`]) {
              total += row[`QTY ITEM REF ${index}`]
            }
          })
          return { ...item, total }
        })
        dispatch(setSizeData(tempRefState))
        // will need to re-calculate cols to render latest changes
        populateCols(props.sizeTable)
      } catch (err) {
        console.log("Something went wrong while processing wastage", err)
        dispatch(setWastage(0))
        return
      }
      dispatch(setWastageApplied("Y"))
      toast(`${props.wastage * 100}% Wastage Applied.`)
    } else {
      dispatch(setWastage(0))
      dispatch(setWastageApplied("N"))
      toast("Wastage Reset.")
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
            setWastageStatus(true)
          } else {
            setWastageStatus(false)
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
          console.log("res", res)
          const size_content = res.data[0]?.size_content
          const default_content = res.data[0]?.default_size_content
          const size_matrix = res.data[0]?.size_matrix_type
          try {
            if (size_content) {
              dispatch(setSizeTable(size_content)) // to send it to invoice and delivery for save order
              dispatch(setSizeData(formatColToRow(size_content)))
              dispatch(setSizeMatrixType(size_matrix)) // to send it to invoice and delivery for save order
            }
            // set default size content if available
            if (default_content) {
              dispatch(setDefaultSizeTable(default_content)) // to send it to invoice and delivery for save order
              dispatch(setDefaultSizeData(formatColToRow(default_content)))
            }
          } catch (err) {
            console.log(err)
          }
        }
        setLoading(false)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSizeTableList()
    fetchWastageList()

    // will need to re-calculate cols on each re-visit
    if (props.sizeData.length) {
      populateCols(props.sizeTable)
    }

    return () => {
      // because need to re-calculate cols on each re-visit
      setCols([])
    }
  }, [])

  useEffect(() => {
    // to calculate when change in sizeData
    if (props.sizeData?.length && props.sizeTable?.length && !cols.length) {
      populateCols(props.sizeTable)
    }
  }, [props.sizeData])

  useEffect(() => {
    console.log("cols", cols)
  }, [cols])

  return (
    <Card>
      <CardBody>
        <Row>
          {props.selectedItems.map((itm) => (
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
                      src={
                        "https://demo.i-wanna.com/1Label_New_Order_System/html/html/Order/ArtWork/Item/Lanius%20GmbH.jpg"
                      }
                    />
                  </div>
                </CardBody>
                <CardFooter>
                  <Row>
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
                    <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Row>
                        <Col style={{ textAlign: "center" }}>Total QTY</Col>
                      </Row>
                      <Row>
                        <Col style={{ textAlign: "center" }}>
                          {itm.total ? itm.total : 0}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          ))}
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
              value={sizeMatrixOptions.filter(
                (opt) => opt.value === props.sizeMatrixSelect.value
              )}
              options={sizeMatrixOptions}
              onChange={(e) => {
                setLoading(true)
                setCols([])
                fetchSizeTableDetails(e.value)
                props.setSizeMatrixSelect(e)
              }}
              menuPlacement={"auto"}
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
              <DataTable data={props.sizeData} columns={cols} />
            )}
          </Col>
        </Row>
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
              onChange={(e) => dispatch(setWastage(parseFloat(e.value)))}
              isDisabled={!wastageStatus}
              menuPlacement={"auto"}
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
            >
              Reset Wastage
            </Button>
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

const mapStateToProps = (state) => ({
  brand: state.orderReducer.brand,
  selectedItems: state.orderReducer.selectedItems,
  sizeMatrixType: state.orderReducer.sizeMatrixType,
  sizeTable: state.orderReducer.sizeTable,
  defaultSizeTable: state.orderReducer.defaultSizeTable,
  sizeData: state.orderReducer.sizeData,
  defaultSizeData: state.orderReducer.defaultSizeData,
  wastage: state.orderReducer.wastage
})

export default connect(mapStateToProps, null)(PreviewAndSummary)
