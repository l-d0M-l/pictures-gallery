import axios from "axios";
// console.log(axios);

const myApiKey = "48370446-8dcf2f9524038c25db09fe77e";

// axios.defaults.headers.common["key"] = myApiKey;

async function getImagesByQuery(query, page) {
  let response = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: myApiKey,
      q: query,
      page,
    },
  });

  // console.log(response.data);
  return response.data;
}

export default getImagesByQuery;
