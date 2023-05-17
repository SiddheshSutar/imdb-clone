/** Constants START */
const omdbKey = '2165061e'
const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbKey}`

let favoriteMovies = []

const BANNER_CAROUSEL_DIV_NAME = "banner-carousel"
const ORIGINALS_CAROUSEL_DIV_NAME = "originals-carousel"
const CAROUSEL_ITEM_DIV_NAME = "carousel-item"

const LS_SELECTED_IMDB_ITEM = 'LS_SELECTED_IMDB_ITEM'

var mainSearchBtn = document.getElementById('main-search')
const searchDiv = document.getElementById("search-result-container")
const bannerCarousel = document.getElementById(BANNER_CAROUSEL_DIV_NAME)
const originalsCarousel = document.getElementById(ORIGINALS_CAROUSEL_DIV_NAME)
/** Constants END */

/** State variables START */
let selectedImdbItem = null
/** State variables END */

/** function to simulate autocomplete */
function debounce(cb, delay = 250) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

const handleMainSearch = debounce((e) => {

    // no value OR validation for min length to ht search
    if(!e.target.value || e.target.value && e.target.value.length < 3) {
        searchDiv.style.display = "none"
        return
    }

    fetchMovies(e.target.value)
}, 1000)

const handleBannerItemClick = (e) => {
    window.open(`/moviedetails.html?q=${e.target.getAttribute('data-id')}`, '_self')
}

async function fetchMovies(search) {

    const url = `${omdbUrl}&s=${search}`;
    try {

        const response = await fetch(url);
        const data = await response.json();
        createMovielist(data)
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function fetchBannerData(search) {

    const url = `${omdbUrl}&s=new&plot=short`;
    try {

        const response = await fetch(url);
        const data = await response.json();
        

        if(data && data.Search.length > 0) {
            data.Search.slice(0, 5).map((obj, index) => {
                const listItem = `
                <div class="${CAROUSEL_ITEM_DIV_NAME} ${index === 0 ? 'active' : ''}">
                    <img src=${obj.Poster} class="d-block banner-item-click-track" alt="..." data-id=${obj.imdbID}>
                    <div class="title">${obj.Title}<div>
                </div>
            `

            bannerCarousel.insertAdjacentHTML('afterbegin', listItem)
            })
        }


        const bannerCard = document.getElementsByClassName("banner-item-click-track")

        Array.from(bannerCard).forEach(item => item.addEventListener('click', e => handleBannerItemClick(e)))
        console.log(Array.from(bannerCard))

        return data;

    } catch (err) {
        console.log(err);
    }
}

Array.prototype.chunk = function ( n ) {
    if ( !this.length ) {
        return [];
    }
    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
};

async function fetchOriginalsData(search) {

    const parser = new DOMParser();

    const url = `${omdbUrl}&s=imdb`;
    try {

        const response = await fetch(url);
        const data = await response.json();
        

        if(data && data.Search.length > 0) {
            let slideIndex = 0
            let show = false

            let listItem = ''

            data.Search.chunk(3)
            .forEach((obj, index) => {

                if(
                    obj[0] === undefined || 
                    obj[1] === undefined || 
                    obj[2] === undefined
                ) return 

                listItem += `
                        <div class="originals ${index} ${CAROUSEL_ITEM_DIV_NAME} ${index === 0 ? 'active' : ''}">
                            <div>${
                            obj[0] ? `<div class="og-card-wrapper">
                                <img src=${obj[0].Poster} class="d-block" alt="...">
                                <div class="title">${obj[0].Title}</div>
                            </div>` : ``
                            }${
                                obj[1] ? `<div class="og-card-wrapper">
                                    <img src=${obj[1].Poster} class="d-block" alt="...">
                                    <div class="title">${obj[1].Title}</div>
                                </div>` : ``
                            }${
                                obj[2] ? `<div class="og-card-wrapper">
                                    <img src=${obj[2].Poster} class="d-block" alt="...">
                                    <div class="title">${obj[2].Title}</div>
                                </div>` : ``
                            }
                            </div>
                        </div>
                    `

            })
            originalsCarousel.innerHTML = parser.parseFromString(listItem, 'text/html').body.innerHTML
        }

        // autoSlideBanner(originalsCarousel)
        return data;

    } catch (err) {
        console.log(err);
    }
}

const resetLS = () => {
    localStorage.removeItem('LS_SELECTED_IMDB_ITEM')
}


window.handlePageLoad = () => {
    fetchBannerData()
    fetchOriginalsData()
    resetLS()
}

window.handleMovieDetailsPageLoad = () => {
    console.log()
    const selectedMovieId = location.search.split("=")[1]
    selectedMovieId && fetchSelectedMovieData(selectedMovieId)
}

function autoSlideBanner (carouselElement) {
    const slides = carouselElement.getElementsByClassName(CAROUSEL_ITEM_DIV_NAME)

    if(!slides) return

    let count = slides.length
    const autoSlideInterval = setInterval(() => {
        if(count >= 2* slides.length) clearInterval(autoSlideInterval)
        Array.from(slides).forEach((slide, index) => {
            const isActive = Array.from(slide.classList).includes("active")
            // if(isActive) Array.from(slide.classList).filter(clsName => clsName !== )
            if(isActive) {
                slide.classList.remove("active")
                slide.nextSibling.classList.add("active")
            }
        })
    }, 2000);

}

function handleAddFavorite(event, item) {
    if(favoriteMovies.every(obj => obj.Title !== item.Title)) favoriteMovies.push(event)
}


function createMovielist(response) {

    if (searchDiv) {
        if (response.Response === 'True') {

            response.Search.map((item, index) => {
                const listItem = `
                <div class="card card-body list-card">
                    <div class="container">
                        <div class="row">
                            <div class="col col-3 flex-grow-0">
                                <img src=${item.Poster} class="img'
                                    width="auto" height="140" alt="movie">
                            </div>
                            <div class="col col-7 movie-col">
                                <div class="title">${item.Title}</div>
                                <div class="year">${item.Year}</div>
                                <div class="watchlist-btn">
                                    <button class="btn btn-primary" id="watchlist-btn" data-id=${item.imdbID} type="button"
                                    >Add to
                                        favorite</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    ${index !== response.Search.length - 1 ? "<div class='separator'></div>" : ""}
            `

            searchDiv.insertAdjacentHTML('afterbegin', listItem)
            searchDiv.style.display = "block"

            const addToFavoritebtn = document.getElementById(`watchlist-btn-${index}`)
            addToFavoritebtn.addEventListener("click", e => handleAddFavorite(e, item))
            })
        } else {
            searchDiv.innerHTML = response.Error
            searchDiv.style.display = "block"

        }
    }
}
mainSearchBtn.addEventListener('input', e => handleMainSearch(e))

async function fetchSelectedMovieData(selectedMovieId) {
    const url = `${omdbUrl}&i=${selectedMovieId}&plot=full`;
    
    try {

        const response = await fetch(url);
        const data = await response.json();
        localStorage.setItem('LS_SELECTED_IMDB_ITEM', data)
        selectedImdbItem = data
        console.log('hex: ', data)

        window.loadItemDetails && window.loadItemDetails(data)

    } catch(e) {
        console.log('Error in fetchSelectedMovieData: ', e)
    }
}

// mainSearchBtn.addEventListener('click', e => handleMainSearch(e))
