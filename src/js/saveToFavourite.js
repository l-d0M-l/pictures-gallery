import { getImageById } from "./pixabay-api";

async function saveToFavourite(elementId) {
  // 1. Get the current string and convert it back to an Array (or start with empty array)
  const savedData = localStorage.getItem("savedPictures");
  let savedArray = savedData ? JSON.parse(savedData) : [];

//   console.log(savedArray);
  // 2. Prevent duplicates: Check if the ID already exists in your favorites
  if (savedArray.some((item) => item.id === elementId)) {
    console.log("Image already saved!");
    return;
  }

  try {
    const cardToSave = await getImageById(elementId);

    // 3. Create the new array with the new hit
    const newSavedArray = [...savedArray, cardToSave.hits[0]];

    // 4. Convert the array back to a JSON string before saving
    localStorage.setItem("savedPictures", JSON.stringify(newSavedArray));

    // console.log("Success! New array size:", newSavedArray.length);
  } catch (error) {
    console.error("Failed to save image:", error);
  }
}

export default saveToFavourite;
