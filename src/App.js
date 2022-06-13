// // ** Router Import
// import Router from './router/Router'

// const App = props => <Router />

// export default App
// ** Router Import
import Router from "./router/Router"
import BlockUi from "react-block-ui"
import { Spinner } from "reactstrap"
import "react-block-ui/style.css"
import { connect } from "react-redux"
// style={{ height: 'fit-content', minHeight: '100vh' }}

const App = (props) => (
  <BlockUi
    tag="body"
    blocking={props.loading}
    loader={<Spinner type="grow" size="lg" color="primary" />}
  >
    <Router />
  </BlockUi>
)

const mapStateToProps = (state) => {
  return {
    loading: state.layout.sidebarLeftLoading
  }
}

export default connect(mapStateToProps, null)(App)
