import { store } from "@redux/storeConfig/store"
import { getUserData, formatDateYMD } from "@utils"
import axios from "@axios"
import { XMLBuilder } from "fast-xml-parser"
import { sweetAlert } from "@utils"
import { setLoader } from "@redux/actions/layout"
import { setContentNumberData } from "@redux/actions/views/Order/Order"

export const matchContentNumber = (module) => (dispatch) => {
  let state
  if (module === "Order") {
    state = store.getState().orderReducer
  } else {
    state = store.getState().poOrderReducer
  }
  // fetches content and care option value as per change in props.fibreInstructionData and props.careData
  const body = {
    brand_key: state.brand ? state.brand.value : "",
    order_user: getUserData().admin,
    custom_number: state.custom_number || "",
    content_group: "A",
    content: state.fibreInstructionData.map((data, index) => ({
      cont_key: data.cont_key || "",
      part_key: data.part_key || "",
      percentage: data.en_percent || "",
      seqno: (index + 1) * 10
    })),
    default_content: state.defaultContentData.map((cont, index) => ({
      cont_key: cont || "",
      seqno: (index + 1) * 10
    })),
    care: state.careData.map((data, index) => ({
      care_key: data.cont_key || "",
      seqno: (index + 1) * 10
    })),
    icon: Object.values(state.washCareData).map((obj, index) => ({
      ...obj,
      seqno: (index + 1) * 10
    }))
  }
  axios.post("/ContentNumber/MatchContentNumber", body).then((res) => {
    if (res.status === 200) {
      const {
        setContentNumberData,
        setCareNumberData
      } = require(`@redux/actions/views/Order/${module}`)
      dispatch(
        setContentNumberData({
          value: res.data.content_number || "",
          label: ""
        })
      )
      dispatch(
        setCareNumberData({ value: res.data.care_number || "", label: "" })
      )
    }
  })
}

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

export const saveOrder = (order_status) => (dispatch) => {
  dispatch(setLoader(true))
  const data = store.getState().orderReducer

  const body = {
    brand_key: data.brand ? data.brand.value : "",
    order_user: getUserData().admin,
    order_no: "",
    num: "",
    order_status,
    is_copy_order: "N",
    po_number: data.orderReference,
    factory_code: "",
    location_code: data.projectionLocation ? data.projectionLocation : "",
    draft_order_email: data.clientDetails?.draft_email || "",
    approver_email_address: "", // to be
    order_expdate_delivery_date: formatDateYMD(
      new Date(data.expectedDeliveryDate)
    ),
    invoice_address: [
      {
        invoice_address_id: data.invoiceAddressDetails?.dyn_address_id,
        invoice_contact_id: data.contactDetails?.dyn_customer_id,
        invoice_cpyname: data.invoiceAddressDetails?.name,
        invoice_contact: data.contactDetails?.name,
        invoice_phone: data.contactDetails?.phone,
        invoice_fax: data.contactDetails?.fax,
        invoice_email: data.contactDetails?.email,
        invoice_addr: data.invoiceAddressDetails?.address,
        invoice_addr2: data.invoiceAddressDetails?.address2,
        invoice_addr3: data.invoiceAddressDetails?.address3
      }
    ],
    delivery_address: [
      {
        delivery_address_id: data.deliveryAddressDetails?.dyn_address_id,
        delivery_contact_id: data.deliveryAddressDetails?.dyn_customer_id,
        delivery_cpyname: data.deliveryAddressDetails?.name,
        delivery_contact: data.contactDetails?.name,
        delivery_phone: data.contactDetails?.phone,
        delivery_fax: data.contactDetails?.fax,
        delivery_email: data.contactDetails?.email,
        delivery_city: data.deliveryAddressDetails?.city,
        delivery_country: data.deliveryAddressDetails?.country,
        delivery_post_code: data.deliveryAddressDetails?.post_code,
        delivery_addr: data.deliveryAddressDetails?.address,
        delivery_addr2: data.deliveryAddressDetails?.address2,
        delivery_addr3: data.deliveryAddressDetails?.address3
      }
    ],
    dynamic_field: Object.values(data.dynamicFieldData),
    size_matrix_type: data.sizeMatrixType,
    size_content: data.sizeTable,
    default_size_content: data.defaultSizeTable,
    size_pointer: "",
    coo: data.coo,
    shrinkage_percentage: "",
    item_ref: data.selectedItems.map((item) => ({
      item_key: item.guid_key || "",
      item_ref: item.item_ref || "",
      qty: 1, // static for now
      price: item.price || "",
      currency: item.currency || ""
    })),
    is_wastage: data.wastageApplied || "",
    update_user: "innoa",
    update_date: formatDateYMD(new Date()),
    contents: [
      {
        brand_key: data.brand?.value,
        order_user: getUserData().admin,
        content_custom_number: data.contentCustomNumber,
        content_number: data.contentNumberData?.label,
        content_number_key: data.contentNumberData?.value,
        care_custom_number: data.careCustomNumber,
        care_number: data.careNumberData?.label,
        care_number_key: data.careNumberData?.value,
        content_group: data.contentGroup,
        content: data.fibreInstructionData?.map((data, index) => ({
          cont_key: data.cont_key,
          cont_translation: data.cont_translation,
          part_key: data.part_key,
          part_translation: data.part_translation,
          percentage: data.en_percent,
          seqno: (index + 1) * 10
        })),
        default_content: data.defaultContentData?.map((cont, index) => ({
          cont_key: cont.cont_key || "",
          seqno: (index + 1) * 10
        })),
        care: data.careData.map((data, index) => ({
          care_key: data.cont_key,
          seqno: (index + 1) * 10
        })),
        icon: Object.values(data.washCareData)?.map((obj, index) => ({
          icon_group: obj.icon_group,
          icon_type_id: obj.icon_type_id,
          icon_key: obj.sys_icon_key,
          seqno: (index + 1) * 10
        }))
      }
    ]
  }
  axios
    .post("Order/SaveOrder", body)
    .then((res) => {
      if (res.status === 200) {
        if (res.data.status && res.data.status === "Fail") {
          sweetAlert(
            `${order_status} Order Save Failed!`,
            res.data.status_description,
            "error",
            "danger"
          )
        } else {
          sweetAlert(
            `${order_status} Order Save Successful`,
            "",
            "success",
            "success"
          )
        }
      }
      dispatch(setLoader(false))
    })
    .catch((err) => console.log(err))
}

