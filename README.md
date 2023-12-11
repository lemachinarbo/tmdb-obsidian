# TMDb connection for Obsidian and QuickAdd

_tmdb-obsidian_ is a script for [QuickAdd](https://github.com/chhoumann/quickadd/) that allows you to quickly add links for watching movies and movie information to your Obsidian Vault notes. 

By typing the movie's name, it returns a link to watch the movie on [Movie-Web](https://github.com/movie-web/movie-web), and the movies details from [The Movie Database (TMDb) API](https://developer.themoviedb.org/reference/intro/getting-started).

This script is a modified version of [movies.js](https://github.com/chhoumann/quickadd/blob/master/docs/docs/Examples/Attachments/movies.js) by [chhoumann](https://github.com/sponsors/chhoumann).


# How to create a list of movies to watch

## Demo
[demo.webm](https://github.com/lemachinarbo/tmdb-obsidian/blob/54d3bc50804249a0ae78b42b56b66a03ede54341/docs/media/demo.webm)



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



