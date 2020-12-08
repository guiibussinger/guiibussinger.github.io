// Initial Values
const api_key = '5c95145ffe18880994e3fa48314cb776';
const URL_HOST = 'https://api.themoviedb.org';
const MOVIE_DB_IMAGE_ENDPOINT = 'https://image.tmdb.org/t/p/w500';
const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/150';


const getSliderMovies = async () => {
    let response = await fetch(`${URL_HOST}/3/trending/movie/day?api_key=${api_key}`, {
        method: "GET",
    })
    response = await response.json();

    const {results} = response;

    await Promise.all(results.slice(0,8).map(({id}) => new Promise((resolve) => {
        fetch(`${URL_HOST}/3/movie/${id}?api_key=${api_key}&append_to_response=videos`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(responseJson => resolve(responseJson))
    })))
    .then(responseJson => {
        let sliderFilms = responseJson.slice(0,3);
        let newsFilms = responseJson.slice(4,8);

        sliderFilms = sliderFilms.reduce((acc, item, i) => acc +=
            `<div class="carousel-item ${i === 0 ? "active" : ''}">
                <div class="slider-container d-none d-md-block flex-wrap">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.videos.results[0].key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="movie-info">
                    <a href="https://www.imdb.com/title/${item.imdb_id}">
                        <h2>${item.original_title}</h2>
                        <p><b>Sinopse: </b>${item.overview}</p>
                        ${item.budget ? `<p><b>Orçamento: ${item.budget}</b></p>` : ''}
                        <b>Gêneros:</b>
                        <p>${item.genres.slice(0,3).map(({name}) => name).join(' | ')}</p>
                        <b>Avaliação:</b>
                        ${item.vote_average}/10 (IMDb)
                    </a>
                    </div>
                </div>
            </div>`, ''
        );

        $(sliderFilms).appendTo('#lancamentos .carousel-container .carousel-inner')

        newsFilms = newsFilms.reduce((acc, item) => acc +=
        `<a href="https://www.imdb.com/title/${item.imdb_id}"><img width="250" height="371" src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.id}"></a>`, ''
        )

        $(newsFilms).appendTo('#em-destaque .row-container')
    })
    .catch(e => console.log(e))
}

getSliderMovies();


const searchModal = async () => {
    $('.modal-body').empty();
    const value = $('#searchInput').val();

    let response = await fetch(`${URL_HOST}/3/search/movie?api_key=${api_key}&query=${value}`, {
        method: "GET",
    });
    response = await response.json();
    const {results} = response;

    let body;

    if(results.length){
        await Promise.all(results.slice(0,8).map(({id}) => new Promise((resolve) => {
                fetch(`${URL_HOST}/3/movie/${id}?api_key=${api_key}&append_to_response=videos`, {
                    method: "GET",
                })
                .then(response => response.json())
                .then(responseJson => resolve(responseJson))
            })))
            .then(responseJson => {
                body = responseJson.reduce((acc, item) => acc +=
                    `<a href="https://www.imdb.com/title/${item.imdb_id}">
                        <div class="row-modal">
                            <img width="125" height="185" src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.id}">
                            <div class="modal-margin">
                                <h2>${item.title}</h2>
                                <p><b>Sinopse: </b>${item.overview}</p>
                                <p><b>Avaliação:</b>
                                ${item.vote_average}/10 (IMDb)</p>
                            </div>
                        </div>
                    </a>`, ''
                );

                $('#myModal').modal('show');
            });
    }else{
        body = "<p>Não foram encontrados resultados!";
    }

    $(body).appendTo('.modal-body')

   
}