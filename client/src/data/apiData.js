import axios from 'axios';

const baseUrl = 'http://localhost:8080/api/getSingleFiles';

export const getdata = async () => {
    try{
        const {data} = await axios.get(baseUrl);
        return data;
    }catch(error) {
        throw error;
    }
}

export const getDoughData = async () => {
    try{
        const {data} = await axios.get(baseUrl);
        return data;
    }catch(error){
        throw error;
    }
}