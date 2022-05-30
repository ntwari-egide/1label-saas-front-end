import { useState, useEffect } from "react"
import { Check, FileMinus } from "react-feather"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"

const Stepper = (props) => {
  const { t } = useTranslation()
  return (
    <div style={{ paddingBottom: "10px" }}>
      <Breadcrumb>
        {props.stepperMenu.map((item, index) => (
          <BreadcrumbItem>
            <div
              className="custom-stepper"
              onClick={() => {
                let validationPassed = true
                // validation for selected items
                if (
                  props.validationFields?.selectedItems &&
                  props.validationFields?.selectedItems?.length <= 0
                ) {
                  alert("Please select an item to continue")
                  validationPassed = false
                }
                // validation for poselectedtiems
                if (
                  props.validationFields?.poSelectedItems &&
                  props.validationFields?.poSelectedItems?.length <= 0
                ) {
                  alert("Please select an item to continue")
                  validationPassed = false
                }

                // validation for Order Form mandatory fields
                if (props.validationFields?.orderFormManFields) {
                  Object.keys(props.validationFields.orderFormManFields).map(
                    (field) => {
                      if (
                        props.validationFields.orderFormManFields[field]
                          .length <= 0 &&
                        props.currentStep === 1
                      ) {
                        const tempState = props.orderFormManFields
                        tempState[field] = true
                        props.setOrderFormManFields({ ...tempState })
                        validationPassed = false
                      }
                    }
                  )
                  if (!validationPassed && props.currentStep === 1) {
                    alert("Please enter mandatory fields")
                  }
                }
                if (validationPassed) {
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
                  {t(`${item}`)}
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
