import getImagesByQuery from "./js/pixabay-api.js";
import { renderData, renderFavourites } from "./js/render-functions.js";
import saveToFavourite from "./js/saveToFavourite.js";
import { renderFunction, loadMoreFunction } from "./js/helper-functions.js";
// Gettin html from the document
const outputField = document.querySelector("#app");
const searchForm = document.querySelector("#inputForm");
const loadMoreBtn = document.querySelector("#ladMoreBtn");
const navMain = document.querySelector("#nav-main");
const navFavs = document.querySelector("#nav-favs");



searchForm.addEventListener("submit", sumbitFormHandler);
outputField.innerHTML = `Please enter an image to search...`;

let page = 1;
const per_page = 20;
let currentQuery = "";
let isFavoritesMode = false;

async function sumbitFormHandler(e) {
  outputField.innerHTML = "";
  page = 1;
  e.preventDefault();
  currentQuery = e.target[0].value;

  const responseData = await getImagesByQuery(currentQuery, page);
  const totalPages = Math.ceil(responseData.totalHits / per_page);

  renderFunction(responseData, totalPages, page, per_page);
}

loadMoreBtn.addEventListener("click", loadMoreHandler);

function loadMoreHandler(e) {
  page += 1;
  loadMoreFunction(e, page, isFavoritesMode, currentQuery, per_page);
}

//scroll up logic
const scrollUpBtn = document.querySelector("#scroll-up-btn");
scrollUpBtn.addEventListener("click", scrollUpHandler);

// Show/Hide button based on scroll position
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollUpBtn.classList.remove("visually-hidden");
  } else {
    scrollUpBtn.classList.add("visually-hidden");
  }
});

function scrollUpHandler() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

//add to favourites logic
outputField.addEventListener("click", async (e) => {
  // Finds the button even if you click the icon inside it
  const btn = e.target.closest(".save-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);

  try {
    await saveToFavourite(id);
    btn.classList.toggle("save-btn-saved");
  } catch (error) {
    console.error("Save failed", error);
  }
});

//output favourites logic
function showFavourites() {
  page = 1;
  loadMoreBtn.classList.add("visually-hidden");

  const favorites = JSON.parse(localStorage.getItem("savedPictures")) || [];

  // Hide the search form since we are just viewing saved items
  searchForm.classList.add("visually-hidden");

  if (favorites.length === 0) {
    outputField.innerHTML =
      '<p class="loading-indicator">No favourites saved yet!</p>';
    return;
  }

  let startNumber = 0;
  let endNumber = 0;
  let dataToOutput = "";
  if (favorites.length > per_page) {
    endNumber += per_page;

    dataToOutput = favorites.slice(startNumber, endNumber);
    loadMoreBtn.classList.remove("visually-hidden");
  } else {
    dataToOutput = favorites;
  }
  //Show the saved data
  let favsOutputHTML = renderFavourites(dataToOutput);
  outputField.innerHTML = favsOutputHTML;
}

navFavs.addEventListener("click", (e) => {
  e.preventDefault();
  scrollUpHandler();
  outputField.innerHTML = "";
  navMain.classList.remove("active");
  navFavs.classList.add("active");
  isFavoritesMode = true;
  showFavourites();
});

navMain.addEventListener("click", (e) => {
  e.preventDefault();
  searchForm.reset();
  navFavs.classList.remove("active");
  navMain.classList.add("active");
  inputForm.classList.remove("visually-hidden");
  isFavoritesMode = false;
  loadMoreBtn.classList.add("visually-hidden");
  outputField.innerHTML = `Please enter an image to search...`; // Clear or reload your last search
});
