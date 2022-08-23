import { useState, useEffect } from "react"
import { FileMinus } from "react-feather"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { sweetAlert } from "@utils"

const Stepper = (props) => {
  const { t } = useTranslation()
  // ** to change style of step icon and text ** //
  const [currentMenuIndex, setCurrentMenuIndex] = useState(null)

  const evalCurrencMenuIndex = (menuItem) => {
    return props.stepperMenu.indexOf(menuItem)
  }

  const normalSelectedItemValidation = (menuItem) => {
    if (
      props.component === "Order" &&
      menuItem != "Select Item" &&
      props.validationFields?.selectedItems &&
      props.validationFields?.selectedItems?.length <= 0
    ) {
      sweetAlert("", "Please select an item to continue", "warning", "warning")
      return false
    }
    return true
  }

  const poSelectedOrdersValidation = (menuItem) => {
    if (
      [
        "Item List",
        "PO Order Size Table",
        "Order Form",
        "Preview Item & Summary Size Table",
        "Invoice & Delivery Date",
        "Payment",
        "Direct Print"
      ].includes(menuItem) &&
      props.component === "POOrder" &&
      props.validationFields?.poSelectedOrders &&
      props.validationFields?.poSelectedOrders?.length <= 0 &&
      props.isOrderNew
    ) {
      sweetAlert("", "Please select an order to continue", "warning", "warning")
      return false
    }
    return true
  }

  const poItemListValidation = (menuItem) => {
    if (
      [
        "PO Order Size Table",
        "Order Form",
        "Preview Item & Summary Size Table",
        "Invoice & Delivery Date",
        "Payment",
        "Direct Print"
      ].includes(menuItem) &&
      props.component === "POOrder" &&
      props.validationFields?.selectedItems &&
      props.validationFields?.selectedItems?.length <= 0
    ) {
      sweetAlert(
        "",
        "Please select an item in Item List page to continue",
        "warning",
        "warning"
      )
      return false
    }
    return true
  }

  const normalOrderFormManFieldsValidation = (menuItem) => {
    // to end the loop when one of the man fields is empty
    let localFlag = true
    if (props.component === "Order") {
      if (props.validationFields?.orderFormManFields) {
        Object.keys(props.validationFields.orderFormManFields).map((field) => {
          if (
            field === "productionLocation" &&
            props.brandDetails?.display_location_code === "N"
          ) {
            return
          }
          if (
            field === "expectedDeliveryDate" &&
            props.brandDetails?.is_show_expected_date === "N"
          ) {
            return
          }
          if (
            props.validationFields.orderFormManFields[field].length <= 0 &&
            localFlag &&
            !["Select Item", "Order Form"].includes(menuItem)
          ) {
            const tempState = props.orderFormManFields
            tempState[field] = true
            props.setOrderFormManFields({ ...tempState })
            sweetAlert(
              "",
              "Please enter mandatory fields of Order Form to proceed",
              "warning",
              "warning"
            )
            localFlag = false
          }
        })
      }
    }
    return localFlag
  }

  const poOrderFormManFieldsValidation = (menuItem) => {
    // to end the loop when one of the man fields is empty
    let localFlag = true
    if (props.component === "POOrder") {
      if (props.validationFields?.orderFormManFields) {
        Object.keys(props.validationFields.orderFormManFields).map((field) => {
          if (
            field === "productionLocation" &&
            props.brandDetails?.display_location_code === "N"
          ) {
            return
          }
          if (
            field === "expectedDeliveryDate" &&
            props.brandDetails?.is_show_expected_date === "N"
          ) {
            return
          }
          if (
            props.validationFields.orderFormManFields[field].length <= 0 &&
            localFlag &&
            ![
              "Listing",
              "Item List",
              "PO Order Size Table",
              "Order Form"
            ].includes(menuItem)
          ) {
            sweetAlert(
              "",
              "Please enter mandatory fields of Order Form to proceed",
              "warning",
              "warning"
            )
            localFlag = false
          }
        })
      }
    }
    return localFlag
  }

  useEffect(() => {
    // ** to change style of step icon and text ** //
    setCurrentMenuIndex(evalCurrencMenuIndex(props.currentStep))
  }, [props.currentStep])

  return (
    <div style={{ paddingBottom: "10px" }}>
      <Breadcrumb>
        {props.stepperMenu.map((menuItem, index) => (
          <BreadcrumbItem>
            <div
              className="custom-stepper"
              onClick={() => {
                // if (
                //   normalSelectedItemValidation(menuItem) &&
                //   poSelectedOrdersValidation(menuItem) &&
                //   normalOrderFormManFieldsValidation(menuItem) &&
                //   poItemListValidation(menuItem) &&
                //   poOrderFormManFieldsValidation(menuItem)
                // ) {
                //   props.setCurrentStep(menuItem)
                // }
              }}
            >
              <div
                id="selectItemIcon"
                className={
                  props.currentStep === menuItem
                    ? "stepper-active-icon"
                    : currentMenuIndex > index
                    ? "stepper-passed-icon"
                    : "stepper-pending-icon"
                }
              >
                <FileMinus size={25} />
              </div>
              <div>
                <h5
                  className={
                    props.currentStep === index
                      ? "stepper-active-text"
                      : currentMenuIndex > index
                      ? "stepper-passed-text"
                      : "stepper-pending-text"
                  }
                >
                  {t(`${menuItem}`)}
                </h5>
              </div>
            </div>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  )
}

export default Stepper