const buildXML = (jsObj) => {
  const builder = new XMLBuilder()
  return builder.build(jsObj)
}

const formatRowToCol = (table) => {
  const newTable = []
  table.map((row, rIndex) => {
    Object.keys(row).map((key, index) => {
      const tempData = {}
      if (rIndex === 0) {
        tempData["Column0"] = key.includes("QTY") ? "QTY" : "TITLE"
        tempData["Column1"] = key
        tempData["Column2"] = row[key]
        newTable[index] = { ...tempData }
      } else {
        tempData[`Column${rIndex + 2}`] = row[key]
        newTable[index] = { ...newTable[index], ...tempData }
      }
    })
  })
  return {
    "?xml": "",
    SizeMatrix: {
      Table: newTable
    }
  }
}

const processPoSizeTable = (table) => {
  return {
    "?xml": "",
    SizeMatrix: {
      Table: table.map((row) => {
        const tempRow = { ...row }
        tempRow["QTY ITEM REF 1"] = tempRow["QTY ITEM REF 1 WITH WASTAGE"]
        delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
        return tempRow
      })
    }
  }
}

const processSummarySizeTable = (data) => {
  if (data.summaryTable) {
    return Object.keys(data.summaryTable).map((key) => {
      const returnDict = {
        group_type: key,
        size_matrix_type: data.size_matrix_type
      }
      if (!data.wastageApplied) {
        return {
          ...returnDict,
          size_content: buildXML(formatRowToCol(data.summaryTable[key])),
          default_size_content: buildXML(formatRowToCol(data.summaryTable[key]))
        }
      } else {
        // just remove "QTY ITEM REF 1 WITH WASTAGE" col for default_size_content
        const processedDefault = data.summaryTable[key].map((row) => {
          const tempRow = { ...row }
          delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          return tempRow
        })
        // to xml string
        const processedDefaultXML = buildXML(formatRowToCol(processedDefault))
        // preprocess for size_content
        const processedWastage = data.summaryTable[key].map((row) => {
          const tempRow = { ...row }
          tempRow["QTY ITEM REF 1"] = tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          delete tempRow["QTY ITEM REF 1 WITH WASTAGE"]
          return tempRow
        })
        // to xml string
        const processedWastageXML = buildXML(formatRowToCol(processedWastage))
        return {
          ...returnDict,
          size_content: processedWastageXML,
          default_size_content: processedDefaultXML
        }
      }
    })
  }
}

