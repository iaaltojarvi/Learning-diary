const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var parser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
var router = express.Router();
var reader = require('./js/fileReader')
const fs = require('fs');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Login
app.post('/login', function (req, res) {
    console.log(req.body.username);
    res.cookie('username', req.body.username);
    res.redirect('/main.html');
})

//Logout
app.post('/logout', function (req, res) {
    res.clearCookie('username');
    res.redirect('/');
});

//get all the diary entries
router.route('/diaryEntries')
    .get(function (req, res) {
        reader.readDiaryFile('./files/data.json', function (fileContent) {
            res.json(fileContent);
        });
    })

    //add a diary entry to data.json, returns new entry
    .post(function (req, res) {
        reader.readDiaryFile('./files/data.json', function (contentsOfJson) {
            var newDiaryEntry = reader.saveNewEntryToJsonFile(req.body, contentsOfJson);
            res.json(newDiaryEntry);
        })
    })

// delete a diary entry
router.route('/diaryEntries/:username/:textId')
    .delete(function (req, res) {
        reader.readDiaryFile('./files/data.json', function (contentsOfJson) {
            var restEntries = reader.deleteEntry(req.params.textId, req.params.username, contentsOfJson);
            res.json(restEntries);
        })
    })

    .put(function (req, res) {
        reader.readDiaryFile('./files/data.json', function (contentsOfJson) {
//            console.log("kontentti" + contentsOfJson);
            //var editedText = req.body.diaryText; //tarkasta
            //console.log("muokattu teksti ", editedText);
            console.dir(req.body);
            var usersEntries = reader.editEntry(req.params.textId, req.params.username, req.body, contentsOfJson);
//           console.log("users" + usersEntries);
            res.json(usersEntries);
        })
    })

//returns users diaryentries (an array), if nothing was found sends an empty json array
router.route('/diaryEntries/:username')
    .get(function (req, res) {
        // console.log("Haetaan userin entryt, serverissä");
        // console.log("user parametri", req.params.username);
        reader.readDiaryFile('./files/data.json', function (fileContent) {
            var usersDiaryEntries = reader.readUsersEntries(fileContent, req.params.username);
            res.json(usersDiaryEntries);
        });
    })

app.use('/api', router);

let server = app.listen(3000, () => {
    console.log(`Server listening on ${server.address().port}`);
});