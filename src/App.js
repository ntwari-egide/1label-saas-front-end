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
  <div>
    {/*}
      wrapped in div because of react-block-ui
      for when the pages are more then 100vh in height
     */}
    <BlockUi
      tag="body"
      blocking={props.loading}
      loader={<Spinner size="lg" color="primary" />}
    >
      <Router />
    </BlockUi>
  </div>
)

const mapStateToProps = (state) => {
  return {
    loading: state.layout.sidebarLeftLoading
  }
}

export default connect(mapStateToProps, null)(App)
