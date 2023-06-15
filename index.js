const API_KEY = "39fe01a2d3d121ecb6be1779a37bd842";
const URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=39fe01a2d3d121ecb6be1779a37bd842&page=1"
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=39fe01a2d3d121ecb6be1779a37bd842&query=";
const image_path = `https://image.tmdb.org/t/p/w1280`

const movieContainer = document.querySelector(".movies-container");
const input = document.querySelector('.search-box input')
const heading = document.querySelector('.heading')
const moviePage = document.querySelector('.movie_page')
const favoriteMovies = document.querySelector('.favorite_page')
const favMoviesPage = document.querySelector('.favorite_movie_page')
const xIcon = document.querySelector('#x-icon')
const favIcon = document.querySelector('nav .fav_icon')

console.log(favIcon, favMoviesPage, xIcon)

// For Click Event on Movie Card
function clickEvent (cards) {
    cards.forEach(card => {
        card.addEventListener('click', () =>  show_movie(card))
    })
}

// For Click Event on Favorite Icon  
function clickEventOpen () {
    favIcon.addEventListener('click', () =>  openFavPage())
}
clickEventOpen ()

function clickEventClose () {
    xIcon.addEventListener('click', () =>  closeFavPage())
}
clickEventClose ()

function openFavPage(){
    favMoviesPage.classList.add('show_page')
}
function closeFavPage(){
    favMoviesPage.classList.remove('show_page')
}


// Local Storage 
function get_LS (){
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    return movie_ids === null ? [] : movie_ids
}

function add_to_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
}

function remove_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
}

// To Show Selected Movie
async function get_movie_by_id (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const data = await resp.json()
    return data
}

