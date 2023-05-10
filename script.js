const omdbKey = '2165061e'
const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbKey}`

var mainSearchBtn = document.getElementById('main-search')


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

    if(!e.target.value) return
    if(e.target.length < 3) return // validation for min length to ht search

    fetchMovies(e.target.value)
}, 1000)

/** function to simulate autocomplete */
async function fetchMovies(search) {
    const url = `${omdbUrl}&s=${search}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('hex: ', data)
        return data;
    } catch (err) {
        console.log(err);
    }
}
mainSearchBtn.addEventListener('input', e => handleMainSearch(e))
