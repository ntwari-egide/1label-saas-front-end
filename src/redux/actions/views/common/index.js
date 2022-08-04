import { store } from "@redux/storeConfig/store"
import { getUserData, formatDateYMD } from "@utils"
import axios from "@axios"
import { sweetAlert } from "@utils"
import { setLoader } from "@redux/actions/layout"
import history from "@src/history"
import { formatColToRow } from "@utils"
import xml2js from "xml2js"

export const matchContentNumber =
  (module, content_group, section) => (dispatch) => {
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
      content_group,
      content: state.fibreInstructionData.map((data, index) => ({
        cont_key: data.cont_key || "",
        part_key: data.part_key || "",
        percentage: data.percentage || "",
        seqno: (index + 1) * 10
      })),
      default_content: state.defaultContentData.map((cont, index) => ({
        cont_key: cont || "",
        seqno: (index + 1) * 10
      })),
      care: state.careData.map((data, index) => ({
        care_key: data.care_key || "",
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
        console.log(content_group, section)
        if (content_group === "ABC") {
          dispatch(
            setContentNumberData({
              value: res.data.content_number_key || "",
              label: res.data.content_number || ""
            })
          )
          dispatch(
            setCareNumberData({
              value: res.data.care_number_key || "",
              label: res.data.care_number || ""
            })
          )
        }
        if (
          content_group === "AB" &&
          (section === "content" || section === "care")
        ) {
          dispatch(
            setContentNumberData({
              value: res.data.content_number_key || "",
              label: res.data.content_number || ""
            })
          )
        } else if (content_group === "C" && section === "washCare") {
          dispatch(
            setCareNumberData({
              value: res.data.care_number_key || "",
              label: res.data.care_number || ""
            })
          )
        }
        if (content_group === "A" && section === "content") {
          dispatch(
            setContentNumberData({
              value: res.data.content_number_key || "",
              label: res.data.content_number || ""
            })
          )
        } else if (
          content_group === "BC" &&
          (section === "care" || section === "washCare")
        ) {
          dispatch(
            setCareNumberData({
              value: res.data.care_number_key || "",
              label: res.data.care_number || ""
            })
          )
        }
      }
    })
  }

export const populateData =
  (module, data, brand_key, order_no, is_po_order_temp) => async (dispatch) => {
    const {
      setDynamicFieldData,
      setCareData,
      setFibreInstructionData,
      setWashCareData,
      setCareCustomNumber,
      setContentCustomNumber,
      setSelectedItems,
      setExpectedDeliveryDate,
      setProductionLocation,
      setOrderReference,
      setContentNumberData,
      setCareNumberData,
      setDefaultContentData,
      setCoo,
      setShrinkagePercentage,
      setSizeTable,
      setDefaultSizeTable,
      setBrand,
      setCurrentStep,
      setSizeMatrixType,
      setItemInfoFields,
      setInvoiceAddressDetails,
      setDeliveryAddressDetails,
      setSizeData,
      setOrderNo,
      setContentGroup
    } = require(`@redux/actions/views/Order/${module}`)
    dispatch(setCurrentStep("Order Form"))
    // set order_no for draft||confirm order
    dispatch(setOrderNo(order_no))
    if (data.brand_key) {
      dispatch(setBrand({ value: data.brand_key, label: "" }))
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
            icon_key: icon.icon_key
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
      const tempData = data.item_ref.map((item) => {
        const tempData = item
        tempData["guid_key"] = tempData.item_key
        delete tempData["item_key"]
        return tempData
      })

      // update for non_size items
      tempData.map((item, index) => {
        const body = {
          guid_key: item.guid_key
        }

        axios
          .post("/Item/GetItemRefDetail", body)
          .then((res) => {
            if (res.status === 200) {
              tempData[index] = {
                ...tempData[index],
                ...res.data[0]
              }
              dispatch(setSelectedItems(tempData))
            }
            // stop loader
            if (index === tempData.length) {
              dispatch(setLoader(false))
            }
          })
          .catch((err) => console.log(err))
      })
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
      dispatch(setProductionLocation(data.location_code))
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
      dispatch(setSizeTable(data.size_content))
      if (module === "Order") {
        dispatch(setSizeData(await formatColToRow(data.size_content)))
      }
    }
    if (data.default_size_content) {
      dispatch(setDefaultSizeTable(data.default_size_content))
    }
    if (data.size_matrix_type?.length) {
      dispatch(setSizeMatrixType(data.size_matrix_type))
    }
    if (data.invoice_address?.length) {
      dispatch(
        setInvoiceAddressDetails({
          address_id: data.invoice_address[0].invoice_address_id || "",
          customer_id: data.invoice_address[0].invoice_contact_id || "",
          name: data.invoice_address[0].invoice_cpyname || "",
          contact_person: data.delivery_address[0].invoice_contact || "",
          phone: data.invoice_address[0].invoice_phone || "",
          fax: data.invoice_address[0].invoice_fax || "",
          email: data.invoice_address[0].invoice_email || "",
          address: data.invoice_address[0].invoice_addr || "",
          address2: data.invoice_address[0].invoice_addr2 || "",
          address3: data.invoice_address[0].invoice_addr3 || ""
        })
      )
    }
    if (data.delivery_address?.length) {
      dispatch(
        setDeliveryAddressDetails({
          address_id: data.delivery_address[0].delivery_address_id || "",
          contact_id: data.delivery_address[0].delivery_contact_id || "",
          name: data.delivery_address[0].delivery_cpyname || "",
          contact_person: data.delivery_address[0].delivery_contact || "",
          phone: data.delivery_address[0].delivery_phone || "",
          fax: data.delivery_address[0].delivery_fax || "",
          email: data.delivery_address[0].delivery_email || "",
          city: data.delivery_address[0].delivery_city || "",
          country: data.delivery_address[0].delivery_country || "",
          post_code: data.delivery_address[0].delivery_post_code || "",
          address: data.delivery_address[0].delivery_addr || "",
          address2: data.delivery_address[0].delivery_addr2 || "",
          address3: data.delivery_address[0].delivery_addr3 || ""
        })
      )
    }
    // populate dynamic field data
    const body = {
      order_user: getUserData().admin,
      brand_key,
      show_status: "Y",
      order_no: [order_no?.split("-")[0], order_no?.split("-")[1]].join("-"),
      is_po_order_temp
    }
    axios
      .post("Brand/GetDynamicFieldList", body)
      .then((res) => {
        if (res.status === 200) {
          let tempState = {}
          dispatch(setItemInfoFields(res.data))
          if (res.data.length) {
            res.data.map((field) => {
              tempState[field.title] = {
                field_id: field.field || "",
                field_value: field.value || "",
                field_label: field.label || ""
              }
            })
          }
          dispatch(setDynamicFieldData(tempState))
        }
      })
      .catch((err) => console.log(err))
  }

