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
    </li>`;
    returnString += currentLi;
  });
  // console.log(returnString);
  return `${returnString}`;
}

export default renderData;
