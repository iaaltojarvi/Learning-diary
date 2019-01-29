const fs = require('fs');
var currenTextId = 100;

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

     /* Writes data to data.json file. 
        - diaryInput value must be in json format
    */
    writeToDiaryFile: function(filename, diaryInput) {
        fs.writeFile(filename, JSON.stringify(diaryInput), function() {
            console.log("Saved to files");
        });
    },

    makeJsonObject: function(params) {
        var writer = params.name;
        var wid = params.id;
        var entry = params.diaryEntry;
        var entryId = currenTextId+1;
       
        
        
        
        var opt = {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false}; 
        var d = new Date(); //pvm kellonaika 
        var dateTime = d.toLocaleString('fi-FI', opt);

        var newEntryText = [{"date": dateTime, "diaryText": entry, "textID": entryId }];
        

        var diaryEntryObject = {"name": writer, "id": wid, "diaryItemList": newEntryText }
        return diaryEntryObject;
    },

    makeDiaryItemList: function(journalEntries, params) {
        var entry = params.diaryEntry;
        var entryId = currenTextId+1;
        var entryTexts = journalEntries;

        
        
        var opt = {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false}; 
        var d = new Date(); //pvm kellonaika 
        var dateTime = d.toLocaleString('fi-FI', opt);

        var newEntryText = {"date": dateTime, "diaryText": entry, "textID": entryId };
        entryTexts.push(newEntryText);

        return entryTexts;

    },

}