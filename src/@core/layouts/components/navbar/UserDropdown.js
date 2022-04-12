// ** React Imports
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
// ** Custom Components
import Avatar from "@components/avatar"

// ** Utils
import { isUserLoggedIn, getDisplayName } from "@utils"
import axios from "@axios"

// ** Store & Actions
import { useDispatch } from "react-redux"
import { handleLogout } from "@store/actions/auth"

// ** Third Party Components
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap"
import { User, Mail, CheckSquare, MessageSquare, Power } from "react-feather"

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  // ** State
  const [userData, setUserData] = useState(null)
  const [userProfile, setUserProfile] = useState("")

  const getUserProfile = (data) => {
    // /home/getHomeMsg?username=a
    if (data && data["username"]) {
      axios.get(`Home/getHomeMsg?username=${data["username"]}`).then((res) => {
        if (res?.data?.Data[0]) {
          setUserProfile(res.data.Data[0][0]?.userPic)
        }
      })
    }
  }
  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")))
      getUserProfile(JSON.parse(localStorage.getItem("userData")))
    }
  }, [])

  //** Vars
  // const userAvatar = (userData && userData.avatar) || defaultAvatar

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        {userProfile ? (
          <Avatar className="mr-1" img={userProfile} color="primary" />
        ) : (
          <Avatar
            className="mr-1"
            color="gray-300"
            content={getDisplayName(userData ? userData["username"] : "")}
          />
        )}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <User size={14} className="mr-75" />
          <span className="align-middle">{"Profile"}</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <Mail size={14} className="mr-75" />
          <span className="align-middle">{"Inbox"}</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <CheckSquare size={14} className="mr-75" />
          <span className="align-middle">{"Tasks"}</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="#" onClick={(e) => e.preventDefault()}>
          <MessageSquare size={14} className="mr-75" />
          <span className="align-middle">{"Chats"}</span>
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="mr-75" />
          <span className="align-middle">{"Logout"}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
