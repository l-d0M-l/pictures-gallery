import { renderData, renderFavourites } from "./render-functions.js";
import getImagesByQuery from "./pixabay-api.js";

export { renderFunction, loadMoreFunction };
const loadMoreBtn = document.querySelector("#ladMoreBtn");
const loadingIndicator = document.querySelector("#loading-indicator");
const outputField = document.querySelector("#app");

async function renderFunction(objectToRender, page, per_page = 20) {
  //recieves object with .hits total hits
  loadMoreBtn.classList.add("visually-hidden");
  loadingIndicator.classList.remove("visually-hidden");

  try {
    const outputHTML = renderData(objectToRender.hits);

    // Hide indicator AS SOON AS data is back
    loadingIndicator.classList.add("visually-hidden");
    outputField.insertAdjacentHTML("beforeend", outputHTML);

    // ... handle scrolling and Load More button visibility Onlu when more thar 1 page - after at least one load more btn clicked
    const totalPages = Math.ceil(objectToRender.totalHits / per_page);
    if (page > 1) {
      const galleryItem = document.querySelector("#js-gallery-item");

      if (galleryItem) {
        // Get the height of one card
        const cardHeight = galleryItem.getBoundingClientRect().height;

        window.scrollBy({
          top: cardHeight * 2, // Scroll down 2 rows/cards
          behavior: "smooth",
        });
      }
    }
    if (page < totalPages) {
      loadMoreBtn.classList.remove("visually-hidden");
    }
  } catch (error) {
    loadingIndicator.classList.add("visually-hidden");
    console.error("Search failed", error);
  }
}

async function loadMoreFunction(
  e,
  page,
  isFavoritesMode,
  currentQuery,
  per_page
) {
  e.preventDefault();

  if (isFavoritesMode) {
    const favorites = JSON.parse(localStorage.getItem("savedPictures")) || [];
    const totalPages = Math.ceil(favorites.length / per_page);

    // Calculate the slice for the next page
    if (page - 1 < totalPages) {
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const dataToOutput = favorites.slice(start, end);
      // Use a wrapper to handle the HTML generation and scrolling
      let favsOutputHTML = renderFavourites(dataToOutput);
      outputField.innerHTML += favsOutputHTML;

      //scroll auto
      const galleryItem = document.querySelector("#js-gallery-item");

      if (galleryItem) {
        // Get the height of one card
        const cardHeight = galleryItem.getBoundingClientRect().height;

        window.scrollBy({
          top: cardHeight * 2, // Scroll down 2 rows/cards
          behavior: "smooth",
        });
      }

      //if this is the endo hide the button
      if (page == totalPages) {
        loadMoreBtn.classList.add("visually-hidden");
      }
    }
  } else {
    // Your existing API logic
    const responseData = await getImagesByQuery(currentQuery, page);
    renderFunction(responseData, page);
  }
}
