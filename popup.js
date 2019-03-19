const moviesList = document.getElementById('moviesList')

chrome.storage.onChanged.addListener((data) => {
    data.movies && window.location.reload()
})

chrome.storage.sync.get("movies", ({movies}) => {
    const now = Date.now();
    const newMovies = [...movies]
    movies.forEach((movie, index) => {
        const { premiereDays } = movie;
        
        if (premiereDays.some((day) => day < now)) {
                newMovies[index].status = 'new';
        } 
    })
    chrome.storage.sync.set({"movies": newMovies}, getData())
})


function getData () {
    chrome.storage.sync.get('movies', function(data) {

    renderList(data.movies)   
});
}


function renderList (seriesList) {
    const date = new Date;

    seriesList.forEach(({title, link, status, premiereDays}, index) => {
        const button = document.createElement('button')
        button.classList.add('seriesButton')
        status === 'new' ? button.classList.add('newEpisode') : status === 'end' && button.classList.add('endSeries')
        button.innerText = `${title}`
        button.onclick = () => goToLink(link, seriesList, index, premiereDays, status) 

        moviesList.appendChild(button)
    })
}

function goToLink (link, seriesList, index, premiereDays, status) {
    const newMovies = [...seriesList];
    const now = Date.now();

    if (status === 'end') {
        moveToUrl(link)
    } else {
        const newPremierList = premiereDays.filter((day) => day > now);
        newMovies[index].premiereDays = newPremierList
        if (newPremierList.length === 0) {
            newMovies[index].status = "end";
        } else {
            newMovies[index].status = "watched";
        }
        saveSyncData(newMovies, () => moveToUrl(link))
    }
}

function saveSyncData (data, callback) { chrome.storage.sync.set({"movies": data}, callback())}
function moveToUrl (link) { chrome.tabs.update({url: link}) }  