
window.loadFavorites = () => {
    window.handleOtherPageLoad()
    if(localStorage.getItem(LS_FAVORITES)) {
        console.log('hex: ', JSON.parse(localStorage.getItem(LS_FAVORITES)))
    }
}