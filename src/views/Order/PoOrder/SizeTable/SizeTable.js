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

const SizeTable = (props) => {
  const { t } = useTranslation()
  const [wastageStatus, setWastageStatus] = useState(true)
  const [wastageOptions, setWastageOptions] = useState([])
  const [wastage, setWastage] = useState(0)
  const [loader, setLoader] = useState(false)
  const [wastageApplied, setWastageApplied] = useState(false)

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
      selector: wastageApplied
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
    const nRows = Object.keys(jsObj?.SizeMatrix?.Table).length - 2 // gets the no of rows
    let data = [] // initialized data to fill row by row
    let currentRow = 0 + 2 // because actual data begins at Column2
    for (let i = 0; i < nRows; i++) {
      let row = {} // initialise empty row
      jsObj?.SizeMatrix?.Table?.map((col) => {
        row[col["Column1"]] = col[`Column${currentRow}`] // row[column_name] = column_value
      })
      data.push(row) // push the row to data
      currentRow += 1 // increment row count
    }
    return data
  }

  const handleAddResetWastage = (operation) => {
    // just to avoid computation
    if (wastage === 0) {
      return
    }
    // actual algo
    const tempData = props.sizeContentData.map((table) => {
      const newTable = table.map((row) => {
        const tempRow = row
        // because following loop escapes when value is 0
        if (tempRow["QTY ITEM REF 1"] === 0) {
          tempRow["QTY ITEM REF 1 WITH WASTAGE"] = 0
        }
        if (tempRow["QTY ITEM REF 1"]) {
          if (operation === "add") {
            tempRow["QTY ITEM REF 1 WITH WASTAGE"] =
              tempRow["QTY ITEM REF 1"] + wastage * tempRow["QTY ITEM REF 1"]
            tempRow["QTY ITEM REF 1 WITH WASTAGE"] = Math.ceil(
              tempRow["QTY ITEM REF 1 WITH WASTAGE"]
            )
          } else {
            delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          }
        }
        return tempRow
      })
      return newTable
    })
    props.setSizeContentData(tempData)
    if (operation === "add") {
      setWastageApplied(true)
    } else {
      setWastage(0)
      setWastageApplied(false)
    }
  }

  // API Services
  const fetchSizeTable = () => {
    const body = {
      brand_key: props.brand ? props.brand.value : "",
      order_key: props.combinedPOOrderKey || "",
      is_po_order_temp: props.isPoOrderTemp || ""
    }
    const tempState = {}
    axios
      .post("/order/GetPOSizeTableTempList", body)
      .then((res) => {
        setLoader(true)
        if (res.status === 200) {
          res.data.map((dt, index) => {
            if (dt.size_content) {
              // if exists then push else initialize
              if (tempState[dt.group_type]) {
                tempState[dt.group_type].push(formatColToRow(dt.size_content))
              } else {
                tempState[dt.group_type] = [formatColToRow(dt.size_content)]
              }
            }
          })
        }
        props.setSizeContentData({ ...tempState })
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
    console.log("size table", props.sizeContentData)
  }, [props.sizeContentData])

  useEffect(() => {
    fetchSizeTable()
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
              height: "500px",
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
            {Object.keys(props.sizeContentData).map((key) =>
              props.sizeContentData[key].map((table) => (
                <Row style={{ margin: 0, marginBottom: "10px" }}>
                  <DataTable data={table} columns={sizeCols} noHeader={true} />
                </Row>
              ))
            )}
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
              value={wastageOptions.filter((opt) => opt.value === wastage)}
              onChange={(e) => setWastage(e.value)}
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

export default SizeTable
