import {
  Mail,
  Home,
  Grid,
  Briefcase,
  FileMinus,
  CheckCircle,
  Circle
} from "react-feather"

const home = [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home"
  }
]

const one_print = [
  {
    id: "order",
    title: "Order",
    icon: <Grid />,
    navLink: "/"
  },
  {
    id: "invoice",
    title: "Invoice / Online Payment",
    icon: <Briefcase />,
    navLink: "/"
  },
  {
    id: "print",
    title: "Print",
    icon: <FileMinus />,
    navLink: "/"
  }
]

const admin = [
  {
    id: "artwork",
    title: "Artwork",
    icon: <FileMinus />,
    navLink: "/"
  },
  {
    id: "maintenance",
    title: "Maintenance",
    icon: <FileMinus />,
    navLink: "/"
  },
  {
    id: "master",
    title: "Master",
    icon: <FileMinus />,
    navLink: "/"
  },
  {
    id: "ddep",
    title: "DDEP",
    icon: <FileMinus />,
    navLink: "/"
  }
]

export { one_print, home, admin }
