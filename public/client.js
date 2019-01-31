
$(document).ready(function () {
    // Greet user with "hey username!" using cookie
    // Remove problem of making "%20" as a space character(s)
    const precookie = document.cookie.split("=");
    const find = "%20";
    var re = new RegExp(find, 'g');
    const cookie = precookie[1].replace(re, ' ');
    const span = $('#welcome');
    span.text(`${cookie}`);

     // Sort unclicked
   let $clickedSortName = false;
   let $clickedSortDate = false;

   // Containers
   //var $entryList = $("#allEntries");
   var $showTable = $("#container");
   var $usersEntries = $("#accordion");

    //prints all entries
   function printAllEntries(index, diaryText, date, subject, $entryList, writer ) {
                $entryList.append($("<div>").addClass("panel panel-default").append($("<div>")
                .addClass("panel-heading").attr("id", "allentryheading" +index).attr("role", "tab").append($("<h4>")
                .addClass("panel-title").append($("<div>")
                .addClass("collapsed").attr("role", "button")
                .attr("data-toggle", "collapse").attr("data-parent", "#accordion").attr("href", "#allcollapse" +index)
                .attr("aria-expanded", "false").attr("aria-controls", "collapse"+index)
                .text(date + " " +writer + " " + subject)))));

                $entryList.append($("<div>").addClass("panel-collapse collapse")
                .attr("id", "allcollapse" +index).attr("role", "tabpanel")
                .attr("aria-labelledby", "heading" + index).append($("<div>").addClass("panel-body").attr("id", "paneltext"+index)));
                
                var $panelcontent = $("#paneltext" +index);

                $("<div>").attr("id", "subject"+index).text(subject).appendTo($panelcontent);

                $("<div>").attr("id", "date"+index).text(date).appendTo($panelcontent);
                $("<div>").attr("id", "content"+index).appendTo($panelcontent);
                var $entrycontents = $("#content"+index);
                $("<textarea>").attr("id", "area"+index).prop("readonly", true).text(diaryText).appendTo($entrycontents);
                $("<div>").attr("id", "btns-container"+index).appendTo($entrycontents);

    };

    // Create list. Sorted by name.
    function createNameSorted() {
        $.getJSON('/api/diaryEntries', function (jsondata) {
            // Sort toggle between clicked: true and false
            //$usersEntries.empty();
            $clickedSortName = !$clickedSortName;
            var journalItems = jsondata.sort(function (first, second) {
                if (first.name > second.name) {
                    return ($clickedSortName ? 1 : -1);
                } if (second.name > first.name) {
                    return ($clickedSortName ? -1 : 1);
                }
            })
            // WRITE
            var $entryList = $("#allEntries");
            $entryList.empty();
            for (var index in journalItems) {
                var writer = journalItems[index].name;
                var id = journalItems[index].id;
                var diaryEntries = journalItems[index].diaryItemList;
                for (var textindex in diaryEntries) {
                    
                    var diaryText = diaryEntries[textindex].diaryText;
                    var date = diaryEntries[textindex].date;
                    var subject = diaryEntries[textindex].subject;
                    
                    
                    printAllEntries(index, diaryText, date, subject, $entryList, writer);

                }
            }
        })
    };
    

    // SORT BY DATE
    $("#sortByDate").click(function() {
        $.getJSON('/api/diaryEntries', function (jsondata) {
        // Toggle between clicked: true and false
            $clickedSortDate = !$clickedSortDate;
            var $entryList = $("#allEntries");
            $entryList.empty();
           // $usersEntries.empty();

            var journalItems = jsondata;
            for (var index in journalItems) {
                var writer = journalItems[index].name;
                var id = journalItems[index].id;
                var diaryEntries = journalItems[index].diaryItemList;

                // Sort diaryentries by date

                diaryEntries = diaryEntries.sort(function (first, second) {
                    if (first.date > second.date) {
                        return ($clickedSortDate ? -1 : 1);
                    } if (second.date > first.date) {
                        return ($clickedSortDate ? 1 : -1);
                    }
                });

            // WRITE
                for (var textindex in diaryEntries) {
                    ;  
                    var diaryText = diaryEntries[textindex].diaryText;
                    var date = diaryEntries[textindex].date;
                    var subject = diaryEntries[textindex].subject;
                    var $entryList = $("#allEntries");
                    printAllEntries(index, diaryText, date, subject, $entryList, writer);
                    
                    
                }
            }
        });
    });

    $("#btn_my").click(function () {
        $.getJSON('/api/diaryEntries/' + cookie, function (jsondata) {
            var $MyEntryList = $("#accordion");
            var $entryList = $("#allEntries");
            $entryList.empty();
            $MyEntryList.empty();
            $showTable.addClass('hide');
            var journalItems = jsondata;
            console.log("users entries data: ", journalItems);
            console.log("haetaan userin entryt ", cookie);
            for (var index in journalItems) {
                var writer = cookie;
                var textId = journalItems[index].textID;
                var diaryText = journalItems[index].diaryText;
                var date = journalItems[index].date;
                var subject = journalItems[index].subject;
                
                //console.log("tulostetaan rivia", index);
                
                //entry message preview
                $MyEntryList.append($("<div>").addClass("panel panel-default").append($("<div>")
                .addClass("panel-heading").attr("id", "heading" +index).attr("role", "tab").append($("<h4>")
                .addClass("panel-title").append($("<div>")
                .addClass("collapsed").attr("role", "button")
                .attr("data-toggle", "collapse").attr("data-parent", "#accordion").attr("href", "#collapse" +index)
                .attr("aria-expanded", "false").attr("aria-controls", "collapse"+index)
                .text(date + "      " + subject)))));

                $MyEntryList.append($("<div>").addClass("panel-collapse collapse")
                .attr("id", "collapse" +index).attr("role", "tabpanel")
                .attr("aria-labelledby", "heading" + index).append($("<div>").addClass("panel-body").attr("id", "paneltext"+index)));
                
                var $panelcontent = $("#paneltext" +index);

                $("<div>").attr("id", "subject"+index).text(subject).appendTo($panelcontent);

                $("<div>").attr("id", "date"+index).text(date).appendTo($panelcontent);
                $("<div>").attr("id", "content"+index).appendTo($panelcontent);
                var $entrycontents = $("#content"+index);
                $("<textarea>").attr("id", "area"+index).prop("readonly", true).text(diaryText).appendTo($entrycontents);
                $("<div>").attr("id", "btns-container"+index).appendTo($entrycontents);
                var $bcontainer = $("#btns-container"+index);
                $("<button>").addClass("btn-del").attr("id", "del"+index).attr("value", textId).text("delete Entry").appendTo($bcontainer);
                $("<button>").addClass("btn-edit").attr("id", "edit"+index).attr("value", textId).text("Edit Entry").appendTo($bcontainer);
                $("<button>").addClass("btn-save").attr("id", "save"+index).attr("style", "display: none").attr("value", textId).text("Save Entry").appendTo($bcontainer);
                
                $("#save"+index).css("display", "none");
            }
        })
    });

    function addToList() {
        // var $writer = $("#writer").val();
        var writer = cookie;
        console.log("kirjoittaja", writer); //value from cookie
        var $date = $("#date").val();
        var $entry = $("#learned").val();
        var $subject = $("#subject").val();

        var diaryEntry = { "name": writer, "diaryEntry": $entry, "date": $date, "subject": $subject };
        //console.dir(JSON.stringify(diaryEntry));
       
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3000/api/diaryEntries",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(diaryEntry)
        }

        $.ajax(settings).done(function (response) { //$.ajax(settings) lähettää post:ina
            console.log("postin vastaus", response);
        });
    };

    // Add to my diary
    $("#btn-add").click(function () {
        addToList();
    });

    // Sort by name
    $("#sortByName").click(function() {
        createNameSorted();
    });

    // Show all entries
    $("#btn").click(function () {
        $showTable.toggleClass('hide');
        $usersEntries.addClass('hide');
        createNameSorted();
    });

    // deleting a message
    $(".panel-group").on('click','.btn-del', function(){

        //Vaatii tuloksen käsittelyn tauluun
        var username = cookie;
        console.log("username", cookie);
        var textId = $(this).val();
        console.log("klikatun buttonin arvo ", textId);
        
        var params ="http://localhost:3000/api/diaryEntries/"+ username + "/" + textId;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": params ,
            "method": "DELETE",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            "processData": false,
        // "data": JSON.stringify(textId)
        }

        $.ajax(settings).done(function (response) { //$.ajax(settings) lähettää post:ina
            console.log("postin vastaus", response);

        });
 
    });

    $(".panel-group").on('click','.btn-edit', function(){
        console.log("klikkasit edittiä");

        var idd = this.id; // get pressed buttons id which is edit(+index number, edit1, edit2 etc..), we need id number
        var idnumber = idd.slice(4); //remove 4 chars from the beginning of the string, rest is the index
        var $saveButton = $("#save" +idnumber); //save buttons id
        $saveButton.css("display","inline"); //makes save button visible

        $("#area"+idnumber).prop("readonly", false);

        
        $(this).css("display", "none");   //hide edit button, we don't need it anymore
 
    });

    $(".panel-group").on('click','.btn-save', function(){

        //Vaatii tuloksen käsittelyn tauluun
        var username = cookie;
        console.log("username", cookie);
        var idd = this.id;
        var idnumber = idd.slice(4);
        console.log("id", idnumber); 
        var $entry = $("#area"+idnumber).val();
        console.log("muokattu teksti", $entry);
        var textId = $(this).val();
        var $date = $("#date"+idnumber).text();
        var $subject = $("#subject"+idnumber).text();
        console.log("Entryn päivämäärä ", $date);
        var diaryEntry = { "name": username, "diaryEntry": $entry, "date": $date, "subject": $subject };
        console.log("klikatun buttonin arvo ", textId);
        
       var params ="http://localhost:3000/api/diaryEntries/"+ username + "/" + textId;
       
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": params,
            "method": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Cache-Control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(diaryEntry)
        }

        $.ajax(settings).done(function (response) { //$.ajax(settings) lähettää post:ina
            console.log("postin vastaus", response);
        });
 
    });

  
});
