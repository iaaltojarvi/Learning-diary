const fs = require('fs');
var currentTextId = 100;

/*public filereader class*/
module.exports = {

    /*Reads all the diary entries from the data.json file
        - contents of the data.json file are given as a parameter to the callback function
    */
    readDiaryFile: function (fileName, callback) {
        fs.readFile(fileName, function (err, data) {
            try {
                var diaryText = JSON.parse(data);
                callback(diaryText);
            }
            catch (err) {
                console.log("File is empty");
                var diaryText = JSON.parse("{}");
                callback(diaryText);
            }
        });
    },

    /*Reads users diary entries from data.json file
        - contents of the data.json file are given as a parameter 
        - username as a parameter
        - calls a private function findUsersEntries
        - retuns an array of users diary entries
    */
    readUsersEntries: function (fileContent, username) {
        var usersEntries = findUsersEntries(fileContent, username);
        return usersEntries;
    },


       /*Deletes users diary entry from data.json file
        - contents of the data.json file are given as a parameter 
        - username as a parameter
        - diary entry ID,
        - calls a private function findUsersEntries to get all the users diary entries
        - retuns an array of users diary entries that are left
    */
    deleteEntry: function (textId, username, fileContent) {
        var usersEntries = findUsersEntries(fileContent, username);
        for (var index in usersEntries) {
            if (usersEntries[index].textID == textId) {
                //console.log("deleteEntry textID match");
                usersEntries.splice(index, 1); //deletes an entry from index
                for (var i in fileContent) {
                    if (fileContent[i].name == username) { //correct user was found from data.json
                        //console.log("writetoDiary name match username");
                        fileContent[i].diaryItemList = usersEntries; //users diary entries are updated
                        writeToDiaryFile('./files/data.json', fileContent);
                        return usersEntries;
                    }
                    else {
                        //return "No more userEntries";
                    }
                }
            }
        }
    },

    editEntry: function (textId, username, body, fileContent) {
      //  var editedText = body.diaryItemList[0].diaryText;   //tämä ei toimi
        var editedText = body.diaryEntry;
        //console.log("muokattu teksti " )
        console.log("muokattu teksti", editedText);
        console.log("filecontent " + fileContent);
        console.log("editEntryn parametrit", textId, username, editedText, fileContent);
        var usersEntries = findUsersEntries(fileContent, username);
        console.log("findUsersEntries tulos", usersEntries);
        for (var index in usersEntries) {
            if (usersEntries[index].textID == textId) { //edited diary entry found 
                console.log("entry ID löytyi : ", textId);
                usersEntries[index].diaryText = editedText; //diary entry text is updated
                for (var index in fileContent) {
                    if (fileContent[index].name == username) { 
                        fileContent[index].diaryItemList = usersEntries;//users entire diary item list is updated with the version of updated diary entry
                        writeToDiaryFile('./files/data.json', fileContent);
                        return usersEntries;
                    }
                }
            }
        }
        
    },

    /*Saves new diary entry to the data.json file
        - params is the req.body
        - jsonContents of the data.json file are given as a parameter to the callback function
        - returns the new diary entry object
    */
    saveNewEntryToJsonFile: function (params, jsonContents) {
        var writer = params.name;
        var wid = params.id;
        var entry = params.diaryEntry; //new diary entry text
        // currentTextId += 1;
        //var entryId = currentTextId;

        var d = new Date(); //current time
        var entryId = d.getMilliseconds();
        // console.log(entryId);
        var entryDate = params.date;
        var writerFound = false;

        for (var indeksi in jsonContents) {

            if (jsonContents[indeksi].name == writer) { //if writer has already submitted diary entries
                writerFound = true;
                var olderJournalEntries = jsonContents[indeksi].diaryItemList;
                jsonContents[indeksi].diaryItemList = makeDiaryItemList(olderJournalEntries, entry, entryDate);
                writeToDiaryFile('./files/data.json', jsonContents);
            }
        }

        if (!writerFound) { //if diary entry is users first entry
            var newEntryText = [{ "date": entryDate, "diaryText": entry, "textID": entryId }];
            var diaryEntryObject = { "name": writer, "id": wid, "diaryItemList": newEntryText }
            jsonContents.push(diaryEntryObject);
            writeToDiaryFile('./files/data.json', jsonContents);
        }

        return diaryEntryObject;
    },
}

/* Function adds a new diary entry to an old list of diary entries 
   - private function, access is possibe only from fileReader.js
   - journalEntries is an array of old diary entries
   - newEntry is a new diary entry
   - entryDate is date
   - returns an array of all the user diary entries, new diary entry is included
*/
function makeDiaryItemList(journalEntries, newEntry, entryDate) {
    
    var d = new Date(); //current time
    var entryId = d.getMilliseconds();
    var entryTexts = journalEntries;

    var newEntryText = { "date": entryDate, "diaryText": newEntry, "textID": entryId };
    entryTexts.push(newEntryText); //new entry is pushed to an array of old entries

    return entryTexts;
}


/* Writes data to data.json file. 
   - private function, access is possibe only from fileReader.js
   - diaryInput value must be in json format
*/
function writeToDiaryFile(filename, diaryInput) {
    console.log("kirjoitusta");
    fs.writeFile(filename, JSON.stringify(diaryInput), function () {
        console.log("Saved to files");
    });
};

/* Finds users diary entrie. Reads them from data.json and returns them as an array
   - private function, access is possibe only from fileReader.js
   - jsonContents is the data from data.json
   - returns an array of users diary entries
   - if user was not found return an empty array
*/
function findUsersEntries(jsonContents, user) {
    var writerFound = false;
    var emptyArray = [];

    for (var indeksi in jsonContents) {

        if (jsonContents[indeksi].name == user) { //if writer was found from data.json
            writerFound = true;
            var oldJournalEntries = jsonContents[indeksi].diaryItemList;
            return oldJournalEntries; //returns writers old diary entries as an array
        }
    }

    if (!writerFound) {
        return emptyArray;
    }
}