import React, { useState, useEffect } from "react"
import { useSkin } from "@hooks/useSkin"
import { Link, useHistory } from "react-router-dom"
import InputPasswordToggle from "@components/input-password-toggle"
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)
import { DefaultRoute } from "../router/routes"
import "@styles/base/pages/page-auth.scss"
import { useDispatch, connect } from "react-redux"
import { handleLogin, handleLogout } from "@store/actions/auth"

// import PrivacyPolicyPage from '../views/PrivacyPolicyPage'
// ** Configs
import themeConfig from "@configs/themeConfig"

const Login = ({ serverError, userData }) => {
  console.log("userData", userData)
  const [skin] = useSkin()
  const history = useHistory()
  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require(`@src/assets/images/pages/${illustration}`).default
  // ** Store Vars
  const dispatch = useDispatch()
  //set local state in to set up values
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [entity, setEntity] = useState("")
  const [isopen, setIsopen] = useState(false)
  const [isRemember, setIsRemember] = useState(false)

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      console.log("already logged in")
      if (isRemember) {
        const userData = {
          username,
          userpwd: password
        }
        localStorage.setItem("isRemember", JSON.stringify(userData))
      } else {
        if (localStorage.getItem("isRemember")) {
          localStorage.removeItem("isRemember")
        }
      }
      // history.push(DefaultRoute)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem("isRemember")) {
      const getdata = JSON.parse(localStorage.getItem("isRemember"))
      setIsRemember(true)
      setUsername(getdata.username)
      setPassword(getdata.password)
    }
  }, [])

  const closeModal = () => {
    localStorage.removeItem("userData")
    dispatch(handleLogout())
    setIsopen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    let userData = null
    if (username && password) {
      userData = {
        username,
        password
      }

      if (isRemember && userData) {
        localStorage.setItem("isRemember", JSON.stringify(userData))
      }
      // history.push("/home")
      dispatch(handleLogin(userData))
    } else {
      return MySwal.fire({
        title: "All fields Required",
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-primary"
        },
        buttonsStyling: false
      })
    }
  }

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/">
          <img
            src={themeConfig.app.appLogoImage}
            alt="logo"
            style={{ height: "35px" }}
          />
          <h2 className="brand-text text-primary ml-1">
            {themeConfig.app.appNameUnbreak}
          </h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Welcome to {themeConfig.app.appNameUnbreak}! 👋
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText>
            {/* Server Error response */}
            {serverError ? (
              <Alert color="danger">
                <div className="alert-body">{serverError}</div>
              </Alert>
            ) : (
              ""
            )}
            <Form className="auth-login-form mt-2" onSubmit={handleSubmit}>
              <FormGroup>
                <Label className="form-label" for="login-email">
                  Username
                </Label>
                <Input
                  type="text"
                  id="login-email"
                  placeholder="Username"
                  value={username}
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="login-password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </FormGroup>
              <FormGroup className="ml-2">
                <Label check>
                  <Input
                    type="checkbox"
                    name="remeberMe"
                    onChange={() => setIsRemember(!isRemember)}
                    checked={isRemember === true}
                  />
                  Remember Me
                </Label>
                {/* <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' /> */}
              </FormGroup>
              <Button.Ripple color="primary" block type="submit">
                Sign in
              </Button.Ripple>
            </Form>
          </Col>
        </Col>
      </Row>
      <Modal isOpen={isopen} className="modal-lg">
        <ModalHeader></ModalHeader>
        <ModalBody>{/* <PrivacyPolicyPage></PrivacyPolicyPage> */}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => history.push(DefaultRoute)}>
            Accept
          </Button>
          <Button onClick={() => closeModal()}>Deny</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  serverError: state.auth.serverError,
  userData: state.auth.userData
})

export default connect(mapStateToProps, null)(Login)
