import axios from "@axios"

export const getUserAccessRights = async (funcid) => {
  const username = JSON.parse(localStorage.getItem("userData")).username
  const params = {
    username,
    funcid
  }
  try {
    const res = await axios.get("/home/getPageAccess", { params })
    if (res.status === 200) {
      return await res.data.Data[0][0]
    }
  } catch (err) {
    console.log(err)
  }
}
