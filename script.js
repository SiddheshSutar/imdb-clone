const omdbKey = '2165061e'
const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbKey}`

var mainSearchBtn = document.getElementById('main-search')
const searchDiv = document.getElementById("search-result-container")

let favoriteMovies = [] 

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

        const bannerCarousel = document.getElementById('banner-carousel')

        if(data && data.Search.length > 0) {
            data.Search.slice(0, 2).map((obj, index) => {
                const listItem = `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src=${obj.Poster} class="d-block" alt="...">
                    <div class="title">${obj.Title}<div>
                </div>
            `

            bannerCarousel.insertAdjacentHTML('afterbegin', listItem)
            })
        }

        autoSlideBanner()
        return data;

    } catch (err) {
        console.log(err);
    }
}

function autoSlideBanner () {
    const bannerCarousel = document.getElementById('banner-carousel')
    const slides = bannerCarousel.getElementsByClassName("carousel-item")

    if(!slides) return

    let count = slides.length
    const autoSlideInterval = setInterval(() => {
        if(count >= 2* slides.length) clearInterval(autoSlideInterval)
        Array.from(slides).forEach((index) => {
            const isActive = Array.from(slide.classList).includes("active")
            // if(isActive) Array.from(slide.classList).filter(clsName => clsName !== )
            if(isActive) {
                slide.classList.remove("active")
                slide.nextSibling.classList.add("active")
            }
        })
    }, 2000);

}

window.handlePageLoad = () => {
    fetchBannerData()
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
                                <img src=${item.Poster} class="img"
                                    width="auto" height="140" alt="movie">
                            </div>
                            <div class="col col-7 movie-col">
                                <div class="title">${item.Title}</div>
                                <div class="year">${item.Year}</div>
                                <div class="watchlist-btn">
                                    <button class="btn btn-primary" id="watchlist-btn-${index}" data-id=${item.imdbID} type="button"
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
