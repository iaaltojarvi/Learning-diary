const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var parser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.json());
var router = express.Router();
var reader = require('./js/fileReader')
const fs = require('fs');


app.use(bodyParser.urlencoded( { extended: true } ));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Login
app.post('/login', function(req, res) {
    console.log(req.body.username);
    res.cookie('username', req.body.username);
    res.redirect('/main.html'); 
})

//Logout
app.post('/goodbye', function(req, res) {
    res.clearCookie('username');
    res.redirect('/');
});

router.route('/diaryEntries')
//get all the diary entries
.get(function (req, res) {
    console.dir(req.query);
    reader.readDiaryFile('./files/data.json', function(fileContent) {
        //console.log(fileContent);
        res.json(fileContent);
    });  
})

app.use('/api', router);

let server = app.listen(3000, () => {
    console.log(`Server listening on ${server.address().port}`);
});