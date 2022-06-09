import { useState, useEffect } from "react"
import {
  Row,
  Spinner,
  Col,
  Card,
  Button,
  CardHeader,
  CardBody,
  CardFooter
} from "reactstrap"
import Footer from "../../../CommonFooter"
import axios from "@axios"
import Select from "react-select"
import DataTable from "react-data-table-component"
import { XMLParser } from "fast-xml-parser"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { connect, useDispatch } from "react-redux"
import {
  setSizeContentData,
  setWastage,
  setSizeTableTrigger
} from "@redux/actions/views/Order/POOrder"

const SizeTable = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [wastageStatus, setWastageStatus] = useState(true)
  const [wastageOptions, setWastageOptions] = useState([])
  const [loader, setLoader] = useState(true)

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

  const formatColToRow = (xmlStr) => {
    const parser = new XMLParser()
    const jsObj = parser.parse(xmlStr)
    const table = []
    const nRows = Object.keys(jsObj?.SizeMatrix?.Table[0]).length - 2 // gets the no of rows
    for (let i = 0; i < nRows; i++) {
      // for no of rows push row
      const tempRow = {}
      jsObj?.SizeMatrix?.Table.map((col) => {
        tempRow[col.Column1] = col[`Column${i + 2}`]
      })
      table.push({ ...tempRow })
    }
    return table
  }

  const handleAddResetWastage = (operation) => {
    // just to avoid computation
    if (props.wastage === 0) {
      return
    }
    try {
      // actual algo
      // iterates throuch size content data and returns the same object with modifications to size_content field
      const tempState = props.sizeContentData.map((data) => ({
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
      dispatch(setSizeContentData([...tempState]))
    } catch (err) {
      console.log("Something went wrong while processing wastage")
      dispatch(setWastage(0))
      return
    }
    if (operation === "add") {
      props.setWastageApplied(true)
      toast(`${props.wastage * 100}% Wastage Applied.`)
    } else {
      dispatch(setWastage(0))
      props.setWastageApplied(false)
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
            setSizeContentData(
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
  //   console.log("props.sizeContentData", props.sizeContentData)
  // }, [props.sizeContentData])

  useEffect(() => {
    if (props.sizeTableTrigger) {
      fetchSizeTable()
    } else {
      setLoader(false)
    }
    fetchWastageList()
  }, [])

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
            {props.sizeContentData.map((data) => (
              <Row style={{ margin: 0, marginBottom: "20px" }}>
                <DataTable
                  data={data.size_content}
                  columns={sizeCols}
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
  sizeContentData: state.poOrderReducer.sizeContentData,
  wastage: state.poOrderReducer.wastage,
  sizeTableTrigger: state.poOrderReducer.sizeTableTrigger
})

export default connect(mapStateToProps, null)(SizeTable)
