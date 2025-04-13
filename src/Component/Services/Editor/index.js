import { publicAxios,privateAxios } from "../Helper"

export const createEditor = async (textContent,next) => {
    await privateAxios.post(`/createEditor`,textContent)
        .then(response=>response.data)
    next()
}