async function show_movie (card) {
    moviePage.classList.add('show_page')

    const movie_id = card.getAttribute('data-id')
    const movie = await get_movie_by_id(movie_id)

    moviePage.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`

    moviePage.innerHTML = `
        <span class="x-icon text-3xl absolute top-3 right-5 lg:top-24 lg:right-24  cursor-pointer select-none hover:scale-125 active:scale-100">&#9747;</span>
        <div class="content flex items-start gap-12 w-[1200px] mt-40">
            <div class="left">
                <div class="poster-img w-[300px] h-[400px] overflow-hidden rounded-lg shadow-sm shadow-gray-300 border-solid border-2 border-gray-400">
                    <img class="cover w-full h-full" src="${image_path + movie.poster_path}" alt="">
                </div>
                <div class="single-info text-base px-2 py-0">
                    <span>Add to favorites:</span>
                    <span class="heart-icon text-3xl cursor-pointer select-none hover:scale-110 active:scale-90">&#9829;</span>
                </div>
            </div>
            <div class="right">
                <h1>${movie.title}</h1>
                <h3>${movie.tagline}</h3>
                <div class="single-info-container w-[200px]">
                    <div class="single-info">
                        <span>Language:</span>
                        <span>${movie.spoken_languages[0].name}</span>
                    </div>
                    <div class="single-info">
                        <span>Length:</span>
                        <span>${movie.runtime} minutes</span>
                    </div>
                    <div class="single-info">
                        <span>Rate:</span>
                        <span>${movie.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Budget:</span>
                        <span>${movie.budget}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date:</span>
                        <span>${movie.release_date}</span>
                    </div>
                </div>
                <div class="genres">
                    <h2>Genres</h2>
                    <ul>
                        ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="overview">
                    <h2>Overview</h2>
                    <p>${movie.overview}</p>
                </div>
            </div>
        </div>
    `
    const x_icon = document.querySelector('.x-icon')
    x_icon.addEventListener('click', () => moviePage.classList.remove('show_page'))

    const heart_icon = moviePage.querySelector('.heart-icon')

    const movie_ids = get_LS()
    for(let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color')
    }

    heart_icon.addEventListener('click', () => {
        if(heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id)
            heart_icon.classList.remove('change-color')
        } else {
            add_to_LS(movie_id)
            heart_icon.classList.add('change-color')
        }
        getFavMovies()
    })
}

// For Favorite Movies
const getFavMovies = async () => {
    favoriteMovies.innerHTML = ''

    const movies_LS = await get_LS()
    const movies = []
    for( let i = 0; i <= movies_LS.length - 1; i++){
        const movie_id = movies_LS[i]
        let movie = await get_movie_by_id(movie_id)
        showFavMovies(movie)
        movies.push(movie)
    }
}

function showFavMovies (movie_data){
    favoriteMovies.innerHTML += `
        <div 
            class="card w-[200px] shadow-lg shadow-gray-600 text-white cursor-pointer rounded-md outline outline-2 outline-gray-400 group overflow-hidden" data-id="${movie_data.id}>
            <div class="img ">
                <img 
                    class="w-[100%] h-[250px] relative overflow-hidden ease-in-out duration-300  group-hover:scale-110 object-cover before:content-[''] before:absolute before:bottom-0 before:w-full before:h-[30%] before:bg-gradient-to-t from-slate-800 to-transparent rounded" 
                    src="${image_path + movie_data.poster_path}" 
                    alt=""
                >
                <div class="info py-2 px-1">
                    <h2 class="mb-2 text-xl">${movie_data.title}</h2>
                    <div class="single-info flex items-center justify-between text-sm my-1">
                        <span>Rate:</span>
                        <span>${movie_data.vote_average}/10</span>
                    </div>
                    <div class="single-info flex items-center justify-between text-sm my-1">
                        <span>Release Date:</span>
                        <span>${movie_data.release_date}</span>
                    </div>
                </div>
            </div>
        </div>
    `
    
    const cards = document.querySelectorAll('.card')
    clickEvent(cards)
}
getFavMovies()

// For Trending Movies
const getMovies = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.results)
    showMovies(data.results) 
}

const showMovies = (data) => {
    heading.innerText = `Top Trending Movies`
    movieContainer.innerHTML = data.map(item =>{
        return `
            <div 
                class="card w-[200px] shadow-lg shadow-gray-600 text-white cursor-pointer rounded-md outline outline-2 outline-gray-400 group overflow-hidden" data-id="${item.id}" >
                <div class="img ">
                    <img 
                        class="w-[100%] h-[250px] relative overflow-hidden ease-in-out duration-300  group-hover:scale-110 object-cover before:content-[''] before:absolute before:bottom-0 before:w-full before:h-[30%] before:bg-gradient-to-t from-slate-800 to-transparent rounded" 
                        src="${image_path + item.poster_path}" 
                    >
                    <div class="info py-2 px-1">
                        <h2 class="mb-2 text-xl">${item.title}</h2>
                        <div 
                            class="single-info flex items-center justify-between text-sm my-1">
                            <span>Rate:</span>
                            <span>${item.vote_average}/10</span>
                        </div>
                        <div 
                            class="single-info flex items-center justify-between text-sm my-1">
                            <span>Release Date:</span>
                            <span>${item.release_date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('')

    const cards = document.querySelectorAll('.card')
    clickEvent(cards)
}

// For Search Movies
const getSearchMovies = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    // console.log(data.results)
    showSearchMovies(data.results) 
}

const showSearchMovies = (data) => {
    heading.innerText = `Search Results...`
    movieContainer.innerHTML = data.map(item =>{
        return `
            <div 
                class="card w-[200px] shadow-lg shadow-gray-600 text-white cursor-pointer rounded-md outline outline-2 outline-gray-400 group overflow-hidden" data-id="${item.id}" >
                <div class="img ">
                    <img 
                        class="w-[100%] h-[250px] relative overflow-hidden ease-in-out duration-300  group-hover:scale-110 object-cover before:content-[''] before:absolute before:bottom-0 before:w-full before:h-[30%] before:bg-gradient-to-t from-slate-800 to-transparent rounded" 
                        src="${image_path + item.poster_path}" 
                    >
                    <div class="info py-2 px-1">
                        <h2 class="mb-2 text-xl">${item.title}</h2>
                        <div 
                            class="single-info flex items-center justify-between text-sm my-1">
                            <span>Rate:</span>
                            <span>${item.vote_average}/10</span>
                        </div>
                        <div 
                            class="single-info flex items-center justify-between text-sm my-1">
                            <span>Release Date:</span>
                            <span>${item.release_date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('')

    
    const cards = document.querySelectorAll('.card')
    clickEvent(cards)

}

document.querySelector(".search-box input").addEventListener(
    "keyup",
    function (event) {
        if (event.target.value != "") {
            getSearchMovies(SEARCHAPI + event.target.value)
        } else {
            getMovies(URL)
        }
    }
)

// initial Call
getMovies(URL)