export const savePOOrder = (order_status) => (dispatch) => {
  dispatch(setLoader(true))
  const data = store.getState().poOrderReducer

  const body = {
    brand_key: data.brand ? data.brand.value : "",
    order_user: getUserData().admin,
    order_no: "",
    guid_key: data.combinedPOOrderKey,
    num: "",
    order_status,
    is_copy_order: "N",
    po_number: data.orderReference,
    factory_code: "",
    location_code: data.projectionLocation ? data.projectionLocation : "",
    draft_order_email: data.clientDetails?.draft_email || "",
    approver_email_address: "",
    order_expdate_delivery_date: formatDateYMD(
      new Date(data.expectedDeliveryDate)
    ),
    invoice_address: [
      {
        invoice_address_id: data.invoiceAddressDetails?.dyn_address_id,
        invoice_contact_id: data.contactDetails?.dyn_customer_id,
        invoice_cpyname: data.invoiceAddressDetails.name,
        invoice_contact: data.contactDetails?.name,
        invoice_phone: data.contactDetails?.phone,
        invoice_fax: data.contactDetails?.fax,
        invoice_email: data.contactDetails?.email,
        invoice_addr: data.invoiceAddressDetails?.address,
        invoice_addr2: data.invoiceAddressDetails?.address2,
        invoice_addr3: data.invoiceAddressDetails?.address3
      }
    ],
    delivery_address: [
      {
        delivery_address_id: data.deliveryAddressDetails?.dyn_address_id,
        delivery_contact_id: data.deliveryAddressDetails?.dyn_customer_id,
        delivery_cpyname: data.deliveryAddressDetails?.name,
        delivery_contact: data.contactDetails?.name,
        delivery_phone: data.contactDetails?.phone,
        delivery_fax: data.contactDetails?.fax,
        delivery_email: data.contactDetails?.email,
        delivery_city: data.deliveryAddressDetails?.city,
        delivery_country: data.deliveryAddressDetails?.country,
        delivery_post_code: data.deliveryAddressDetails?.post_code,
        delivery_addr: data.deliveryAddressDetails?.address,
        delivery_addr2: data.deliveryAddressDetails?.address2,
        delivery_addr3: data.deliveryAddressDetails?.address3
      }
    ],
    dynamic_field: Object.values(data.dynamicFieldData),
    summary_size_table: processSummarySizeTable(data) || "",
    coo: data.coo,
    shrinkage_percentage: "",
    item_ref: data.selectedItems.map((item) => ({
      item_key: item.guid_key || "",
      item_ref: item.item_ref || "",
      qty: 1, // static for now
      price: item.price || "",
      currency: item.currency || ""
    })),
    is_wastage: data.wastageApplied || "",
    update_user: "innoa",
    update_date: formatDateYMD(new Date()),
    customer_id: "",
    contents: [
      {
        brand_key: data.brand?.value,
        order_user: getUserData().admin,
        content_custom_number: data.contentCustomNumber,
        content_number: data.contentNumberData?.label,
        content_number_key: data.contentNumberData?.value,
        care_custom_number: data.careCustomNumber,
        care_number: data.careNumberData?.label,
        care_number_key: data.careNumberData?.value,
        content_group: data.contentGroup,
        content: data.fibreInstructionData?.map((data, index) => ({
          cont_key: data.cont_key,
          cont_translation: data.cont_translation,
          part_key: data.part_key,
          part_translation: data.part_translation,
          percentage: data.en_percent,
          seqno: (index + 1) * 10
        })),
        default_content: data.defaultContentData?.map((cont, index) => ({
          cont_key: cont.cont_key || "",
          seqno: (index + 1) * 10
        })),
        care: data.careData.map((data, index) => ({
          care_key: data.cont_key,
          seqno: (index + 1) * 10
        })),
        icon: Object.values(data.washCareData)?.map((obj, index) => ({
          icon_group: obj.icon_group,
          icon_type_id: obj.icon_type_id,
          icon_key: obj.sys_icon_key,
          seqno: (index + 1) * 10
        }))
      }
    ],
    edi_order_no: "",
    consolidated_id: "",
    supplier_code: "",
    send_date: "",
    production_description: "",
    po_last_update_time: "",
    option_id: "",
    po_size_tables: data.sizeContentData.map((sizeData) => ({
      guid_key: "",
      order_key: "",
      brand_key: "",
      edi_order_no: "",
      consolidated_id: "",
      group_type: "",
      item_ref: data.selectedItems.map((item) => ({
        item_key: item.guid_key || "",
        item_ref: item.item_ref || "",
        qty: 1, // static for now
        price: item.price || "",
        currency: item.currency || ""
      })),
      size_matrix_type: data.sizeMatrixType,
      size_content: buildXML(processPoSizeTable(sizeData.size_content)),
      send_date: "",
      create_date: ""
    }))
  }
  axios
    .post("Order/SaveOrder", body)
    .then((res) => {
      if (res.status === 200) {
        if (res.data.status && res.data.status === "Fail") {
          sweetAlert(
            `${order_status} Order Save Failed!`,
            res.data.status_description,
            "error",
            "danger"
          )
        } else {
          sweetAlert(
            `${order_status} Order Save Successful`,
            "",
            "success",
            "success"
          )
        }
      }
      dispatch(setLoader(false))
    })
    .catch((err) => console.log(err))
}
