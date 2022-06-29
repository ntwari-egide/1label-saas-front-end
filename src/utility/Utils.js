// ** Checks if an object is empty (returns boolean)
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)
import { XMLParser } from "fast-xml-parser"

export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "")

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const getDisplayName = (name) => {
  const str = name
  if (str.length) {
    const matches = str.match(/\b(\w)/g) // ['J','S','O','N']
    const acronym = matches.join("") // JSON
    return acronym.toUpperCase()
  }
  return ""
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

/** @params date type new Date()
 */
export const formatDateYMD = (date) => {
  let month = date.getMonth() + 1
  let d = date.getDate()
  if (month < 10) {
    month = `0${month}`
  }
  if (d < 10) {
    d = `0${d}`
  }
  return `${date.getFullYear()}-${month}-${d}`
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: "short", day: "numeric" }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" }
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => {
  return localStorage.getItem("userData")
}

export const getUserData = () => JSON.parse(localStorage.getItem("userData"))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin") return "/"
  if (userRole === "client") return "/access-control"
  return "/login"
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed" // for input hover border-color
  }
})

export const getCookie = (cname) => {
  let name = `${cname}=`
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return null
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`
}

export const sweetAlert = (title, text, icon, btnType) => {
  return MySwal.fire({
    title,
    html: (
      <ul>
        {text.split("\r\n").map((str) => {
          if (str.length) {
            return <li>{str}</li>
          }
        })}
      </ul>
    ),
    icon,
    customClass: {
      confirmButton: `btn btn-${btnType}`
    },
    buttonsStyling: false
  })
}

export const formatColToRow = (xmlStr) => {
  if (!xmlStr.length) {
    return
  }
  let jsObj
  try {
    const parser = new XMLParser()
    jsObj = parser.parse(xmlStr)
  } catch (err) {
    console.log("something went wrong while parsing xml", err)
  }
  console.log("jsObj", jsObj)
  try {
    // actual algo
    const nRows = jsObj?.SizeMatrix?.Table[0]
      ? Object.keys(jsObj?.SizeMatrix?.Table[0]).length - 2 // sometimes good
      : Object.keys(jsObj?.SizeMatrix?.Table).length - 2 // sometimes shit // gets the no of rows
    let data = [] // initialized data to fill row by row
    let currentRow // because actual data begins at Column2
    if (jsObj?.SizeMatrix?.Table[0]) {
      currentRow = 0 + 2 // because actual data begins at Column2
    } else {
      currentRow = 0 + 2
    }
    for (let i = 0; i < nRows; i++) {
      let row = {} // initialise empty row
      // if table is array
      if (jsObj?.SizeMatrix?.Table[0]) {
        jsObj?.SizeMatrix?.Table.map((col) => {
          row[col["Column1"]] = col[`Column${currentRow}`] // row[column_name] = column_value
        })
      } else {
        row[jsObj?.SizeMatrix?.Table["Column1"]] =
          jsObj?.SizeMatrix?.Table[`Column${currentRow}`]
      }
      row.Sequence = i + 1
      data.push(row) // push the row to data
      currentRow += 1 // increment row count
    }
    return data
  } catch (err) {
    console.log("something went wrong while processing parsed xml", err)
  }
}

export const resetTotal = (itemList) => {
  if (itemList.length) {
    return itemList.map((item) => ({ ...item, total: 0 }))
  }
}
