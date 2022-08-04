import { useState, useEffect } from "react"
import { Check } from "react-feather"
import axios from "@axios"
import CheckBox from "@components/CheckBox/CheckBox"
import Select from "react-select"
import Footer from "../../../CommonFooter"
import {
  Row,
  Col,
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardFooter,
  Input,
  Button
} from "reactstrap"
import { useTranslation } from "react-i18next"
import { ArrowRight, ArrowLeft } from "react-feather"
import { connect, useDispatch } from "react-redux"
import {
  setSelectedItems,
  setSizeTableTrigger,
  setSizeData
} from "@redux/actions/views/Order/POOrder"
import { getUserData } from "@utils"

const ItemList = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [itemTypeOptions, setItemTypeOptions] = useState([])
  const [itemList, setItemList] = useState([])
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)
  const [loader, setLoader] = useState(false)

  // other functions
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

  const handleCheckListChange = (item) => {
    let tempList = props.selectedItems
    // index to later use to process size data
    const index = props.selectedItems
      .map((item) => item.guid_key)
      .indexOf(item.guid_key)

    if (
      props.selectedItems.map((item) => item.guid_key).includes(item.guid_key)
    ) {
      tempList.splice(
        props.selectedItems.map((item) => item.guid_key).indexOf(item.guid_key),
        1
      )
      dispatch(setSelectedItems([...tempList]))
      try {
        // recalculate size table data
        // works for both case with wastage and without wastage
        const tempData = [...props.sizeData]
        tempData.forEach((data, tIndex) => {
          data.size_content.forEach((row, rIndex) => {
            Object.keys(row).forEach((colName) => {
              if (colName.includes("QTY ITEM REF")) {
                const itemNo = parseInt(colName.split(" ")[3]) - 1
                // no need to rename previous cols
                if (itemNo < index) {
                  return
                }
                // delete the item
                if (itemNo === index) {
                  delete tempData[tIndex].size_content[rIndex][colName]
                  return
                }
                // rename all the other columns
                // calculate the new name
                const oldName = colName.split(" ")
                // decrement the count in the name
                oldName[3] = itemNo
                const newName = oldName.join(" ")
                // create entry with new name
                tempData[tIndex].size_content[rIndex][newName] =
                  tempData[tIndex].size_content[rIndex][colName]
                // delete old entry
                delete tempData[tIndex].size_content[rIndex][colName]
              }
            })
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
      order_user: getUserData().admin,
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
    fetchItemTypeOptions()
    fetchItemList(props.brand, props.item_type)
  }, [])

  // to enable fetching size table only when selected items are changed
  useEffect(() => {
    if (!props.setSizeTableTrigger) {
      dispatch(setSizeTableTrigger(true))
    }
  }, [props.selectedItems])

  return (
    <Card>
      <CardHeader>
        <Row style={{ width: "100%", margin: "0" }}>
          <Col xs="12" sm="6" md="4" lg="4" style={{ padding: "5px" }}>
            <Input
              placeholder={t("ITEM")}
              disabled={loader || props.isOrderConfirmed}
            />
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
              isDisabled={loader || props.isOrderConfirmed}
              isLoading={!itemTypeOptions.length}
            />
          </Col>
        </Row>
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
                          ?.map((item) => item.guid_key)
                          .includes(item.guid_key)}
                        onChange={() => handleCheckListChange(item)}
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
                setVisibleCardIndex(visibleCardIndex - 6)
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
                  if (visibleCardIndex + 6 < itemList.length) {
                    setVisibleCardIndex(visibleCardIndex + 6)
                  }
                }}
                disabled={visibleCardIndex + 6 > itemList.length}
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
          stepperMenu={props.stepperMenu}
        />
      </CardFooter>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  brand: state.poOrderReducer.brand,
  selectedItems: state.poOrderReducer.selectedItems,
  isOrderConfirmed: state.listReducer.isOrderConfirmed,
  sizeData: state.poOrderReducer.sizeData
})

export default connect(mapStateToProps, null)(ItemList)
