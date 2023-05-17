const movieTitle = document.getElementById('movie-title')
const imdbRating = document.getElementById('imdb-rating')
const rtRating = document.getElementById('rt-rating')
const imagePoster = document.getElementById('image-poster')
const moviePlot = document.getElementById('movie-plot')
const creatorListContent = document.getElementById('creator-list-content')
const actorListContent = document.getElementById('actor-list-content')

const parser = new DOMParser();

const convertToHtml = (htmlString) => parser.parseFromString(htmlString, 'text/html').body.innerHTML

window.loadItemDetails = (data) => {
    const selectedItemData = JSON.parse(JSON.stringify(data))

    if (selectedItemData.Response !== "True") return

    movieTitle.innerHTML = selectedItemData.Title
    imdbRating.innerHTML = convertToHtml(`<div id="imdb-rating-nums"><div>${selectedItemData.imdbRating}</div>/<div>10</div></div>`)
    rtRating.innerHTML = selectedItemData.Ratings[1].Value

    imagePoster.src = selectedItemData.Poster
    moviePlot.innerHTML = selectedItemData.Plot

    const creatorsListElement = `
        <div>${selectedItemData.Director}</div><div>${selectedItemData.Writer}</div>
    `
    creatorListContent.innerHTML = convertToHtml(creatorsListElement)


    const actorsListElement = selectedItemData.Actors
        .split(',')
        .reduce((acc, item) => acc + `<div>${item}</div>`)
    actorListContent.innerHTML = convertToHtml(actorsListElement)

    console.log('hex2: ', movieTitle, data)
}