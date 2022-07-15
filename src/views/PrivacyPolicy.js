import { connect } from "react-redux"

const PrivacyPolicy = (props) => {
  return (
    <div style={{ minHeight: "calc(100vh - 155px)" }}>
      {props.privacyPolicyContent}
    </div>
  )
}

const mapStateToProps = (state) => ({
  privacyPolicyContent: state.footerReducer.privacyPolicyContent
})

export default connect(mapStateToProps, null)(PrivacyPolicy)
