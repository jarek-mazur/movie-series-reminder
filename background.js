// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set("movies", [])
// });

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.sync.get("movies", ({movies}) => {
  

  const now = Date.now();
  const newMovies = [...movies]
  movies.forEach((movie, index) => {
      const { premiereDays } = movie;
      
      if (premiereDays.some((day) => day < now)) {
              newMovies[index].status = 'new';
      } 
  })

  const statuses = newMovies.map((movie) => movie.status);

  setData(newMovies)

  statuses.some((status) => status === 'new') && setGreenIcon();
  })
})

const setGreenIcon = () => chrome.browserAction.setIcon({path: "images/button_play_green.png"})
const setGreyIcon = () => chrome.browserAction.setIcon({path: "images/button_grey_play.png"})
const setData = (newMovies) => chrome.storage.sync.set({"movies": newMovies})


chrome.storage.sync.get("movies", ({movies}) => {
  const now = Date.now();
  const newMovies = [...movies]
  movies.forEach((movie, index) => {
      const { premiereDays } = movie;
      
      if (premiereDays.some((day) => day < now)) {
              newMovies[index].status = 'new';
      } 
  })
  setData(newMovies)
})
