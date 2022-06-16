import { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  CardFooter,
  Spinner,
  Row,
  Col,
  Label
} from "reactstrap"
import DataTable from "react-data-table-component"
import Select from "react-select"
import Footer from "../../CommonFooter"
import axios from "@axios"
import { useTranslation } from "react-i18next"
import { useDispatch, connect } from "react-redux"
import {
  setSizeMatrixType,
  setSizeTable,
  setDefaultSizeTable,
  setSizeData,
  setDefaultSizeData
} from "@redux/actions/views/Order/Order"

const PreviewAndSummary = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // App States
  const [sizeMatrixOptions, setSizeMatrixOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const sizeCols = [
    {
      name: t("Sr No."),
      selector: "Sequence",
      sortable: true
    },
    {
      name: t("SIZE"),
      selector: "SIZE",
      sortable: true
    },
    {
      name: t("QTY ITEM REF 0"),
      selector: "QTY ITEM REF 0"
    },
    {
      name: t("QTY ITEM REF 1"),
      selector: "QTY ITEM REF 1"
    },
    {
      name: t("QTY ITEM REF 2"),
      selector: "QTY ITEM REF 2"
    },
    {
      name: t("UPC/EAN CODE"),
      selector: "UPC/EAN CODE"
    }
  ]

  // API Sevices
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
          //  set size content if available only if not previously set
          if (res?.data[0]?.size_content) {
            dispatch(setSizeTable(res?.data[0]?.size_content)) // to send it to invoice and delivery for save order
            dispatch(setSizeMatrixType(res.data[0]?.size_matrix_type)) // to send it to invoice and delivery for save order
            dispatch(setSizeData(res?.data[0]?.size_content))
          }
          // set default size content if available
          if (res?.data[0]?.default_size_content) {
            dispatch(setDefaultSizeTable(res?.data[0]?.default_size_content)) // to send it to invoice and delivery for save order
            dispatch(setDefaultSizeData(res?.data[0]?.default_size_content))
          }
          setLoading(false)
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchSizeTableList()
  }, [])

  // useEffect(() => {
  //   console.log("sizeData", sizeData)
  // }, [sizeData])

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
                fetchSizeTableDetails(e.value)
                props.setSizeMatrixSelect(e)
              }}
              menuPlacement={"auto"}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {props.sizeData.length > 0 ? (
              <DataTable
                progressPending={loading}
                progressComponent={<Spinner />}
                data={props.sizeData}
                columns={sizeCols}
              />
            ) : null}
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
  defaultSizeData: state.orderReducer.defaultSizeData
})

export default connect(mapStateToProps, null)(PreviewAndSummary)
