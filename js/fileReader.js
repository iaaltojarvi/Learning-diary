const fs = require('fs');
var currentTextId = 100;

/*public filereader class*/
module.exports = {

    /*Reads all the diary entries from the data.json file
        - contents of the data.json file are given as a parameter to the callback function
    */
    readDiaryFile: function(fileName, callback) {
        fs.readFile(fileName, function(err, data) {
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

    /*Saves new diary entry to the data.json file
        - params is the req.body
        - jsonContents of the data.json file are given as a parameter to the callback function
    */
    saveNewEntryToJsonFile: function(params, jsonContents) {
        var writer = params.name;
        var wid = params.id;
        var entry = params.diaryEntry;
        currentTextId += 1;
        var entryId = currentTextId;
        var entryDate = params.date;
        var writerFound = false;
       
        for (var indeksi in jsonContents) {
           
             if(jsonContents[indeksi].name == writer) { //if writer has already submitted diary entries
                 writerFound = true;
                 var olderJournalEntries = jsonContents[indeksi].diaryItemList;
                 jsonContents[indeksi].diaryItemList = makeDiaryItemList(olderJournalEntries, entry, entryDate);
                 writeToDiaryFile('./files/data.json', jsonContents);
             }
         }
        
        if (!writerFound) {
            var newEntryText = [{"date": entryDate, "diaryText": entry, "textID": entryId }];
            var diaryEntryObject = {"name": writer, "id": wid, "diaryItemList": newEntryText }
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
    */
function makeDiaryItemList(journalEntries, newEntry, entryDate) {
    currentTextId += 1; 
    var entryId = currentTextId; //every diary entry needs an ID
    var entryTexts = journalEntries;

    var newEntryText = {"date": entryDate, "diaryText": newEntry, "textID": entryId };
    entryTexts.push(newEntryText); //new entry is pushed to an array of old entries

    return entryTexts;
}


     /* Writes data to data.json file. 
        - private function, access is possibe only from fileReader.js
        - diaryInput value must be in json format
    */
function writeToDiaryFile(filename, diaryInput) {
    fs.writeFile(filename, JSON.stringify(diaryInput), function() {
        console.log("Saved to files");
    });
};