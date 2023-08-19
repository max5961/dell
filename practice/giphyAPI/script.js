const button = document.querySelector('button.giphy');
const submit = document.querySelector('button.submit');
const form = document.querySelector('.form');
const img = document.querySelector('img.giphy');
const input = document.querySelector('input');
const giphyKey = 'BZXBqPBM8XDIJoviYOlzL3g0VIYotAtD';
let searchWord = 'cats';
let translateURL = `https://api.giphy.com/v1/gifs/translate?api_key=${giphyKey}&s=${searchWord}`;

async function translateGiphy() {
    fetch(translateURL, {mode: 'cors'})
    .then(function(response) {
        button.style.backgroundColor = 'pink';
        return response.json();
    })
    .then(function(result) {
        button.style.backgroundColor = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
        img.src = result.data.images.original.url;
    })
    .catch(function(error) {
        img.src = '';
        console.error('no search word provided');
    })
}

function updateSearchWord(e) {
    searchWord = e.target.value;
    translateURL = `https://api.giphy.com/v1/gifs/translate?api_key=${giphyKey}&s=${searchWord}`;
    console.log(searchWord);
    console.log(translateURL);
}

function submitForm(e) {
    translateGiphy();
}

button.onclick = translateGiphy;
input.oninput = updateSearchWord;
submit.onclick = submitForm;
