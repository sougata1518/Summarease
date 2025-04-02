import { publicAxios,privateAxios } from "../Helper"

export const loginUser = async (code) => {
    return await publicAxios.post(`/login`,code)
    .then(response=>response.data)
}

export const logoutUser = async () => {
    return await privateAxios.get(`/logout`)
    .then(response=>response.data)
}