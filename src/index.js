'use strict';

//импорты
import './css/main.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './js/pixabay-api';
import galleryCardsTemplate from './templates/gallery-card.hbs';
///////////////////////////////

// вытаскиваем елементы из html
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
///////////////////////////////

///////simplelightbox

const gallery = new SimpleLightbox('.gallery a', {
    scaleImageRatio: true,
    captionDelay: 250
});

// вспомагательные функции для поиска
const clearGallery = () => {
    galleryEl.innerHTML = '';
};

const showLoadMoreBtn = () => {
    loadMoreBtn.classList.remove('is-hidden');
};


// ПОИСК ИЗОБРАЖЕНИЙ ЧЕРЕЗ ФОРМУ
const onFormSubmit = event => {
    event.preventDefault();

    localStorage.setItem('page', '1');

    const query = document.querySelector('.input-box').value.trim();
    localStorage.setItem('query', query);
    clearGallery();

    fetchImages(query)
        .then(({ data }) => {
            console.log(data);
            const { hits, totalHits } = data;
            const imagesArr = data.hits;

            if (imagesArr.length === 0) {
                clearGallery();
                return Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.')
            } else {
                Notify.success(`'Hooray! We found ${totalHits} images.`);
                window.addEventListener('scroll', pageOnScroll)
                galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(hits));
                gallery.refresh();
                showLoadMoreBtn();
                //подключаем simpleLightBox

            }
        })
        .catch(err => {
            console.log(err);
        });
};
// кнопка загрузить больше


const onLoadMoreBtnClick = () => {

    const query = localStorage.getItem('query');

    fetchImages(query)
        .then(({ data }) => {
            const { hits, totalHits } = data;
            galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(hits, totalHits));

            let pageIterattor = Number(localStorage.getItem('page'));

            if (totalHits <= pageIterattor * 40) {
                loadMoreBtn.classList.add('is-hidden');
                Notify.info("We're sorry, but you've reached the end of search results.")
            }
            pageIterattor += 1;
            localStorage.setItem('page', JSON.stringify(pageIterattor));
            gallery.refresh();

        })
        .catch(err => {
            console.log(err);
        });
}
// вешаем слушателей событий

searchFormEl.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

//бесконечный скролл
const pageOnScroll = event => {
    const body = document.body;
    const contentHeight = body.offsetHeight;
    const yOffSet = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const y = Math.ceil(yOffSet + windowHeight);

    if (y >= contentHeight) {
        onLoadMoreBtnClick();
    }

}