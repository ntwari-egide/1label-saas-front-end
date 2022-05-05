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
                if (props.validationField && props.validationField.length > 0) {
                  props.setCurrentStep(index)
                } else if (!props.validationField) {
                  props.setCurrentStep(index)
                  return null
                } else {
                  alert("Please select items to proceed")
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
