import { data } from "autoprefixer"
import { publicAxios, privateAxios } from "../Helper"

export const createEditor = async (textContent, next) => {
    await privateAxios.post(`/createEditor`, textContent)
        .then(response => response.data)
    next()
}

export const fetchContent = async (roomId) => {
    return await privateAxios.get(`/fetchContent/${roomId}`)
        .then(response => response.data)
}

export const updateContent = async (deltaJson) => {
    await privateAxios.post(`/updateContent`, deltaJson)
}
export const setContent = async (doc) => {
    await privateAxios.post(`/setFullContent`, doc)
}

export const aiSummaryResponse = async (formdata) => {
    try {
        const response = await publicAxios.post(`/getResSummary`, formdata, {
            responseType: "blob"
        });
        return { success: true, data: response.data };

    } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data;

        return {
            success: false,
            status: status || 500,
            message: message || "Something went wrong"
        };
    }
};


export const aiGrammerResponse = async (formdata) => {
    try {
        const response = await publicAxios.post(`/getResGrammar`, formdata, {
            responseType: "blob"
        })
        return { success: true, data: response.data }
    } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data;

        return {
            success: false,
            status: status || 500,
            message: message || "Something went wrong"
        };
    }

}

export const aiKeyResponse = async (formdata) => {
    try {
        const response =
            await publicAxios.post(`/getResKeyWords`, formdata, {
                responseType: "blob"
            })
        return { success: true, data: response.data };
    } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data;

        return {
            success: false,
            status: status || 500,
            message: message || "Something went wrong"
        };
    }
}

export const saveVersion = async (data) => {
    return privateAxios.post(`/saveVersion`, data);
};

export const fetchAllVersions = async (editorId) => {
    const response = await privateAxios.get(`/fetchAllVer/${editorId}`);
    return response.data;
};

export const fetchVersionById = async (verId) => {
    const response = await privateAxios.get(`/fetchVersion/${verId}`);
    return response.data;
};