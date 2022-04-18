import { useState, useEffect } from "react"
import { Check, FileMinus } from "react-feather"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"

const Stepper = (props) => {
  return (
    <div style={{ paddingBottom: "10px" }}>
      <Breadcrumb>
        <BreadcrumbItem>
          <div
            className="custom-stepper"
            onClick={() => props.setCurrentStep(1)}
          >
            <div
              id="selectItemIcon"
              className={
                props.currentStep === 1
                  ? "stepper-active-icon"
                  : props.currentStep > 1
                  ? "stepper-passed-icon"
                  : "stepper-pending-icon"
              }
            >
              <FileMinus size={25} />
            </div>
            <div>
              <h5
                className={
                  props.currentStep === 1
                    ? "stepper-active-text"
                    : props.currentStep > 1
                    ? "stepper-passed-text"
                    : "stepper-pending-text"
                }
              >
                Select Item
              </h5>
            </div>
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <div
            className="custom-stepper"
            onClick={() => props.setCurrentStep(2)}
          >
            <div
              id="selectItemIcon"
              className={
                props.currentStep === 2
                  ? "stepper-active-icon"
                  : props.currentStep > 2
                  ? "stepper-passed-icon"
                  : "stepper-pending-icon"
              }
            >
              <FileMinus size={25} />
            </div>
            <div>
              <h5
                className={
                  props.currentStep === 2
                    ? "stepper-active-text"
                    : props.currentStep > 2
                    ? "stepper-passed-text"
                    : "stepper-pending-text"
                }
              >
                Order Form
              </h5>
            </div>
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <div
            className="custom-stepper"
            onClick={() => props.setCurrentStep(3)}
          >
            <div
              id="selectItemIcon"
              className={
                props.currentStep === 3
                  ? "stepper-active-icon"
                  : props.currentStep > 3
                  ? "stepper-passed-icon"
                  : "stepper-pending-icon"
              }
            >
              <FileMinus size={25} />
            </div>
            <div>
              <h5
                className={
                  props.currentStep === 3
                    ? "stepper-active-text"
                    : props.currentStep > 3
                    ? "stepper-passed-text"
                    : "stepper-pending-text"
                }
              >
                Preview Item & Summary Size Table
              </h5>
            </div>
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <div
            className="custom-stepper"
            onClick={() => props.setCurrentStep(4)}
          >
            <div
              id="selectItemIcon"
              className={
                props.currentStep === 4
                  ? "stepper-active-icon"
                  : props.currentStep > 4
                  ? "stepper-passed-icon"
                  : "stepper-pending-icon"
              }
            >
              <FileMinus size={25} />
            </div>
            <div>
              <h5
                className={
                  props.currentStep === 4
                    ? "stepper-active-text"
                    : props.currentStep > 4
                    ? "stepper-passed-text"
                    : "stepper-pending-text"
                }
              >
                Invoice & Delivery Date
              </h5>
            </div>
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <div
            className="custom-stepper"
            onClick={() => props.setCurrentStep(5)}
          >
            <div
              id="selectItemIcon"
              className={
                props.currentStep === 5
                  ? "stepper-active-icon"
                  : props.currentStep > 5
                  ? "stepper-passed-icon"
                  : "stepper-pending-icon"
              }
            >
              <FileMinus size={25} />
            </div>
            <div>
              <h5
                className={
                  props.currentStep === 5
                    ? "stepper-active-text"
                    : props.currentStep > 5
                    ? "stepper-passed-text"
                    : "stepper-pending-text"
                }
              >
                Payment
              </h5>
            </div>
          </div>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <div
            className="custom-stepper"
            onClick={() => props.setCurrentStep(6)}
          >
            <div
              id="selectItemIcon"
              className={
                props.currentStep === 6
                  ? "stepper-active-icon"
                  : props.currentStep > 6
                  ? "stepper-passed-icon"
                  : "stepper-pending-icon"
              }
            >
              <FileMinus size={25} />
            </div>
            <div>
              <h5
                className={
                  props.currentStep === 6
                    ? "stepper-active-text"
                    : props.currentStep > 6
                    ? "stepper-passed-text"
                    : "stepper-pending-text"
                }
              >
                Direct Print
              </h5>
            </div>
          </div>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  )
}

export default Stepper
