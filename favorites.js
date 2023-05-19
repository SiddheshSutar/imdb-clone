
function renderOneFavorite(obj) {

    return `
        <div>

        </div>
    `;
}

window.loadFavorites = async () => {
    window.handleOtherPageLoad()

    /** If we have list of favorites */
    if (localStorage.getItem(LS_FAVORITES)) {
        // console.log('hex: ', favortiesSection)

        /** 1. Iterate on list of favorites ID array */
        const allFavorites = JSON.parse(localStorage.getItem(LS_FAVORITES))
        const allSectionsStrigified = []

        allFavorites.map(async (imdbIdString, index) => {

            /** 2. Fetch the data of current Id */
            try {
                const url = `${omdbUrl}&i=${imdbIdString}&plot=full`;

                const response = await fetch(url);
                const data = await response.json();
    
                console.log('hex: ', data)

                /** 3. Create single api mapped html section  */
                const singleSection = convertToHtml(`
                    <div class="card card-body list-card">
                        <div class="container">
                            <div class="row">
                                <div class="col col-3 flex-grow-0">
                                    <img src=${data.Poster} class="img'
                                        width="auto" height="140" alt="movie">
                                </div>
                                <div class="col col-7 movie-col">
                                    <div class="title">${data.Title}</div>
                                    <div class="year">${data.Year}</div>
                                    <div class="watchlist-btn">
                                        <button class="btn btn-primary" id="watchlist-btn" data-id=${data.imdbID} type="button"
                                        >Add to
                                            favorite</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ${index !== allFavorites.length - 1 ? "<div class='separator'></div>" : ""}
                `)

                /** create continuous string of such section from all objects in favorites list */
                allSectionsStrigified.push(singleSection)
    
    
            } catch(e) {
                console.log('Error in loadFavorites: ', e)
            }
        })


        
        /** append this list to favorites section html */
        favortiesSection.innerHTML = convertToHtml(allSectionsStrigified)
        
    }
}