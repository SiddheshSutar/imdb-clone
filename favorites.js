
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

        /** 1. Iterate on list of favorites ID array */
        // const allFavorites = JSON.parse(localStorage.getItem(LS_FAVORITES))
        const allFavorites = ['tt0427380', 'tt0377054']
        let allSectionsStrigified = ''


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
                    <div class="container favorite-container">
                        <div class="row">
                            <div class="col flex-grow-0">
                                <img src=${data.Poster} class="img'
                                    height="140" alt="movie">
                            </div>
                            <div class="col col-7 movie-col">
                                <div class="title">${data.Title}</div>
                                <div class="tags-row">
                                    <div>${data.Year}</div>
                                    <div>${data.Type}</div>
                                    <div>${data.Genre}</div>
                                </div>
                                <div class="imdbRating">${data.imdbRating}</div>
                                <div class="actors-row">
                                    ${data.Actors.split(', ')[0] ? `<div>${data.Actors.split(', ')[0]}</div>` : ''} 
                                    ${data.Actors.split(', ')[1] ? `<div>${data.Actors.split(', ')[1]}</div>` : ''} 
                                    ${data.Actors.split(', ')[2] ? `<div>${data.Actors.split(', ')[2]}</div>` : ''} 
                                </div>
                                <div class="plot">
                                    ${data.Plot}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${index !== allFavorites.length - 1 ? "<div class='separator'></div>" : ""}
            `)

                /** 4. create continuous string of such section from all objects in favorites list */
                allSectionsStrigified += singleSection

                /** 5. finally append to DOM */
                if (index === allFavorites.length - 1) {
                    favortiesSection.innerHTML = convertToHtml(allSectionsStrigified)
                }

            } catch (e) {
                console.log('Error in loadFavorites: ', e)
            }
        })



        /** append this list to favorites section html */

    }
}

function getMappedContentString(allFavorites) {

    return allSectionsStrigified
}