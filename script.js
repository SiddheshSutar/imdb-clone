const omdbKey = '2165061e'
const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbKey}`

var mainSearchBtn = document.getElementById('main-search')
const searchDiv = document.getElementById("search-result-container")


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

/** function to simulate autocomplete */
async function fetchMovies(search) {

    const url = `${omdbUrl}&s=${search}`;
    try {

        const response = await fetch(url);
        const data = await response.json();
        console.log('hex: ', data)
        createMovielist(data)
        return data;
    } catch (err) {
        console.log(err);
    }
}


function createMovielist(response) {

    if (searchDiv) {
        if (response.Response === 'True') {

            response.Search.map((item, index) => {
                const listItem = `
                <div class="card card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col flex-grow-0">
                                <img src=${item.Poster}
                                    width="200" height="140" alt="movie">
                            </div>
                            <div class="col movie-col">
                                <div class="title">${item.Title}</div>
                                <div class="year">${item.Year}</div>
                                <div class="watchlist-btn">
                                    <button class="btn btn-primary" data-id=${item.imdbID} type="button">Add to
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
            })
        } else {
            searchDiv.innerHTML = response.Error
            searchDiv.style.display = "block"

        }
    }
}
mainSearchBtn.addEventListener('input', e => handleMainSearch(e))
