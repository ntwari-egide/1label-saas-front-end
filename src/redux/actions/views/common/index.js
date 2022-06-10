export const populateData = (module, data) => (dispatch) => {
  const {
    setDynamicFieldData,
    setCareData,
    setFibreInstructionData,
    setWashCareData,
    setCareCustomNumber,
    setContentCustomNumber,
    setSelectedItems,
    setExpectedDeliveryDate,
    setProjectionLocation,
    setOrderReference,
    setContentNumberData,
    setCareNumberData,
    setDefaultContentData,
    setCoo,
    setShrinkagePercentage,
    setSizeData,
    setDefaultSizeData,
    setBrand
  } = require(`@redux/actions/views/Order/${module}`)
  if (data.brand_key) {
    dispatch(setBrand({ value: data.brand_key, label: "" }))
  }
  if (data.dynamic_field) {
    dispatch(setDynamicFieldData(data.dynamic_field))
  }
  if (data.contents[0]) {
    const contData = data.contents[0]
    if (contData.care) {
      dispatch(setCareData(contData.care))
    }
    if (contData.content) {
      dispatch(setFibreInstructionData(contData.content))
    }
    if (contData.icon) {
      const tempObj = {}
      contData.icon.map((icon) => {
        tempObj[`${icon.icon_type_id}`] = {
          icon_type_id: icon.icon_type_id,
          icon_group: icon.icon_group,
          sys_icon_key: icon.icon_key
        }
      })
      dispatch(setWashCareData({ ...tempObj }))
    }
    if (contData.default_content) {
      dispatch(
        setDefaultContentData(
          contData.default_content.map((cont) => ({
            cont_key: cont.cont_key
          }))
        )
      )
    }
    if (contData.care_custom_number) {
      dispatch(setCareCustomNumber(contData.care_custom_number))
    }
    if (contData.content_custom_number) {
      dispatch(setContentCustomNumber(contData.content_custom_number))
    }
    if (contData.content_number && contData.content_number_key) {
      dispatch(
        setContentNumberData({
          value: contData.content_number_key,
          label: contData.content_number
        })
      )
    }
    if (contData.care_number && contData.care_number_key) {
      dispatch(
        setCareNumberData({
          value: contData.care_number_key,
          label: contData.care_number
        })
      )
    }
    if (contData.content_group) {
      dispatch(setContentGroup(contData.content_group))
    }
  }
  if (data.item_ref) {
    dispatch(
      setSelectedItems(
        data.item_ref.map((item) => {
          const tempData = item
          tempData["guid_key"] = tempData.item_key
          delete tempData["item_key"]
          return tempData
        })
      )
    )
  }
  if (
    data.order_expdate_delivery_date &&
    data.order_expdate_delivery_date.length
  ) {
    dispatch(
      setExpectedDeliveryDate(new Date(data.order_expdate_delivery_date))
    )
  }
  if (data.location_code) {
    dispatch(setProjectionLocation(data.location_code))
  }
  if (data.po_number) {
    dispatch(setOrderReference(data.po_number))
  }
  if (data.coo) {
    dispatch(setCoo(data.coo))
  }
  if (data.shrinkage_percentage) {
    dispatch(setShrinkagePercentage(data.shrinkage_percentage))
  }
  if (data.size_content) {
    dispatch(setSizeData(data.size_content))
  }
  if (data.default_size_content && module === "Order") {
    dispatch(setDefaultSizeData(data.default_size_content))
  }
}
