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
app.post('/logout', function(req, res) {
    res.clearCookie('username');
    res.redirect('/');
});

//get all the diary entries
router.route('/diaryEntries')
.get(function (req, res) {
    console.dir(req.query);
    reader.readDiaryFile('./files/data.json', function(fileContent) {
        //console.log(fileContent);
        res.json(fileContent);
    });  
})

//add a diary entry
.post(function(req, res) {
    console.dir("postin req.body",req.body);
    var list = [];
    var vanhaNimi = false;

    reader.readDiaryFile('./files/data.json', function(filu){
        //console.log(filu);
        for (var indeksi in filu) {
           // console.log("Filun sisalto",filu);
            if(filu[indeksi].name == req.body.name) {
               // console.log(filu[indeksi].name);
                //console.log("filu diaryitemlist", filu[indeksi].diaryItemList);
                vanhaNimi = true;
                list = filu[indeksi].diaryItemList;
                var olderJournalEntries = list;
                filu[indeksi].diaryItemList= reader.makeDiaryItemList(olderJournalEntries, req.body);
                reader.writeToDiaryFile('./files/data.json', filu);
            }
        }

        if (!vanhaNimi) {
            console.log("Uusi kirjoittaja");
            var diaryobject = reader.makeJsonObject(req.body);
            console.log(diaryobject);
            filu.push(diaryobject);
            reader.writeToDiaryFile('./files/data.json', filu);
        }

        res.json(req.body);


    })

});

app.use('/api', router);

let server = app.listen(3000, () => {
    console.log(`Server listening on ${server.address().port}`);
});