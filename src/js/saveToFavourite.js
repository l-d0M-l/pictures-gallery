import { getImageById } from "./pixabay-api";

async function saveToFavourite(elementId) {
  //  Get the current string and convert it back to an Array (or start with empty array)
  const savedData = localStorage.getItem("savedPictures");
  let savedArray = savedData ? JSON.parse(savedData) : [];

  //   console.log(savedArray);
  //  Delete if already saved

  const exists = savedArray.some((item) => item.id === elementId);
  // console.log(exists);
  if (exists) {
    // 3. If it exists, filter it out (Delete)
    const arrayAfterDelete = savedArray.filter(
      (item) => Number(item.id) !== elementId
    );
    localStorage.setItem("savedPictures", JSON.stringify(arrayAfterDelete));
    console.log("Image deleted!");
    return;
  }

  try {
    const cardToSave = await getImageById(elementId);

    //  Create the new array with the new hit
    const newSavedArray = [...savedArray, cardToSave.hits[0]];

    //  Convert the array back to a JSON string before saving
    localStorage.setItem("savedPictures", JSON.stringify(newSavedArray));

    // console.log("Success! New array size:", newSavedArray.length);
  } catch (error) {
    console.error("Failed to save image:", error);
  }
}

export default saveToFavourite;
