import { useState, useEffect } from "react"
import { FileMinus } from "react-feather"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"

const Stepper = (props) => {
  const { t } = useTranslation()

  const normalSelectedItemValidation = (menuItem) => {
    if (
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
      menuItem === "Listing" &&
      props.component === "POOrder" &&
      props.validationFields?.poSelectedItems &&
      props.validationFields?.poSelectedItems?.length <= 0
    ) {
      alert("Please select an order to continue")
      return false
    }
    return true
  }

  const poItemListValidation = () => {
    if (
      props.component === "POOrder" &&
      props.validationFields?.selectedItems &&
      props.validationFields?.selectedItems?.length <= 0
    ) {
      alert("Please select an item to continue")
      return false
    }
    return true
  }

  const normalOrderFormManFieldsValidation = (menuItem) => {
    // to end the loop when one of the man fields is empty
    let localFlag = true
    if (props.validationFields?.orderFormManFields) {
      Object.keys(props.validationFields.orderFormManFields).map((field) => {
        if (
          props.component === "Order" &&
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
    return localFlag
  }

  const poOrderFormManFieldsValidation = (menuItem) => {
    // to end the loop when one of the man fields is empty
    let localFlag = true
    if (props.validationFields?.orderFormManFields) {
      Object.keys(props.validationFields.orderFormManFields).map((field) => {
        if (
          props.component === "POOrder" &&
          props.validationFields.orderFormManFields[field].length <= 0 &&
          props.currentStep === 3 &&
          localFlag &&
          !["Listing", "Item List", "PO Order Size Table"].includes(menuItem)
        ) {
          alert("Please enter mandatory fields to proceed")
          localFlag = false
        }
      })
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
                  poItemListValidation() &&
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
