const notice = msg => new Notice(msg, 5000);
const log = msg => console.log(msg);


//Get your API key here https://developer.themoviedb.org/docs

const API_KEY_OPTION = "TMDB API Key";
const SEARCH_API_URL = "https://api.themoviedb.org/3/search/movie";
const MOVIE_DETAILS_URL = "https://api.themoviedb.org/3/movie/";
const MOVIE_API_URL = "https://movie-web.app/media/tmdb-movie-";


module.exports = {

    entry: start,
    settings: {
        name: "TMDB, movies",
        author: "Lemachi Barno",
        credits: "Based on Christian B. B. Houmann Movies script, with the help of ChatGPT 🤖",
        options: {
            [API_KEY_OPTION]: {
                type: "text",
                defaultValue: "",
                placeholder: "TMDB API Key",
            },
        }
    }

}

let QuickAdd;
let Settings;


async function start(params, settings) {

    QuickAdd = params;
    Settings = settings;

    const query = await QuickAdd.quickAddApi.inputPrompt("Enter movie title: ");
    
    if (!query) {
    
        notice("No query entered.");
        throw new Error("No query entered.");
    
    }

    const results = await getByQuery(query);

    if (!results || !results.length) {
    
        notice("No results found.");
        throw new Error("No results found.");
    
    }

    const choice = await QuickAdd.quickAddApi.suggester(formatResultsForSuggestion(results), results);

    if (!choice) {
    
        notice("No choice selected.");
        throw new Error("No choice selected.");
    
    }

    const selectedShow = await getByTmdbId(choice.id);

    const cast = selectedShow.credits.cast.map(actor => actor.name);
    const castFirstFive = selectedShow.credits.cast.slice(0, 5).map(actor => actor.name);
    const directorList = selectedShow.credits.crew.filter(({ job }) => job === 'Director');
    const directorNames = directorList.map(director => director.name);
    const releaseYear = selectedShow.release_date.split('-')[0];
    const genres = selectedShow.genres.map(genre => genre.name);
    const firstGenre = selectedShow.genres.length > 0 ? selectedShow.genres[0].name : 'No genre available';
    const movieID = selectedShow.id; 
    const movieLink = `${MOVIE_API_URL}${movieID}`;


    QuickAdd.variables = {

        ...selectedShow,
        actorLinks: linkifyList(cast),
        actorTopFiveLinks: linkifyList(castFirstFive),
        directorLinks: linkifyList(directorNames),
        directorNames: commaSeparatedList(directorNames),
        releaseYear: releaseYear,
        genre: firstGenre,
        genres: linkifyList(genres),
        movieLink: movieLink,
        fileName: replaceIllegalFileNameCharactersInString(selectedShow.title),
        typeLink: `[[Movies]]`,
    
    }

}


function formatResultsForSuggestion(results) {

    return results.map(resultItem => `${resultItem.title} (${resultItem.release_date.split('-')[0]})`);

}


async function getByQuery(query) {

    const searchResults = await apiGet(SEARCH_API_URL, {

        "api_key": Settings[API_KEY_OPTION],
        "query": query,

    });

    //console.log(searchResults.results);

    return searchResults.results;
}


async function getByTmdbId(id) {
   
    const res = await apiGet(`${MOVIE_DETAILS_URL}${id}`, {
   
        "api_key": Settings[API_KEY_OPTION],
        "append_to_response": "credits"
   
    });

    //console.log(res);

    return res;

}


function linkifyList(list) {
 
    return list.map(item => `\n  - "[[${item.trim()}]]"`).join("");

}


function commaSeparatedList(list) {

    return list.join(', ');

}


function replaceIllegalFileNameCharactersInString(string) {

    return string.replace(/[\\,#%&\{\}\/*<>$\'\":@]*/g, '');    

}


async function apiGet(url, data) {

    const finalURL = new URL(url);

    if (data) {

        Object.keys(data).forEach(key => finalURL.searchParams.append(key, data[key]));

    }

    const res = await fetch(finalURL.href);

    if (!res.ok) {

        notice("Error fetching data.");
        throw new Error("Error fetching data.");

    }

    return res.json();

}