export const saveOrder = (order_status) => (dispatch) => {
  dispatch(setLoader(true))
  const data = store.getState().orderReducer

  const body = {
    brand_key: data.brand ? data.brand.value : "",
    order_user: getUserData().admin,
    order_no: data.orderNo.length ? data.orderNo : "",
    num: "",
    order_status,
    is_copy_order: "N",
    po_number: data.orderReference,
    factory_code: "",
    location_code: data.productionLocation ? data.productionLocation : "",
    draft_order_email: data.clientDetails?.draft_email || "",
    approver_email_address: "", // to be
    order_expdate_delivery_date: formatDateYMD(
      new Date(data.expectedDeliveryDate)
    ),
    invoice_address: [
      {
        invoice_address_id: data.invoiceAddressDetails?.address_id || "",
        invoice_contact_id: data.invoiceAddressDetails?.customer_id || "",
        invoice_cpyname: data.invoiceAddressDetails?.name || "",
        invoice_contact: data.invoiceAddressDetails?.contact_person || "",
        invoice_phone: data.invoiceAddressDetails?.phone || "",
        invoice_fax: data.invoiceAddressDetails?.fax || "",
        invoice_email: data.invoiceAddressDetails?.email || "",
        invoice_addr: data.invoiceAddressDetails?.address || "",
        invoice_addr2: data.invoiceAddressDetails?.address2 || "",
        invoice_addr3: data.invoiceAddressDetails?.address3 || ""
      }
    ],
    delivery_address: [
      {
        delivery_address_id: data.deliveryAddressDetails?.address_id || "",
        delivery_contact_id: data.deliveryAddressDetails?.contact_id || "",
        delivery_cpyname: data.deliveryAddressDetails?.name || "",
        delivery_contact: data.deliveryAddressDetails?.contact_person || "",
        delivery_phone: data.deliveryAddressDetails?.phone || "",
        delivery_fax: data.deliveryAddressDetails?.fax || "",
        delivery_email: data.deliveryAddressDetails?.email || "",
        delivery_city: data.deliveryAddressDetails?.city || "",
        delivery_country: data.deliveryAddressDetails?.country || "",
        delivery_post_code: data.deliveryAddressDetails?.post_code || "",
        delivery_addr: data.deliveryAddressDetails?.address || "",
        delivery_addr2: data.deliveryAddressDetails?.address2 || "",
        delivery_addr3: data.deliveryAddressDetails?.address3 || ""
      }
    ],
    dynamic_field: Object.values(data.dynamicFieldData),
    size_matrix_type: data.sizeMatrixType,
    size_content: buildXML(
      formatRowToCol(processSizeTable(data.sizeData, "Order"))
    ),
    default_size_content: data.defaultSizeTable,
    size_pointer: "",
    coo: data.coo,
    shrinkage_percentage: "",
    item_ref: data.selectedItems.map((item) => {
      return {
        item_key: item.guid_key || "",
        item_ref: item.item_ref || "",
        qty: item.qty || 0,
        price: item.price || "",
        currency: item.currency || "",
        is_non_size: item.is_non_size || ""
      }
    }),
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
          percentage: data.percentage,
          seqno: (index + 1) * 10
        })),
        default_content: data.defaultContentData?.map((cont, index) => ({
          cont_key: cont.cont_key || "",
          seqno: (index + 1) * 10
        })),
        care: data.careData.map((data, index) => ({
          care_key: data.care_key,
          seqno: (index + 1) * 10
        })),
        icon: Object.values(data.washCareData)?.map((obj, index) => ({
          icon_group: obj.icon_group,
          icon_type_id: obj.icon_type_id,
          icon_key: obj.icon_key,
          seqno: (index + 1) * 10
        }))
      }
    ]
  }

  axios
    .post("Order/SaveOrder", body)
    .then(async (res) => {
      dispatch(setLoader(false))
      if (res.status === 200) {
        if (res.data.status && res.data.status === "Fail") {
          if (res.data.status_description === "validation") {
            // ** highlight validatation
            const {
              setOrderFormValidations,
              setCurrentStep
            } = require(`@redux/actions/views/Order/Order`)
            dispatch(setCurrentStep("Order Form"))
            dispatch(setOrderFormValidations(res.data.fields))
          } else {
            // ** popup validations
            sweetAlert(
              `${order_status} Order Save Failed!`,
              res.data.status_description,
              "error",
              "danger"
            )
          }
        } else {
          const confirmation = await sweetAlert(
            `${order_status} Order Save Successful`,
            "",
            "success",
            "success"
          )
          if (
            store.getState().listReducer?.isOrderNew &&
            confirmation.isConfirmed
          ) {
            history.push("/List")
          }
        }
      }
    })
    .catch((err) => console.log(err))
}

