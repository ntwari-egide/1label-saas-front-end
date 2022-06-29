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
import { useDispatch, connect } from "react-redux"
import {
  setBrand,
  setSelectedItems,
  setSizeData
} from "@redux/actions/views/Order/Order"
import { getUserData } from "@utils"

let timerId = null

const SelectItem = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [brandOptions, setBrandOptions] = useState([])
  const [itemTypeOptions, setItemTypeOptions] = useState([])
  const [itemList, setItemList] = useState([])
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)
  const [loader, setLoader] = useState(false)
  const [refSearch, setRefSearch] = useState(false)

  // Other Functions
  const debounceSearch = (item_ref) => {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fetchItemList(props.brand, props.itemType, item_ref, true)
    }, [400])
  }

  const fetchItemRefDetails = (item, index, latestState) => {
    const body = {
      guid_key: item.guid_key
    }

    axios
      .post("/Item/GetItemRefDetail", body)
      .then((res) => {
        if (res.status === 200) {
          latestState[index] = {
            ...latestState[index],
            is_non_size: res.data[0].is_non_size
          }
          dispatch(setSelectedItems(latestState))
        }
      })
      .catch((err) => console.log(err))
  }

  const handleSelectedItemsChange = (item) => {
    let tempList = [...props.selectedItems]
    // index to later use to process size data
    const index = props.selectedItems
      .map((item) => item.guid_key)
      .indexOf(item.guid_key)
    // if already in list then removes else appends
    if (tempList.map((item) => item.guid_key).includes(item.guid_key)) {
      tempList.splice(
        tempList.map((item) => item.guid_key).indexOf(item.guid_key),
        1
      )
      dispatch(setSelectedItems(tempList))
      try {
        // recalculate size table data
        // works for both case with wastage and without wastage
        const tempData = [...props.sizeData]
        tempData.forEach((row, rIndex) => {
          Object.keys(row).forEach((colName) => {
            if (colName.includes("QTY ITEM REF")) {
              // can either decreament this or increment the index
              // did so cuz will have to decreamnt this later anyway
              const itemNo = parseInt(colName.split(" ")[3]) - 1
              // no need to rename previous cols
              if (itemNo < index) {
                return
              }
              // delete the item
              if (itemNo === index) {
                delete tempData[rIndex][colName]
                return
              }
              // rename all the other columns
              // calculate the new name
              const oldName = colName.split(" ")
              // decrement the count in the name
              oldName[3] = itemNo
              const newName = oldName.join(" ")
              // create entry with new name
              tempData[rIndex][newName] = tempData[rIndex][colName]
              // delete old entry
              delete tempData[rIndex][colName]
            }
          })
        })
        // finally dispatch the data
        dispatch(setSizeData([...tempData]))
      } catch (err) {
        console.log("Something went wrong while re-calculating size data", err)
      }
    } else {
      const finState = [...tempList, item]
      dispatch(setSelectedItems(finState))
      const index = finState.map((item) => item.guid_key).indexOf(item.guid_key)
      fetchItemRefDetails(item, index, finState)
    }
  }

  // API Services
  const fetchBrandList = () => {
    const body = {
      order_user: getUserData().admin
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

  const fetchItemList = (brand, item_type, item_ref, refSearch) => {
    if (refSearch) {
      setRefSearch(true)
    }
    setLoader(true)
    setVisibleCardIndex(0)
    const body = {
      order_user: getUserData().admin,
      brand_key: brand ? brand.value : "",
      item_ref_type: item_type ? item_type?.label : "",
      item_ref: item_ref || ""
    }
    axios
      .post("/Item/GetItemRefList", body)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false)
          setItemList(res.data)
          if (refSearch) {
            setRefSearch(false)
          }
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchBrandList()
    fetchItemTypeOptions()
    fetchItemList(props.brand, props.itemType, props.itemRef)
  }, [])

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
              dispatch(setBrand(e ? e : {}))
              fetchItemList(e ? e : {}, props.itemType)
              dispatch(setSelectedItems([]))
            }}
            isClearable={true}
            isDisabled={loader || props.isOrderConfirmed}
          />
        </Col>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Input
            placeholder={t("ITEM")}
            value={props.itemRef}
            onChange={(e) => {
              props.setItemRef(e.target.value)
              debounceSearch(e.target.value)
            }}
            disabled={(loader && !refSearch) || props.isOrderConfirmed}
          />
        </Col>
        <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
          <Select
            className="React"
            classNamePrefix="select"
            placeholder={t("ITEM TYPE")}
            value={itemTypeOptions.filter(
              (opt) => opt.value === props.itemType?.value
            )}
            options={itemTypeOptions}
            onChange={(e) => {
              props.setItemType(e ? e : {})
              fetchItemList(props.brand, e ? e : {}, props.itemRef)
            }}
            isClearable={true}
            isDisabled={loader || props.isOrderConfirmed}
          />
        </Col>
      </CardHeader>
      <CardBody style={{ minHeight: "520px" }}>
        <Row style={{ margin: "0rem", minHeight: "520px" }}>
          {!loader ? (
            itemList
              .slice(visibleCardIndex, visibleCardIndex + 6)
              .map((item, index) => (
                <Col xs="12" sm="6" md="2" lg="2" key={`${item}-${index}`}>
                  <Card style={{ minHeight: "493px" }}>
                    <CardHeader>
                      <div>{item.brand_name}</div>
                      <div>{visibleCardIndex + index}</div>
                    </CardHeader>
                    <CardBody>
                      <Row style={{ marginBottom: "10px" }}>
                        <Col style={{ fontWeight: "700" }}>
                          <h7>{item.item_ref}</h7>
                        </Col>
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
                        onChange={() => {
                          handleSelectedItemsChange(item)
                        }}
                        disabled={props.isOrderConfirmed}
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

const mapStateToProps = (state) => ({
  brand: state.orderReducer.brand,
  selectedItems: state.orderReducer.selectedItems,
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  sizeData: state.orderReducer.sizeData
})

export default connect(mapStateToProps, null)(SelectItem)
