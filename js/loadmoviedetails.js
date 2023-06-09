const movieTitle = document.getElementById('movie-title')
const imdbRating = document.getElementById('imdb-rating')
const rtRating = document.getElementById('rt-rating')
const imagePoster = document.getElementById('image-poster')
const moviePlot = document.getElementById('movie-plot')
const creatorListContent = document.getElementById('creator-list-content')
const actorListContent = document.getElementById('actor-list-content')
const awards = document.getElementById('awards')
const infoListContent = document.getElementById('info-list-content')
const genreContent = document.getElementById('genre')
const earned = document.getElementById('earned')
const metaScore = document.getElementById('meta-score')


/** Details page load
 * Split into two functions further just for understanding purpose
 * general logic: map the API data into corresponding sections of html .
 */
window.loadItemDetails = (data) => {
    const selectedItemData = JSON.parse(JSON.stringify(data))

    loader1(selectedItemData)
    loader2(selectedItemData)
}

function loader2(selectedItemData) {
    const actorsListElement = selectedItemData.Actors
        .split(',')
        .map(item => `<div>${item}</div>`)
        .reduce((acc, item) => acc + item)
    actorListContent.innerHTML = convertToHtml(actorsListElement)


    if(!selectedItemData.Awards) {
        awards.style.display = "none"
    } else {
        awards.innerHTML = selectedItemData.Awards
    }


    infoListString = `
    <div class="row info-list-row">
        <div class="col">
            ${selectedItemData.Type}
        </div>
        <div class="col">
            ${selectedItemData.Year}
        </div>
        <div class="col">
            ${selectedItemData.Runtime}
        </div>
    </div>
`
    infoListContent.innerHTML = convertToHtml(infoListString)


    const genreListElement = selectedItemData.Genre
        .split(',')
        .map(item => `<div class="col">${item}</div>`)
        .reduce((acc, item) => acc + item)
    genreContent.innerHTML = convertToHtml(genreListElement)


    earned.innerHTML = selectedItemData.BoxOffice
    metaScore.innerHTML = selectedItemData.Metascore

}

function loader1(selectedItemData) {

    if (selectedItemData.Response !== "True") return

    movieTitle.innerHTML = selectedItemData.Title
    imdbRating.innerHTML = convertToHtml(`<div class="col" id="imdb-rating-nums"><div>${selectedItemData.imdbRating}</div>/<div>10</div></div>`)
    if(selectedItemData.Ratings[1]) rtRating.innerHTML = selectedItemData.Ratings[1]?.Value

    imagePoster.src = selectedItemData.Poster
    moviePlot.innerHTML = selectedItemData.Plot

    const creatorsListElement = `
        <div>${selectedItemData.Director}</div><div>${selectedItemData.Writer}</div>
    `
    creatorListContent.innerHTML = convertToHtml(creatorsListElement)

}


