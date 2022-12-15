
import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
})

const getUrlForCoffeeStores = (latLong, query, limit) => {
    const baseUrl = 'https://api.foursquare.com/v3/places/search?'
    return `${baseUrl}query=${query}&ll=${latLong}&limit=${limit}`
}
const getListOfCoffeePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 30,
    })
    return photos.response.results.map(
        result => result.urls['small']
    );
}

export const fetchCoffeeStores = async (
    latLong = '39.80123524569362,-76.98318604228164',
    limit = 6
  ) => {
    const photos = await getListOfCoffeePhotos()
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
      };
      
      const response = await fetch(
        getUrlForCoffeeStores(
            latLong,
            'coffee',
            limit
        ), 
        options
        )
      const data = await response.json()
      return data.results.map((result, index) => ({
        ...result,
        imgUrl: photos[index],
        id: result.fsq_id
      }))
        // .catch(err => console.error(err));
}