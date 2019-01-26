//Andrew J Bagwell liri-bot hw11 Penn Boot Camp

require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require('fs');
var args = process.argv.slice(2);
var spotify = new Spotify(keys.spotify);
var command = args[0];
var input = args[1];

function spotifySearch(input) {
    var songQuery = input || "The Sign, Ace of Base";
    return spotify.search({
        type: "track",
        query: songQuery,
    }).then(function (songs) {
        var songInfo = songs.tracks.items[0];
        console.log("Artist(s): " + songInfo.artists[0].name);
        console.log("Song Name: " + songInfo.name);
        console.log("Preview Link: " + songInfo.preview_url);
        console.log("Album: " + songInfo.album.name);
    });
}

function movieThis(movie) {
    if (movie == "") {
        movie = "Mr. Nobody"
    }
    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=e918bca0";

    return axios.get(url)
        .then(function (response) {
            var movie = response.data;
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Country Produced: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function concertThis(artist) {
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=trilogy"

    return axios.get(url)
        .then(function (response) {
            var concert = response.data[0];
            // console.log(response.data[0])
            console.log("Date of event: " + moment(concert.datetime).format("MM/DD/YYYY"));
            console.log("Venue Name: " + concert.venue.name);
            console.log("Venue location: " + concert.venue.city);
        })
        .catch(function (error) {
            console.log(error);
        });
}

if (command === "spotify-this-song") {
    spotifySearch(input);
} else if (command === "concert-this") {
    concertThis(process.argv.slice(3).join(" "));
} else if (command === "movie-this") {
    movieThis(process.argv.slice(3).join(" "));
} else if (command === "do-what-it-says") {
    var contents = fs.readFileSync('./random.txt', 'utf8').split('\n').filter(Boolean);
    var splitContents = contents[0].split(', ');
    var newCommand = splitContents[0];
    var newInput = splitContents[1];
    if (newCommand === "spotify-this-song") {
        spotifySearch(newInput);
    } else if (newCommand === "movie-this") {
        movieThis(newInput);
    } else if (newCommand === "concert-this") {
        concertThis(newInput);
    } else { console.log("command not found") }
} else {
    console.log("command not found")
}