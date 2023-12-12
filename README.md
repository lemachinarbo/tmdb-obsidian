# TMDb connection for Obsidian and QuickAdd

_tmdb-obsidian_ is a script for [QuickAdd](https://github.com/chhoumann/quickadd/) that allows you to add links for watching movies to your Obsidian Vault notes. 

By typing the movie's name, it returns the movie details from [The Movie Database (TMDb) API](https://developer.themoviedb.org/reference/intro/getting-started) and a link to watch the movie on [Movie-Web](https://github.com/movie-web/movie-web).

This script is a modified version of [movies.js](https://github.com/chhoumann/quickadd/blob/master/docs/docs/Examples/Attachments/movies.js) by [chhoumann](https://github.com/sponsors/chhoumann).


# How to create a list of movies to watch

## Demo
[demo.webm](https://github.com/lemachinarbo/tmdb-obsidian/assets/153532864/4124b33f-249a-4941-8d49-262d3b1a3b46)


## Requirements

- Install and activate [Quickadd](https://obsidian.md/plugins?id=quickadd) for Obsidian.
- Request a TMDb [API key](https://developer.themoviedb.org/docs/getting-started).


## Step 1: Setup the files

- Download the [tmdb.js](https://github.com/lemachinarbo/tmdb-obsidian/blob/4ec73db1fdeebf4e7e05d6439dc598e714b2545f/tmdb.js) and copy it into your vault (e.g. create a  `/scripts` folder and paste it there).
- Create a new note in your Vault to store the movies (e.g: `Movies to watch`)

## Step 2: Create a macro in QuickAdd

- Open the QuickAdd plugin settings (Click on the settings icon or `Ctrl` + `,` and then scroll to QuickAdd under Communnity Plugins on the left).
- Click on `Manage Macros` button.
- In the _Macro Manager_ window choose a name for you macro (e.g. `movies`) and click `Add Macro`.
- To setup the Macro click on `configure`.
- In the `User Scripts` option choose the `tmdb` script and click `add`.
- Click on the settings icon `⚙️` to the right of the `tmdb` script and paste the `API Key` provided by TMDb (If you don't have one, refer to the requirements section above).

## Step 3: Capturing movies data

- Click the `Capture` button to add a `Capture` choice and then click the settings icon `⚙️` besides the new `Untitled Capture Choice`.
- Double click the title to rename the choice and add a name (e.g. `add movie`).
- Under `File Name` choose the note you created  before to store the movies (e.g. `Movies to watch.md`).
- Toggle on the `Write to bottom of file` option.
- Toggle on the `Capture format` option.
- Copy and paste this format:
    ```
    - [{{VALUE:original_title}}]({{VALUE:movieLink}}) ({{VALUE:releaseYear}}) - {{VALUE:directorLink}}{{VALUE:genre}}, {{VALUE:vote_average}}
    ```
    This will generate 

    ```
    - [Forrest Gump](https://movie-web.app/media/tmdb-movie-13) (1994) - Robert Zemeckis - Comedy - 8.476
    ```

To create your own query, check all the variables available.

## Step 4: Creating a choice.

Now we need to create a choice to activate the macro:

- Go back to the `QuickAdd Settings` menu. 
- Add a name for the macro (e.g: `Movie`), select `Macro` in the dropdown and click `Add choice`.
- Click on the settings icon `⚙️` besides the new macro and select the macro we created before `movies` (or the name you choosed). And That's it! Close all the menus and let's add some movies.

## Step 5: Adding a movie

- Open the `command palette` (`Ctrl` + `p`).
- Type QuickAdd and select `QuickAdd: Run QuickAdd ` and press `Enter`.
- Select `Movie` and press `Enter`.
- Type the name of a movie `Forrest Gump` and press `Enter`.
- Select the movie that you want to add, and thats it! 


# Variables

You can access any of the TMDb variables by using `{{VALUE:<variable>}}` tag (e.g. `{{VALUE:original_title}}`). For more information check the [TMDb API documentation](https://developer.themoviedb.org/reference/movie-details)
Here's an example for the movie Forrest Gump:

```
{
  "adult": false,
  "backdrop_path": "/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
  "belongs_to_collection": null,
  "budget": 55000000,
  "credits": {
    "cast": [...],  // Array of cast details
    "crew": [...]   // Array of crew details
  },
  "genres": [
    { "id": 35, "name": "Comedy" },
    { "id": 18, "name": "Drama" },
    { "id": 10749, "name": "Romance" }
  ],
  "homepage": "https://www.paramountmovies.com/movies/forrest-gump",
  "id": 13,
  "imdb_id": "tt0109830",
  "original_language": "en",
  "original_title": "Forrest Gump",
  "overview": "A man with a low IQ has accomplished great things in his life...",
  "popularity": 101.714,
  "poster_path": "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  "production_companies": [...],  // Array of production company details
  "production_countries": [
    { "iso_3166_1": "US", "name": "United States of America" }
  ],
  "release_date": "1994-06-23",
  "revenue": 677387716,
  "runtime": 142,
  "spoken_languages": [
    { "english_name": "English", "iso_639_1": "en", "name": "English" }
  ],
  "status": "Released",
  "tagline": "The world will never be the same once you've seen it through the eyes of Forrest Gump.",
  "title": "Forrest Gump",
  "video": false,
  "vote_average": 8.476,
  "vote_count": 25771
}

```

Also, you can use any of this custom variables:

```
{
  "actorLinks": [
    "[[Tom Hanks]]",
    "[[Robin Wright]]",
    "[[Gary Sinise]]",
    "[[Sally Field]]",
    "[[Mykelti Williamson]]",
    // ... (rest of the actor links)
    "[[Bob Hope]]"
  ],
  "actorTopFiveLinks": [
    "[[Tom Hanks]]",
    "[[Robin Wright]]",
    "[[Gary Sinise]]",
    "[[Sally Field]]",
    "[[Mykelti Williamson]]"
  ],
  "directorLinks": [
    "[[Robert Zemeckis]]"
  ],
  "directorNames": "Robert Zemeckis",
  "releaseYear": 1994,
  "genre": "Comedy",
  "genres": [
    "[[Comedy]]",
    "[[Drama]]",
    "[[Romance]]"
  ],
  "movieLink": "https://movie-web.app/media/tmdb-movie-13",
  "fileName": "Forrest Gump",
  "typeLink": "[[Movies]]"
}

```

