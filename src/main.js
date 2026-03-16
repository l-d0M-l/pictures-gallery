import getImagesByQuery from "./js/pixabay-api";
import renderData from "./js/render-functions";
import saveToFavourite from "./js/saveToFavourite";

const outputField = document.querySelector("#app");
const searchForm = document.querySelector("#inputForm");
const loadMoreBtn = document.querySelector("#ladMoreBtn");

const loadingIndicator = document.querySelector("#loading-indicator");

// saveToFavourite(10167855);
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
  document.querySelector("#collection-end").classList.add("visually-hidden");
  loadMoreBtn.classList.add("visually-hidden");

  loadingIndicator.classList.remove("visually-hidden");

  try {
    const responseData = await getImagesByQuery(searchQuery, page);
    const outputHTML = renderData(responseData.hits);

    // Hide indicator AS SOON AS data is back
    loadingIndicator.classList.add("visually-hidden");

    outputField.insertAdjacentHTML("beforeend", outputHTML);

    // ... handle scrolling and Load More button visibility ...
    const per_page = 20;
    const totalPages = Math.ceil(responseData.totalHits / per_page);

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

    if (page < totalPages) {
      loadMoreBtn.classList.remove("visually-hidden");
    } else {
      document
        .querySelector("#collection-end")
        .classList.remove("visually-hidden");
    }
  } catch (error) {
    loadingIndicator.classList.add("visually-hidden");
    console.error("Search failed", error);
  }
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

outputField.addEventListener("click", async (e) => {
  // Finds the button even if you click the icon inside it
  const btn = e.target.closest(".save-btn");
  if (!btn) return;

  const id = btn.dataset.id;

  // Visual feedback: disable and change color
  btn.style.backgroundColor = "#28a745"; // Success green
  btn.disabled = true;
  btn.innerHTML = "✓"; // Quick checkmark icon

  try {
    await saveToFavourite(id);
  } catch (error) {
    btn.style.backgroundColor = "#dc3545"; // Error red
    btn.disabled = false;
    console.error("Save failed", error);
  }
});
