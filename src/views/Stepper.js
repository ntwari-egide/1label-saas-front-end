import { useState, useEffect } from "react"
import { FileMinus } from "react-feather"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"

const Stepper = (props) => {
  const { t } = useTranslation()

  const normalSelectedItemValidation = (menuItem) => {
    if (
      props.component === "Order" &&
      menuItem != "Select Item" &&
      props.validationFields?.selectedItems &&
      props.validationFields?.selectedItems?.length <= 0
    ) {
      alert("Please select an item to continue")
      return false
    }
    return true
  }

  const poSelectedItemsValidation = (menuItem) => {
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
      props.validationFields?.poSelectedItems &&
      props.validationFields?.poSelectedItems?.length <= 0
    ) {
      alert("Please select an order to continue")
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
      alert("Please select an item in Item List page to continue")
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
            props.currentStep === 1 &&
            localFlag &&
            menuItem != "Select Item"
          ) {
            const tempState = props.orderFormManFields
            tempState[field] = true
            props.setOrderFormManFields({ ...tempState })
            alert("Please enter mandatory fields")
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
            alert("Please enter mandatory fields of Order Form to proceed")
            localFlag = false
          }
        })
      }
    }
    return localFlag
  }

  return (
    <div style={{ paddingBottom: "10px" }}>
      <Breadcrumb>
        {props.stepperMenu.map((menuItem, index) => (
          <BreadcrumbItem>
            <div
              className="custom-stepper"
              onClick={() => {
                if (
                  normalSelectedItemValidation(menuItem) &&
                  poSelectedItemsValidation(menuItem) &&
                  normalOrderFormManFieldsValidation(menuItem) &&
                  poItemListValidation(menuItem) &&
                  poOrderFormManFieldsValidation(menuItem)
                ) {
                  props.setCurrentStep(index)
                }
              }}
            >
              <div
                id="selectItemIcon"
                className={
                  props.currentStep === index
                    ? "stepper-active-icon"
                    : props.currentStep > index
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
                      : props.currentStep > index
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
