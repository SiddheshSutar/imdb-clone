const parser = new DOMParser();

/** Constants START */
const omdbKey = '2165061e'
const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbKey}`

let favoriteMovies = []

const BANNER_CAROUSEL_DIV_NAME = "banner-carousel"
const ORIGINALS_CAROUSEL_DIV_NAME = "originals-carousel"
const CAROUSEL_ITEM_DIV_NAME = "carousel-item"
const FAVORTIES_SECTION_DIV_NAME = "favorites-section"
const ATTR_SEARCH_LIST_IS_OPEN = 'data-is-open'
const REMOVE_FROM_FAVORITES = "Remove from favorites"
const ADD_TO_FAVORITES = "Add to favorites"

const LS_SELECTED_IMDB_ITEM = 'LS_SELECTED_IMDB_ITEM'
const LS_FAVORITES = 'LS_FAVORITES'

var mainSearchBtn = document.getElementById('main-search')
const searchDiv = document.getElementById("search-result-container")
const bannerCarousel = document.getElementById(BANNER_CAROUSEL_DIV_NAME)
const originalsCarousel = document.getElementById(ORIGINALS_CAROUSEL_DIV_NAME)
const favortiesSection = document.getElementById(FAVORTIES_SECTION_DIV_NAME)
/** Constants END */

/** State variables START */
let selectedImdbItem = null
/** State variables END */

/** function to simulate autocomplete
 * @param cb: callback to be executed after manual delay
 * @param delay: the delay time in milli seconds
 */
function debounce(cb, delay = 250) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

/** function to parse stringified html
 * @param htmlString: string version written that of html 
 */
function convertToHtml(htmlString) {
    return parser.parseFromString(htmlString, 'text/html').body.innerHTML
}

/** homepage search handler */
const handleMainSearch = debounce((e) => {

    // no value OR validation for min length to ht search
    if (!e.target.value || e.target.value && e.target.value.length < 3) {
        searchDiv.style.display = "none"
        searchDiv.setAttribute(ATTR_SEARCH_LIST_IS_OPEN, 'false')
        return
    }

    fetchMovies(e.target.value)
}, 1000)

/** banne section item click handler */
window.handleBannerItemClick = (e, imdbIdPassed = null) => {
    const idToSearch = imdbIdPassed ? imdbIdPassed : e.target.getAttribute('data-id')
    window.open(`/html/moviedetails.html?q=${idToSearch}`, '_self')
}

/** @API : fetch all movies */
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

/** @API : fetch banner section data */
async function fetchBannerData(search) {

    const url = `${omdbUrl}&s=new&plot=short`;
    try {

        const response = await fetch(url);
        const data = await response.json();


        if (data && data.Search.length > 0) {
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

        return data;

    } catch (err) {
        console.log(err);
    }
}

/** @helper : convert bigger array into smaller array with @n item in each array item */
Array.prototype.chunk = function (n) {
    if (!this.length) {
        return [];
    }
    return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

/** @API : fectch IMDB Originals section data  */
async function fetchOriginalsData(search) {

    const parser = new DOMParser();

    const url = `${omdbUrl}&s=imdb`;
    try {

        const response = await fetch(url);
        const data = await response.json();


        if (data && data.Search.length > 0) {
            let slideIndex = 0
            let show = false

            let listItem = ''

            data.Search.chunk(3)
                .forEach((obj, index) => {

                    if (
                        obj[0] === undefined ||
                        obj[1] === undefined ||
                        obj[2] === undefined
                    ) return

                    /** WIP */
                    listItem += `
                        <div class="originals ${index} ${CAROUSEL_ITEM_DIV_NAME} ${index === 0 ? 'active' : ''}">
                            <div>${obj[0] ? `<div class="og-card-wrapper">
                                <img src=${obj[0].Poster} class="d-block" alt="..."  data-id=${obj[0].imdbID} onclick="handleBannerItemClick(event)">
                                <div class="title">${obj[0].Title}</div>
                            </div>` : ``
                        }${obj[1] ? `<div class="og-card-wrapper">
                                    <img src=${obj[1].Poster} class="d-block" alt="..."  data-id=${obj[1].imdbID} onclick="handleBannerItemClick(event)">
                                    <div class="title">${obj[1].Title}</div>
                                </div>` : ``
                        }${obj[2] ? `<div class="og-card-wrapper">
                                    <img src=${obj[2].Poster} class="d-block" alt="..."  data-id=${obj[2].imdbID} onclick="handleBannerItemClick(event)">
                                    <div class="title">${obj[2].Title}</div>
                                </div>` : ``
                        }
                            </div>
                        </div>
                    `

                })
            originalsCarousel.innerHTML = parser.parseFromString(listItem, 'text/html').body.innerHTML
        }

        // autoSlideBanner(originalsCarousel) /** Not working */
        return data;

    } catch (err) {
        console.log(err);
    }
}

/** @helper : reset localstorage */
const resetLS = () => {
    localStorage.removeItem('LS_SELECTED_IMDB_ITEM')
}

/** handle homepage load */
window.handlePageLoad = () => {
    fetchBannerData()
    fetchOriginalsData()
    showSearchOnHomepage()
    handleBlurForAutocompleteList()
    resetLS()
}

/**  handle page loads ; "OTHER THAN" homepage */
window.handleOtherPageLoad = () => {
    showSearchOnHomepage()
    resetLS()
}

/** @helper : function which show-hides search section from navbar*/
function showSearchOnHomepage() {
    if (location.href === 'http://127.0.0.1:5500/html/')
        mainSearchBtn.style.display = "block"
    else mainSearchBtn.style.display = "none"
}

/**  handle movie details page load */
window.handleMovieDetailsPageLoad = () => {
    handleOtherPageLoad()
    console.log()
    const selectedMovieId = location.search.split("=")[1]
    selectedMovieId && fetchSelectedMovieData(selectedMovieId)
}

function autoSlideBanner(carouselElement) {

    /** Needs more work to b functional */
    const slides = carouselElement.getElementsByClassName(CAROUSEL_ITEM_DIV_NAME)

    if (!slides) return

    let count = slides.length
    const autoSlideInterval = setInterval(() => {
        if (count >= 2 * slides.length) clearInterval(autoSlideInterval)
        Array.from(slides).forEach((slide, index) => {
            const isActive = Array.from(slide.classList).includes("active")
            // if(isActive) Array.from(slide.classList).filter(clsName => clsName !== )
            if (isActive) {
                slide.classList.remove("active")
                slide.nextSibling.classList.add("active")
            }
        })
    }, 2000);

}

/** handler for adding item to favorite OR removing from favorite from search results */
function handleFavoriteItemAddRemove(event, item) {

    if (event.target.innerHTML === REMOVE_FROM_FAVORITES) {
        const newList = favoriteMovies.filter(item_ => item_ !== item.imdbID)
        favoriteMovies = [...newList]
        localStorage.setItem(LS_FAVORITES, JSON.stringify(newList))

        const currentAddToFavBtn = document.getElementById(`watchlist-btn-${item.imdbID}`)

        if (currentAddToFavBtn) {
            currentAddToFavBtn.innerHTML = ADD_TO_FAVORITES
        }
    } else {
        if (favoriteMovies.every(obj => obj.Title !== item.Title))

            /** currently limiting to only 10 */
            if (favoriteMovies.length < 11) {
                favoriteMovies.push(item.imdbID)
                localStorage.setItem(LS_FAVORITES, JSON.stringify(favoriteMovies))

                /** change the functionality to 'Remove from favorites' */
                const currentAddToFavBtn = document.getElementById(`watchlist-btn-${item.imdbID}`)

                if (currentAddToFavBtn) {
                    currentAddToFavBtn.innerHTML = REMOVE_FROM_FAVORITES
                }
            } else {
                alert('Favorite limit exceeded !')
            }
    }


}

/** @helper : function to create list of search result's movies in html format */
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
                                    <button class="btn btn-primary" id="watchlist-btn-${item.imdbID}" data-id=${item.imdbID} type="button"
                                    >${ADD_TO_FAVORITES}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    ${index !== response.Search.length - 1 ? "<div class='separator'></div>" : ""}
            `

                searchDiv.insertAdjacentHTML('afterbegin', listItem)
                searchDiv.style.display = "block"
                searchDiv.setAttribute(ATTR_SEARCH_LIST_IS_OPEN, 'true')

                const addToFavoritebtn = document.getElementById(`watchlist-btn-${item.imdbID}`)
                addToFavoritebtn.addEventListener("click", e => handleFavoriteItemAddRemove(e, item))
            })
        } else {
            searchDiv.innerHTML = response.Error
            searchDiv.style.display = "block"
            searchDiv.setAttribute(ATTR_SEARCH_LIST_IS_OPEN, 'true')
        }
    }
}
mainSearchBtn.addEventListener('input', e => handleMainSearch(e))

/** @API : function to fetch the data of either banner or favorite section on clicked movie */
async function fetchSelectedMovieData(selectedMovieId) {
    const url = `${omdbUrl}&i=${selectedMovieId}&plot=full`;

    try {

        const response = await fetch(url);
        const data = await response.json();
        localStorage.setItem('LS_SELECTED_IMDB_ITEM', data)
        selectedImdbItem = data

        window.loadItemDetails && window.loadItemDetails(data)

    } catch (e) {
        console.log('Error in fetchSelectedMovieData: ', e)
    }
}


/** To close the opened dropdown of search items */
document.body.addEventListener('click', e => handleBlurForAutocompleteList(e))

function handleBlurForAutocompleteList(e) {
    /** close the list; only if it 'add to favorite' is not clicked and still the list open*/
    if (
        e?.target.id && !e.target.id.includes('watchlist-btn') &&
        searchDiv.getAttribute(ATTR_SEARCH_LIST_IS_OPEN) === 'true'
    ) {
        searchDiv.style.display = "none"
        searchDiv.setAttribute(ATTR_SEARCH_LIST_IS_OPEN, 'false')
    }
}