const CustomFormFeedback = (props) => {
  return (
    <div style={{ fontSize: 12, marginTop: "4px", color: "#ea5455" }}>
      {props.errMsg}
    </div>
  )
}

export default CustomFormFeedback
