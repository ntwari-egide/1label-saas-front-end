import { useState, useEffect } from "react"
import {
  Row,
  Spinner,
  Col,
  Card,
  Label,
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
  setWastageApplied,
  setCols
} from "@redux/actions/views/Order/POOrder"
import { formatColToRow } from "@utils"

const SizeTable = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [wastageStatus, setWastageStatus] = useState(true)
  const [wastageOptions, setWastageOptions] = useState([])
  const [loader, setLoader] = useState(true)

  // other functions
  const handleAddResetWastage = (operation) => {
    if (operation === "add") {
      try {
        // actual algo
        // iterates throuch size content data and returns the same object with modifications to size_content field
        const tempState = props.sizeData.map((data) => ({
          ...data,
          size_content: data.size_content.map((row) => {
            Object.keys(row).map((key) => {
              if (row[key]) {
                // subtracting 0.05 because want to round at 0.55 instead of 0.5
                if (key.includes("QTY ITEM REF")) {
                  if (props.wastageApplied === "N") {
                    const value = Math.round(
                      parseInt(row[key]) +
                        parseInt(row[key]) * props.wastage -
                        0.05
                    )
                    row[`${key} WITH WASTAGE`] = value.toString()
                  }
                  if (
                    key.includes("WITH WASTAGE") &&
                    props.wastageApplied === "Y"
                  ) {
                    const value = Math.round(
                      parseInt(row[key]) +
                        parseInt(row[key]) * props.wastage -
                        0.05
                    )
                    row[`${key}`] = value.toString()
                  }
                }
              }
            })
            return row
          })
        }))
        dispatch(setWastageApplied("Y"))
        dispatch(setSizeData([...tempState]))
        // will have to recalculate cols to render
        dispatch(setCols(props.sizeData, "Y"))
        toast(`${props.wastage * 100}% Wastage Applied.`)
      } catch (err) {
        alert(
          "Something went wrong while processing wastage. Please try again later"
        )
        console.log("Something went wrong while processing wastage", err)
        dispatch(setWastage(0))
      }
    } else {
      if (!props.originalSizeData.length) {
        setLoader(true)
        fetchSizeTable()
      } else {
        dispatch(setSizeData([...props.originalSizeData]))
      }
      // recalculate dynamic cols
      // const tempCols = []
      // props.sizeData.forEach((data, index) => {
      //   tempCols[index] = populateCols(data.size_content, index, "N")
      // })
      // dispatch(setCols(tempCols))
      dispatch(setCols(props.sizeData, "N"))
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
      .then(async (res) => {
        if (res.status === 200) {
          const tempState = await Promise.all(
            res.data.map(async (data) => {
              const size_content = await formatColToRow(data.size_content)
              return {
                ...data,
                size_content
              }
            })
          )
          dispatch(setSizeData(tempState))
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

  useEffect(() => {
    if (props.sizeTableTrigger) {
      fetchSizeTable()
    } else {
      // because its true by default
      setLoader(false)
    }
    fetchWastageList()
  }, [])

  useEffect(() => {
    if (!props.cols.length && props.sizeData.length) {
      dispatch(setCols(props.sizeData, props.wastageApplied))
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
              <Row
                style={{ margin: 0, marginBottom: "20px" }}
                key={data?.size_matrix_type}
              >
                <Col>
                  <Row style={{ paddingBottom: "5px" }}>
                    <Col
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{ paddingLeft: 0 }}
                    >
                      <Label>Size Matrix Type</Label>
                      <h5>{data?.size_matrix_type}</h5>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={6}
                      lg={3}
                      xl={3}
                      style={{ paddingLeft: 0 }}
                    >
                      <Label>EDI Order no.</Label>
                      <h5>{data?.edi_order_no}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <DataTable
                      data={data?.size_content}
                      columns={props.cols[index]}
                      noHeader={true}
                    />
                  </Row>
                </Col>
              </Row>
            ))}
          </div>
        )}
        {wastageStatus ? (
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
                menuPlacement={"auto"}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                isDisabled={props.isOrderConfirmed}
                isLoading={!wastageOptions.length}
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
        ) : (
          <></>
        )}
      </CardBody>
      <CardFooter>
        <Footer
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          stepperMenu={props.stepperMenu}
        />
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  brand: state.poOrderReducer.brand,
  sizeData: state.poOrderReducer.sizeData,
  originalSizeData: state.poOrderReducer.originalSizeData,
  wastage: state.poOrderReducer.wastage,
  sizeTableTrigger: state.poOrderReducer.sizeTableTrigger,
  wastageApplied: state.poOrderReducer.wastageApplied,
  selectedItems: state.poOrderReducer.selectedItems,
  cols: state.poOrderReducer.cols,
  isOrderConfirmed: state.listReducer.isOrderConfirmed
})

export default connect(mapStateToProps, null)(SizeTable)
