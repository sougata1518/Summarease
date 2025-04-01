import { publicAxios } from "../Helper"

export const loginUser = async (code) => {
    return await publicAxios.post(`/login`,code)
    .then(response=>response.data)
}