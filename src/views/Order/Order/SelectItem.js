import { useState, useEffect } from "react"
import { Row, Col } from "reactstrap"
import { Check } from "react-feather"
import axios from "@axios"
import CheckBox from "@components/CheckBox/CheckBox"
import Select from "react-select"
import Footer from "../../CommonFooter"
import {
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardFooter,
  Input,
  Button
} from "reactstrap"
import { ArrowRight, ArrowLeft } from "react-feather"
import { useTranslation } from "react-i18next"

const SelectItem = (props) => {
  const { t } = useTranslation()
  const [brandOptions, setBrandOptions] = useState([])
  const [itemTypeOptions, setItemTypeOptions] = useState([])
  const [itemList, setItemList] = useState([])
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)
  const [loader, setLoader] = useState(false)

  const handleCheckListChange = (item) => {
    let tempList = props.selectedItems
    if (
      props.selectedItems.map((item) => item.guid_key).includes(item.guid_key)
    ) {
      tempList.splice(
        props.selectedItems.map((item) => item.guid_key).indexOf(item.guid_key),
        1
      )
      props.setSelectedItems([...tempList])
    } else {
      props.setSelectedItems([...tempList, item])
    }
  }

  const fetchBrandList = () => {
    const body = {
      order_user: "innoa"
    }
    axios
      .post("/Brand/GetBrandListByClient", body)
      .then((res) => {
        if (res.status === 200) {
          setBrandOptions(
            res.data.map((br) => ({ value: br.guid_key, label: br.brand_name }))
          )
        }
      })
      .catch((err) => console.log(err))
  }

  const fetchItemTypeOptions = () => {
    axios
      .post("/Item/GetItemTypeList")
      .then((res) => {
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
      .catch((err) => console.log(err))
  }

  const fetchItemList = (brand = "", item_type = "") => {
    setLoader(true)
    setVisibleCardIndex(0)
    const body = {
      order_user: "innoa",
      brand_key: brand ? brand?.value : "",
      item_ref_type: item_type ? item_type?.value : ""
    }
    axios
      .post("/Item/GetItemRefList", body)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false)
          setItemList(res.data)
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchBrandList()
    fetchItemTypeOptions()
    fetchItemList(props.brand, props.item_type)
  }, [])

  // useEffect(() => {
  //   console.log("selectedItems", props.selectedItems)
  // }, [props.selectedItems])

  // useEffect(() => {
  //   console.log("redux", props.brand)
  // }, [props.brand])

  return (
    <Card>
      <CardHeader style={{ flexGrow: 1 }}>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Select
            className="React"
            classNamePrefix="select"
            placeholder={t("BRAND")}
            value={
              props.brand
                ? brandOptions.filter((br) => br.value === props.brand.value)
                : ""
            }
            options={brandOptions}
            onChange={(e) => {
              props.setBrand(e)
              fetchItemList(e, props.itemType)
            }}
            isClearable={true}
            isDisabled={loader}
          />
        </Col>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Input placeholder={t("ITEM")} disabled={loader} />
        </Col>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Select
            className="React"
            classNamePrefix="select"
            placeholder={t("ITEM TYPE")}
            value={props.itemType}
            options={itemTypeOptions}
            onChange={(e) => {
              props.setItemType(e)
              fetchItemList(props.brand, e)
            }}
            isClearable={true}
            isDisabled={loader}
          />
        </Col>
      </CardHeader>
      <CardBody style={{ minHeight: "520px" }}>
        <Row style={{ margin: "0rem", minHeight: "520px" }}>
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
                    <CardBody>
                      <Row style={{ marginBottom: "10px" }}>
                        <Col>{item.item_ref}</Col>
                      </Row>
                      <Row style={{ marginBottom: "10px" }}>
                        <Col>{item.item_ref_desc}</Col>
                      </Row>
                    </CardBody>
                    <CardFooter>
                      <CheckBox
                        color="primary"
                        icon={<Check className="vx-icon" size={16} />}
                        checked={props.selectedItems
                          .map((item) => item.guid_key)
                          .includes(item.guid_key)}
                        onChange={() => handleCheckListChange(item)}
                      />
                    </CardFooter>
                  </Card>
                </Col>
              ))
          ) : (
            <CardBody style={{ minHeight: "520px" }}>
              <div style={{ textAlign: "center", padding: "14% 0" }}>
                <Spinner color="primary" />
              </div>
            </CardBody>
          )}
        </Row>
        <Row>
          <Col>
            <Button
              color="primary"
              style={{ padding: "5px" }}
              onClick={() => {
                if (visibleCardIndex > 0) {
                  setVisibleCardIndex(visibleCardIndex - 1)
                }
              }}
              disabled={visibleCardIndex === 0}
            >
              <ArrowLeft size={20} />
            </Button>
          </Col>
          <Col>
            <div style={{ float: "right" }}>
              <Button
                color="primary"
                style={{ padding: "5px" }}
                onClick={() => {
                  if (visibleCardIndex < itemList.length - 1) {
                    setVisibleCardIndex(visibleCardIndex + 1)
                  }
                }}
                disabled={visibleCardIndex === itemList.length - 1}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        <Footer
          selectedItems={props.selectedItems}
          currentStep={props.currentStep}
          setCurrentStep={props.setCurrentStep}
          lastStep={props.lastStep}
        />
      </CardFooter>
    </Card>
  )
}

export default SelectItem
