// Todo:
// - Search TV streaming URL
// - Update readme
// - Test TV and Movie fields

const API_KEY_OPTION = 'TMDB API Key';
const SEARCH_API_URL_MOVIE = 'https://api.themoviedb.org/3/search/movie';
const SEARCH_API_URL_TV = 'https://api.themoviedb.org/3/search/tv';
const MOVIE_DETAILS_URL = 'https://api.themoviedb.org/3/movie/';
const TV_DETAILS_URL = 'https://api.themoviedb.org/3/tv/';
const MOVIE_API_URL = 'https://movie-web.app/media/tmdb-movie-';
const TV_API_URL = '';

// eslint-disable-next-line no-undef
module.exports = {
    entry: start,
    settings: {
        name: 'TMDB, movies and series',
        author: 'Lemachi Barno',
        credits:
            'Based on Christian B. B. Houmann Movies script, with the help of ChatGPT 🤖',
        options: {
            [API_KEY_OPTION]: {
                type: 'text',
                defaultValue: '',
                placeholder: 'TMDB API Key',
            },
        },
    },
};

let QuickAdd;
let Settings;

async function start(params, settings) {
    QuickAdd = params;
    Settings = settings;

    const query = await QuickAdd.quickAddApi.inputPrompt(
        'Enter title (movie or series): '
    );

    if (!query) {
        notice('No query entered.');
        throw new Error('No query entered.');
    }

    const type = await QuickAdd.quickAddApi.suggester(
        ['Movie', 'TV Series'],
        ['movie', 'tv']
    );

    if (!type) {
        notice('No type selected.');
        throw new Error('No type selected.');
    }

    const apiUrl = type === 'movie' ? SEARCH_API_URL_MOVIE : SEARCH_API_URL_TV;
    const results = await getByQuery(query, apiUrl);

    if (!results || !results.length) {
        notice('No results found.');
        throw new Error('No results found.');
    }

    const choice = await QuickAdd.quickAddApi.suggester(
        formatResultsForSuggestion(results),
        results
    );

    if (!choice) {
        notice('No choice selected.');
        throw new Error('No choice selected.');
    }

    const selectedShow = await getByTmdbId(choice.id, type);

    const imagesURL = 'https://image.tmdb.org/t/p/';
    const thumbWidth = 'w500';

    const cast = selectedShow.credits.cast.map((actor) => actor.name);
    const castFirstFive = selectedShow.credits.cast
        .slice(0, 5)
        .map((actor) => actor.name);

    const directorList = selectedShow.credits.crew.filter(
        ({ job }) => job === 'Director'
    );
    const directorNames = directorList.map((director) => director.name);

    const releaseYear =
        type === 'movie'
            ? selectedShow.release_date?.split('-')[0] || 'Unknown'
            : selectedShow.first_air_date?.split('-')[0] || 'Unknown';

    const genres = selectedShow.genres.map((genre) => genre.name);
    const firstGenre =
        selectedShow.genres.length > 0
            ? selectedShow.genres[0].name
            : 'No genre available';

    const id = selectedShow.id;
    const typeLink = type === 'movie' ? '[[Movies]]' : '[[TV Shows]]';
    const poster = selectedShow.poster_path;
    const posterURL = `${imagesURL}${thumbWidth}${poster}`;

    const fileName = type === 'movie' ? selectedShow.title : selectedShow.name;

    QuickAdd.variables = {
        ...selectedShow,
        actorLinks: linkifyList(cast),
        actorTopFiveLinks: linkifyList(castFirstFive),
        directorLinks: linkifyList(directorNames),
        directorNames:
            directorNames.length > 0
                ? commaSeparatedList(directorNames)
                : 'No directors available',
        releaseYear: releaseYear,
        genre: firstGenre,
        genres: linkifyList(genres),
        movieLink: `${type === 'movie' ? MOVIE_API_URL : TV_API_URL}${id}`,
        fileName: sanitizeCharacters(fileName),
        originalTitle: sanitizeCharacters(
            type === 'movie'
                ? selectedShow.original_title
                : selectedShow.original_name
        ),
        typeLink: typeLink,
        poster: posterURL,
        backdrop: selectedShow.backdrop_path
            ? `${imagesURL}${thumbWidth}${selectedShow.backdrop_path}`
            : '',
        tagline: selectedShow.tagline || '',
        status: selectedShow.status || '',
        budget: selectedShow.budget || 'Not available',
        revenue: selectedShow.revenue || 'Not available',
        voteAverage: selectedShow.vote_average || 'Not available',
        voteCount: selectedShow.vote_count || 'Not available',
        adult: selectedShow.adult ? 'Yes' : 'No',
        imdbId: selectedShow.imdb_id || 'Not available',
        rating: selectedShow.vote_average || 'Not available',
        productionCompanies:
            selectedShow.production_companies
                .map((company) => company.name)
                .join(', ') || 'Not available',
        spokenLanguages:
            selectedShow.spoken_languages
                .map((language) => language.name)
                .join(', ') || 'Not available',
        originalLanguage: selectedShow.original_language || 'Not available',
    };
}

function formatResultsForSuggestion(results) {
    return results.map((resultItem) => {
        const titleOrName = resultItem.title || resultItem.name;
        const releaseDateOrFirstAirDate =
            resultItem.release_date || resultItem.first_air_date || 'Unknown';

        const releaseYear =
            releaseDateOrFirstAirDate.split('-')[0] || 'Unknown';

        return `${titleOrName} (${releaseYear})`;
    });
}

async function getByQuery(query, apiUrl) {
    const searchResults = await apiGet(apiUrl, {
        api_key: Settings[API_KEY_OPTION],
        query: query,
    });

    return searchResults.results;
}

async function getByTmdbId(id, typeChoice) {
    const detailsUrl =
        typeChoice === 'movie' ? MOVIE_DETAILS_URL : TV_DETAILS_URL;
    const res = await apiGet(`${detailsUrl}${id}`, {
        api_key: Settings[API_KEY_OPTION],
        append_to_response: 'credits',
    });

    return res;
}

async function apiGet(url, data) {
    const finalURL = new URL(url);

    if (data) {
        Object.keys(data).forEach((key) =>
            finalURL.searchParams.append(key, data[key])
        );
    }

    const res = await fetch(finalURL.href);

    if (!res.ok) {
        notice('Error fetching data.');
        throw new Error('Error fetching data.');
    }

    return res.json();
}

function linkifyList(list) {
    return list.map((item) => `\n  - "[[${item.trim()}]]"`).join('');
}

function commaSeparatedList(list) {
    return list.join(', ');
}

function sanitizeCharacters(string) {
    return string.replace(/[\\,#%&{}/*<>$'":@]*/g, '');
}

function notice() {
    // return new Notice(msg, 5000);
}
