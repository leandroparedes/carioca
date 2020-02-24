const express = require('express');
const app = express();

app.use(express.static(__dirname + "/dist/"));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/save-game', function (req, res) {
    let data = require('./game-data.json');

    data.games = data.games.filter(game => game.gameID != req.body.gameID);

    data.games.push(req.body);

    let jsonData = JSON.stringify(data, null, 4); // pretty json

    const fs = require('fs');

    fs.writeFile('game-data.json', jsonData, 'utf8', (err) => {
        if (err) throw err;
        console.log('save completed');
    });

    res.sendStatus(200);
});

app.get(/.*/, function (req, res) {
    res.sendfile(__dirname + "/dist/index.html");
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on ${port}`));