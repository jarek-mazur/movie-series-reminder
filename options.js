const form = document.getElementById('addSeriesForm');
const title = document.getElementById('newTitle')
const link = document.getElementById('newLink')
const episodesLeft = document.getElementById('newLength')
const premiereDay = document.getElementById('newPremiere')
const optionsList = document.getElementById('currentList')
let currentList = []

const getDayDifference = (currentDay, premiereWeekDay) => {
    if (currentDay === premiereWeekDay) {
        return 0;
    } else if (premiereWeekDay > currentDay) {
        return premiereWeekDay - currentDay;
    } else {
        return 7 - (currentDay - premiereWeekDay);
    }
};

const actualizeList = (newSeries) => chrome.storage.sync.get('movies', function(data) {
    oldData = data.movies || [];

    chrome.storage.sync.set({"movies": [...oldData, newSeries]})
});



chrome.storage.sync.get('movies', function(data) {
    currentList =  data.movies || []

    currentList.forEach((movie) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper')
        const title = document.createElement('span');
        const removeBtn = document.createElement('input');
        title.innerText = movie.title;
        removeBtn.setAttribute('type', 'button')
        removeBtn.setAttribute('value', 'X')
        removeBtn.onclick = (event) => removeMovie(movie.title)
        wrapper.appendChild(title).appendChild(removeBtn)
        optionsList.appendChild(wrapper)
    })
});

function removeMovie (title) {
    chrome.storage.sync.set(
        {"movies": [...currentList.filter((movie) => movie.title !== title )]},
        window.location.reload()
    )
}

const weekMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 0,
}




form.onsubmit = () => {
    const date = new Date();
    const startCurrentDay = Date.parse(`${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`)
    const currentDay = date.getDay();
    const premiereWeekDay = weekMap[premiereDay.value]
    const multiplier = getDayDifference(currentDay, premiereWeekDay)
    const firstPremiere = startCurrentDay + multiplier * 86400000;
    const oneWeekInMs = 7 * 86400000;
    const premiereDays = [];

    for (let i = 0; i < episodesLeft.value; i++) {
        premiereDays.push(firstPremiere + i * oneWeekInMs)
    }
    
    const newSeries = {
        title: title.value,
        link: link.value,
        status: "watched",
        premiereDays,   
    }
    actualizeList(newSeries)
}