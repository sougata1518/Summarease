import { publicAxios,privateAxios } from "../Helper"

export const createEditor = async (textContent,next) => {
    await privateAxios.post(`/createEditor`,textContent)
        .then(response=>response.data)
    next()
}


export const fetchContent = async (roomId) => {
    return await privateAxios.get(`/fetchContent/${roomId}`)
        .then(response=>response.data)
}

export const updateContent = async (deltaJson) => {
    await privateAxios.post(`/updateContent`,deltaJson)
}
export const setContent = async (doc) => {
    await privateAxios.post(`/setFullContent`,doc)
}