function renderData(data, page, totalPages) {
  let returnString = "";
  // console.log(data);

  data.map((element) => {
    let currentLi = `<li class='js-gallery-item' id='js-gallery-item'>
    <img src='${element.largeImageURL}' class = 'query-image'/>
    <ul class='stats-list'>
    <li><b>Comments:</b> ${element.comments} </li>
    <li><b>Downloads:</b> ${element.downloads} </li>
    <li><b>Views:</b> ${element.views} </li>
    </ul>
    <button class='save-btn' title='Save to favorites' data-id='${element.id}'>
      <!-- Bookmark Icon SVG -->
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
    </li>`;
    returnString += currentLi;
  });
  // console.log(returnString);
  return `${returnString}`;
}

export default renderData;
