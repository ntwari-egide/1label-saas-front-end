import { useState, useEffect } from "react"
import {
  Row,
  Spinner,
  Col,
  Card,
  Button,
  Input,
  CardHeader,
  CardBody,
  CardFooter
} from "reactstrap"
import Footer from "../../../CommonFooter"
import axios from "@axios"
import Select from "react-select"
import DataTable from "react-data-table-component"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { connect, useDispatch } from "react-redux"
import {
  setSizeData,
  setWastage,
  setSizeTableTrigger,
  setWastageApplied
} from "@redux/actions/views/Order/POOrder"
import { formatColToRow } from "@utils"

const SizeTable = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [wastageStatus, setWastageStatus] = useState(true)
  const [wastageOptions, setWastageOptions] = useState([])
  const [loader, setLoader] = useState(true)
  const [cols, setCols] = useState([])

  // other functions
  const handleQtyChange = (value, col, index, tabIndex) => {
    const tempState = [...props.sizeData]
    const tempTable = tempState[tabIndex].size_content
    let tempRow = tempTable[index]
    tempRow = {
      ...tempRow,
      [`${col.selector}`]: isNaN(parseInt(value)) ? null : parseInt(value)
    }
    tempTable[index] = tempRow
    tempState[tabIndex] = {
      ...tempState[tabIndex],
      size_content: [...tempTable]
    }
    dispatch(setSizeData(tempState))
  }

  const populateCols = (table, tabIndex) => {
    // dynamically assigning cols to data-table
    const cols = []
    // pushing known static cols
    // pushing size col
    if (table.length) {
      Object.keys(table[0]).map((key) => {
        cols.push({
          name: key,
          selector: key
        })
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
              <Input
                value={
                  props.sizeData[tabIndex]
                    ? props.sizeData[tabIndex].size_content[index][col.selector]
                      ? props.sizeData[tabIndex].size_content[index][
                          col.selector
                        ]
                      : ""
                    : ""
                }
                onChange={(e) => {
                  handleQtyChange(e.target.value, col, index, tabIndex)
                }}
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
              props.sizeData[tabIndex]
                ? props.sizeData[tabIndex].size_content[index][col.selector]
                : ""
            }
            onChange={(e) => {
              const tempState = [...props.sizeData]
              const tempTable = tempState[tabIndex].size_content
              row[col.selector] = e.target.value
              tempTable[index] = row
              tempState[tabIndex] = {
                ...tempState[tabIndex],
                size_content: [...tempTable]
              }
              dispatch(setSizeData(tempState))
            }}
          />
        </div>
      )
    })
    // finally assign it to state
    return cols
  }

  const handleAddResetWastage = (operation) => {
    // just to avoid computation
    if (props.wastage === 0) {
      return
    }
    try {
      // actual algo
      // iterates throuch size content data and returns the same object with modifications to size_content field
      const tempState = props.sizeData.map((data) => ({
        ...data,
        size_content: data.size_content.map((row) => {
          const tempRow = { ...row }
          // because value 0 will escape the following loop.
          if (tempRow["QTY ITEM REF 1"] === 0) {
            tempRow["QTY ITEM REF 1 WITH WASTAGE"] = 0
          }
          if (tempRow["QTY ITEM REF 1"]) {
            if (operation === "add") {
              tempRow["QTY ITEM REF 1 WITH WASTAGE"] =
                tempRow["QTY ITEM REF 1"] +
                props.wastage * tempRow["QTY ITEM REF 1"]
              tempRow["QTY ITEM REF 1 WITH WASTAGE"] = Math.ceil(
                tempRow["QTY ITEM REF 1 WITH WASTAGE"]
              )
            } else {
              delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
            }
          }
          return tempRow
        })
      }))
      dispatch(setSizeData([...tempState]))
    } catch (err) {
      console.log("Something went wrong while processing wastage")
      dispatch(setWastage(0))
      return
    }
    if (operation === "add") {
      dispatch(setWastageApplied("Y"))
      toast(`${props.wastage * 100}% Wastage Applied.`)
    } else {
      dispatch(setWastage(0))
      dispatch(setWastageApplied("N"))
      toast("Wastage Reset.")
    }
  }

  // API Services
  const fetchSizeTable = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_key: props.combinedPOOrderKey || "",
      is_po_order_temp: props.isPoOrderTemp || ""
    }
    axios
      .post("/order/GetPOSizeTableTempList", body)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setSizeData(
              res.data.map((data) => {
                return {
                  ...data,
                  size_content: formatColToRow(data.size_content)
                }
              })
            )
          )
        }
        dispatch(setSizeTableTrigger(false))
        setLoader(false)
      })
      .catch((err) => console.log(err))
  }

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

  // useEffect(() => {
  //   console.log("props.sizeData", props.sizeData)
  // }, [props.sizeData])

  useEffect(() => {
    if (props.sizeTableTrigger) {
      fetchSizeTable()
    } else {
      setLoader(false)
    }
    fetchWastageList()
  }, [])

  useEffect(() => {
    if (!cols.length && props.sizeData.length) {
      const tempCols = []
      props.sizeData.map((data, index) => {
        tempCols[index] = populateCols(data.size_content, index)
      })
      setCols(tempCols)
    }
  }, [props.sizeData])

  useEffect(() => {
    console.log("cols", cols)
  }, [cols])

  return (
    <Card>
      <CardHeader>
        <h4>Size Table</h4>
      </CardHeader>
      <CardBody>
        {loader ? (
          <div
            style={{
              display: "flex",
              minHeight: "500px",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div>
              <Spinner color="primary" />
            </div>
          </div>
        ) : (
          <div>
            {props.sizeData.map((data, index) => (
              <Row style={{ margin: 0, marginBottom: "20px" }}>
                <DataTable
                  data={data.size_content}
                  columns={cols[index]}
                  noHeader={true}
                />
              </Row>
            ))}
          </div>
        )}
        <Row>
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
                (opt) => opt.value === props.wastage
              )}
              onChange={(e) => dispatch(setWastage(e.value))}
              isDisabled={!wastageStatus}
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
  brand: state.poOrderReducer.brand,
  sizeData: state.poOrderReducer.sizeData,
  wastage: state.poOrderReducer.wastage,
  sizeTableTrigger: state.poOrderReducer.sizeTableTrigger,
  wastageApplied: state.poOrderReducer.wastageApplied,
  selectedItems: state.poOrderReducer.selectedItems
})

export default connect(mapStateToProps, null)(SizeTable)
