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

  // other functions
  const handleQtyChange = (value, col, index, tabIndex) => {
    const tempState = [...props.sizeData]
    const tempTable = tempState[tabIndex].size_content
    let tempRow = tempTable[index]
    tempRow = {
      ...tempRow,
      [`${col.selector}`]: isNaN(parseInt(value)) ? 0 : parseInt(value)
    }
    tempTable[index] = tempRow
    tempState[tabIndex] = {
      ...tempState[tabIndex],
      size_content: [...tempTable]
    }
    dispatch(setSizeData(tempState))
  }

  const populateCols = (table, tabIndex, wastageStatus) => {
    let wastageApplied
    if (wastageStatus) {
      wastageApplied = wastageStatus
    } else {
      wastageApplied = props.wastageApplied
    }
    // dynamically assigning cols to data-table
    const cols = []
    // pushing sr no
    cols.push({
      name: "Sr No.",
      selector: "Sequence"
    })
    // pushing size col
    if (table.length) {
      Object.keys(table[0]).map((key) => {
        if (!key.includes("QTY ITEM REF") && !key.includes("Sequence")) {
          cols.push({
            name: key,
            selector: key
          })
        }
      })
    }

    // pushing item ref cols
    props.selectedItems.map((item, itm_index) => {
      cols.push({
        name: item.item_ref,
        selector:
          wastageApplied === "N"
            ? `QTY ITEM REF ${itm_index + 1}`
            : `QTY ITEM REF ${itm_index + 1} WITH WASTAGE`,
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
                disable={props.isOrderConfirmed}
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
            disable={props.isOrderConfirmed}
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
    if (operation === "add") {
      try {
        // actual algo
        // iterates throuch size content data and returns the same object with modifications to size_content field
        const tempState = props.sizeData.map((data) => ({
          ...data,
          size_content: data.size_content.map((row) => {
            Object.keys(row).map((key) => {
              if (key.includes("QTY ITEM REF")) {
                row[`${key} WITH WASTAGE`] = Math.ceil(
                  row[key] + row[key] * props.wastage
                )
              }
            })
            return row
          })
        }))
        dispatch(setWastageApplied("Y"))
        dispatch(setSizeData([...tempState]))
        // will have to recalculate cols to render
        const tempCols = []
        props.sizeData.map((data, index) => {
          tempCols[index] = populateCols(data.size_content, index, "Y")
        })
        props.setCols(tempCols)
        toast(`${props.wastage * 100}% Wastage Applied.`)
      } catch (err) {
        alert(
          "Something went wrong while processing wastage. Please try again later"
        )
        console.log("Something went wrong while processing wastage", err)
        dispatch(setWastage(0))
      }
    } else {
      const tempCols = []
      props.sizeData.map((data, index) => {
        tempCols[index] = populateCols(data.size_content, index, "N")
      })
      props.setCols(tempCols)
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
        // process and assign dynamic cols
        const tempCols = []
        props.sizeData.map((data, index) => {
          if (data.size_content?.length) {
            tempCols[index] = populateCols(data.size_content, index)
          }
        })
        props.setCols(tempCols)
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

  useEffect(() => {
    if (props.sizeTableTrigger) {
      fetchSizeTable()
    } else {
      setLoader(false)
    }
    fetchWastageList()
  }, [])

  useEffect(() => {
    if (!props.cols.length && props.sizeData.length) {
      const tempCols = []
      props.sizeData.map((data, index) => {
        if (data.size_content?.length) {
          tempCols[index] = populateCols(data.size_content, index)
        }
      })
      props.setCols(tempCols)
    }
  }, [props.sizeData])

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
                  columns={props.cols[index]}
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
              menuPlacement={"auto"}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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
              disabled={props.wastageApplied === "Y"}
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
  selectedItems: state.poOrderReducer.selectedItems,
  isOrderConfirmed: state.listReducer.isOrderConfirmed
})

export default connect(mapStateToProps, null)(SizeTable)
