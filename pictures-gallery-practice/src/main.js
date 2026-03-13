import getImagesByQuery from "./js/pixabay-api";
import renderData from "./js/render-functions";
let outputField = document.querySelector("#app");
let searchForm = document.querySelector("#inputForm");
let loadMoreBtn = document.querySelector("#ladMoreBtn");
// console.log(searchForm);
searchForm.addEventListener("submit", sumbitFormHandler);
outputField.innerHTML = `Please enter an image to search...`;

let page = 1;
let currentQuery = "";
async function sumbitFormHandler(e) {
  outputField.innerHTML = "";
  page = 1;
  e.preventDefault();
  currentQuery = e.target[0].value;

  renderFunction(currentQuery);
}

loadMoreBtn.addEventListener("click", loadMoreFunction);

function loadMoreFunction(e) {
  e.preventDefault();

  page += 1;

  renderFunction(currentQuery);
}

async function renderFunction(searchQuery) {
  loadMoreBtn.classList.add("visually-hidden");

  let per_page = 20;
  let responseData = await getImagesByQuery(searchQuery, page);

  // Use totalHits for Pixabay, as 'total' is the total images in their DB,
  // but totalHits is what matches your specific search.
  let totalPages = Math.ceil(responseData.totalHits / per_page);
  let outputHTML = renderData(responseData.hits);

  // 1. FIRST: Add the images to the DOM
  outputField.insertAdjacentHTML("beforeend", outputHTML);

  // 2. SECOND: Now that images are on the page, measure and scroll
  if (page > 1) {
    const galleryItem = document.querySelector(".js-gallery-item");

    if (galleryItem) {
      // Get the height of one card
      const cardHeight = galleryItem.getBoundingClientRect().height;

      window.scrollBy({
        top: cardHeight * 2, // Scroll down 2 rows/cards
        behavior: "smooth",
      });
    }
  }

  // 3. FINALLY: Show the button if there are more pages
  if (page < totalPages) {
    loadMoreBtn.classList.remove("visually-hidden");
  }
}
