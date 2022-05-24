import { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem } from "reactstrap"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const List = () => {
  const { t } = useTranslation()
  return (
    <div>
      <div style={{ display: "flex" }}>
        <h2>{t("List")}</h2>
        <div
          style={{
            borderRight: "thin solid",
            marginLeft: "10px",
            marginBottom: "10px"
          }}
        ></div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/home">{t("Home")}</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/Order">{t("Order")}</Link>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
  )
}

export default List