const buildXML = (jsObj) => {
  try {
    const builder = new xml2js.Builder({ explicitArray: false })
    return builder.buildObject(jsObj)
  } catch (err) {
    console.log("err", err)
    // alert(
    //   "Something went wrong while processing size table please try again later"
    // )
  }
}

const formatRowToCol = (table) => {
  if (!table) return null
  const newTable = []
  try {
    table.forEach((row, rIndex) => {
      Object.keys(row).forEach((key, index) => {
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
  } catch (err) {
    console.log("Something went while transposing size data", err)
    return null
  }
  console.log("newTab", newTable)
  return {
    SizeMatrix: {
      Table: newTable
    }
  }
}

const processSizeTable = (table, module, index) => {
  let cols
  if (module === "Order") {
    cols = store.getState().orderReducer.cols
  } else {
    cols = store.getState().poOrderReducer?.cols[index]
  }
  let processedTable
  try {
    processedTable = table.map((row) => {
      cols
        .map((col) => col.selector)
        ?.forEach((key) => {
          if (key.includes("QTY ITEM REF")) {
            // for QTY ITEM REF
            // initialize if empty
            if (!key.includes("WITH WASTAGE")) {
              if (!row[key]) {
                row[key] = ""
              }
            } else {
              // for QTY ITEM REF WITH WASTAGE
              const itemNo = key.split(" ")[3]
              row[`QTY ITEM REF ${itemNo}`] = row[key] ? row[key] : ""
              delete row[key]
            }
          }
          // for upc/ean code
          console.log(key)
          if (key === "UPC/EAN CODE" && !row[key]) {
            row[key] = ""
          }
        })
      return row
    })
  } catch (err) {
    console.log("Something went wrong while preprocessing sizetable", err)
  }
  return processedTable
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
    order_no: data.orderNo.length ? data.orderNo : "",
    guid_key: data.combinedPOOrderKey,
    num: "",
    order_status,
    is_copy_order: "N",
    po_number: data.orderReference,
    factory_code: "",
    location_code: data.productionLocation ? data.productionLocation : "",
    draft_order_email: data.clientDetails?.draft_email || "",
    approver_email_address: "",
    order_expdate_delivery_date: formatDateYMD(
      new Date(data.expectedDeliveryDate)
    ),
    invoice_address: [
      {
        invoice_address_id: data.invoiceAddressDetails?.dyn_address_id || "",
        invoice_contact_id: data.invoiceAddressDetails?.dyn_customer_id || "",
        invoice_cpyname: data.invoiceAddressDetails?.name || "",
        invoice_contact: data.invoiceAddressDetails?.contact_person || "",
        invoice_phone: data.invoiceAddressDetails?.phone || "",
        invoice_fax: data.invoiceAddressDetails?.fax || "",
        invoice_email: data.invoiceAddressDetails?.email || "",
        invoice_addr: data.invoiceAddressDetails?.address || "",
        invoice_addr2: data.invoiceAddressDetails?.address2 || "",
        invoice_addr3: data.invoiceAddressDetails?.address3 || ""
      }
    ],
    delivery_address: [
      {
        delivery_address_id: data.deliveryAddressDetails?.dyn_address_id || "",
        delivery_contact_id: data.deliveryAddressDetails?.dyn_customer_id || "",
        delivery_cpyname: data.deliveryAddressDetails?.name || "",
        delivery_contact: data.deliveryAddressDetails?.contact_person || "",
        delivery_phone: data.deliveryAddressDetails?.phone || "",
        delivery_fax: data.deliveryAddressDetails?.fax || "",
        delivery_email: data.deliveryAddressDetails?.email || "",
        delivery_city: data.deliveryAddressDetails?.city || "",
        delivery_country: data.deliveryAddressDetails?.country || "",
        delivery_post_code: data.deliveryAddressDetails?.post_code || "",
        delivery_addr: data.deliveryAddressDetails?.address || "",
        delivery_addr2: data.deliveryAddressDetails?.address2 || "",
        delivery_addr3: data.deliveryAddressDetails?.address3 || ""
      }
    ],
    dynamic_field: Object.values(data.dynamicFieldData),
    summary_size_table: processSummarySizeTable(data) || "",
    coo: data.coo,
    shrinkage_percentage: "",
    item_ref: data.selectedItems.map((item) => ({
      item_key: item.guid_key || "",
      item_ref: item.item_ref || "",
      qty: item.qty || 0,
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
          percentage: data.percentage,
          seqno: (index + 1) * 10
        })),
        default_content: data.defaultContentData?.map((cont, index) => ({
          cont_key: cont.cont_key || "",
          seqno: (index + 1) * 10
        })),
        care: data.careData.map((data, index) => ({
          care_key: data.care_key,
          seqno: (index + 1) * 10
        })),
        icon: Object.values(data.washCareData)?.map((obj, index) => ({
          icon_group: obj.icon_group,
          icon_type_id: obj.icon_type_id,
          icon_key: obj.icon_key,
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
    po_size_tables: data.sizeData?.map((sizeData, index) => ({
      guid_key: "",
      order_key: "",
      brand_key: "",
      edi_order_no: "",
      consolidated_id: "",
      group_type: "",
      item_ref: data.selectedItems
        .filter((item) => item.is_non_size === "N")
        .map((item) => ({
          item_key: item.guid_key || "",
          item_ref: item.item_ref || "",
          qty: item.qty || 0,
          price: item.price || "",
          currency: item.currency || ""
        })),
      size_matrix_type: data.sizeMatrixType,
      size_content: buildXML(
        formatRowToCol(
          processSizeTable(sizeData.size_content, "POOrder", index)
        )
      ),
      send_date: "",
      create_date: ""
    }))
  }

  axios
    .post("Order/SaveOrder", body)
    .then(async (res) => {
      dispatch(setLoader(false))
      if (res.status === 200) {
        if (res.data.status === "Fail") {
          if (
            res.data.status_description?.length &&
            res.data.status_description === "validation"
          ) {
            // ** highlight validations
            const {
              setOrderFormValidations,
              setCurrentStep
            } = require(`@redux/actions/views/Order/POOrder`)
            dispatch(setCurrentStep("Order Form"))
            dispatch(setOrderFormValidations(res.data.fields))
          } else {
            // ** popup validations
            const confirmation = await sweetAlert(
              `${order_status} Order Save Failed!`,
              res.data.status_description,
              "error",
              "danger"
            )
            if (store.listReducer.isOrderNew && confirmation) {
              history.push("/List")
            }
          }
        } else {
          sweetAlert(
            `${order_status} Order Save Successful`,
            "",
            "success",
            "success"
          )
        }
      }
    })
    .catch((err) => console.log(err))
}
