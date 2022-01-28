import axios from 'axios';


const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "24480892-2cf9ff0ac9dbac3af2a958edd";


export const fetchImages = async (query) => {
    let page = Number(localStorage.getItem('page'));
    // page += 1;
    //  console.log(page)
    try {
        const fetchResponse = await axios.get(`${BASE_URL}`, {
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: page,
                per_page: 40,
            },
        })
        return fetchResponse;
    }
    catch (error) {
        console.log(error);
    }
}

