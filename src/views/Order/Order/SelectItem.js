import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import { Check, FileMinus } from "react-feather"
import axios from "@axios"
import Chart from "react-apexcharts"
import DataTable from "react-data-table-component"
import CheckBox from "@components/CheckBox/CheckBox"
import Select from "react-select"
import { Link } from "react-router-dom"
import {
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardTitle,
  CardFooter,
  Breadcrumb,
  BreadcrumbItem,
  Label,
  Input,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"

const SelectItem = (props) => {
  const [brandOptions, setBrandOptions] = useState([])
  const [brand, setBrand] = useState(null)
  const [itemTypeOptions, setItemTypeOptions] = useState([])
  const [itemType, setItemType] = useState(null)
  const [itemList, setItemList] = useState([])
  const [item, setItem] = useState(null)
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)
  const [checkedList, setCheckedList] = useState([])
  const [loader, setLoader] = useState(false)

  const fetchBrandList = () => {
    const body = {
      order_user: "innoa"
    }
    axios.post("/Brand/GetBrandListByClient", body).then((res) => {
      if (res.status === 200) {
        setBrandOptions(
          res.data.map((br) => ({ value: br.guid_key, label: br.brand_name }))
        )
      }
    })
  }

  const fetchItemTypeOptions = () => {
    axios.post("/Item/GetItemTypeList").then((res) => {
      if (res.status === 200) {
        setItemTypeOptions(
          res.data.map((itm) => ({
            value: itm.id,
            label: itm.item_type_name,
            parent_id: itm.parent_id
          }))
        )
      }
    })
  }

  const fetchItemList = (brand = "", item_type = "") => {
    setLoader(true)
    setVisibleCardIndex(0)
    const body = {
      order_user: "innoa",
      brand_key: brand?.value,
      item_ref_type: item_type?.value
    }
    axios.post("/Item/GetItemRefList", body).then((res) => {
      if (res.status === 200) {
        setLoader(false)
        setItemList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchBrandList()
    fetchItemTypeOptions()
    fetchItemList()
  }, [])

  return (
    <Card>
      <CardHeader style={{ flexGrow: 1 }}>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Select
            className="React"
            classNamePrefix="select"
            placeholder="BRAND"
            value={brand}
            options={brandOptions}
            onChange={(e) => {
              setBrand(e)
              fetchItemList(e, itemType)
            }}
            isClearable={true}
          />
        </Col>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Input placeholder="ITEM" />
        </Col>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Select
            className="React"
            classNamePrefix="select"
            placeholder="ITEM TYPE"
            value={itemType}
            options={itemTypeOptions}
            onChange={(e) => {
              setItemType(e)
              fetchItemList(brand, e)
            }}
            isClearable={true}
          />
        </Col>
      </CardHeader>
      <CardBody style={{ minHeight: "520px" }}>
        <Row style={{ margin: "0rem" }}>
          {!loader ? (
            itemList
              .slice(visibleCardIndex, visibleCardIndex + 6)
              .map((item, index) => (
                <Col xs="12" sm="6" md="2" lg="2">
                  <Card style={{ minHeight: "493px" }}>
                    <CardHeader>
                      <div>{item.brand_name}</div>
                      <div>{visibleCardIndex + index}</div>
                    </CardHeader>
                    <CardBody>{item.item_ref_desc}</CardBody>
                    <CardFooter>
                      <CheckBox
                        color="primary"
                        icon={<Check className="vx-icon" size={16} />}
                        checked={checkedList.includes(item.guid_key)}
                        onChange={() => handleCheckListChange(item.guid_key)}
                      />
                    </CardFooter>
                  </Card>
                </Col>
              ))
          ) : (
            <CardBody style={{ minHeight: "520px" }}>
              <div style={{ textAlign: "center", padding: "15% 0" }}>
                <Spinner color="primary" />
              </div>
            </CardBody>
          )}
        </Row>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <Button
              color="primary"
              onClick={() => {
                if (visibleCardIndex > 0) {
                  setVisibleCardIndex(visibleCardIndex - 1)
                }
              }}
              disabled={props.currentStep === 1}
            >
              <div style={{ display: "flex" }}>
                <div>
                  <ArrowLeft size={15} />
                </div>
                <div style={{ marginTop: "2px" }}>{"Previous  "}</div>
              </div>
            </Button>
          </Col>
          <Col>
            <div style={{ float: "right" }}>
              <Button
                color="primary"
                onClick={() => {
                  if (visibleCardIndex < itemList.length - 1) {
                    setVisibleCardIndex(visibleCardIndex + 1)
                  }
                  props.setCurrentStep(props.currentStep + 1)
                }}
                disabled={visibleCardIndex === itemList.length - 1}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ marginTop: "2px" }}>{"Next  "}</div>
                  <div>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Button>
            </div>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

export default SelectItem
