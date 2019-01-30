
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
   var $entryList = $("tbody");
   var $showTable = $("#container");

   // SORT BY DATE
   $("#sortByDate").click(function() {
    $.getJSON('/api/diaryEntries', function (jsondata) {
        // Toggle between clicked: true and false
        $clickedSortDate = !$clickedSortDate;
        $entryList.empty();

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
                var diaryText = diaryEntries[textindex].diaryText;
                var date = diaryEntries[textindex].date;
                var $tr = $("<tr>");
                $tr.appendTo($entryList);
                $("<td>").text(date).appendTo($tr);
                $("<td>").text(writer).appendTo($tr);
                $("<td>").text(diaryText).appendTo($tr);
            }
        }
   });
});

    // SORT BY NAME
    $("#sortByName").click(function() {
        $.getJSON('/api/diaryEntries', function (jsondata) {
            // Sort toggle between clicked: true and false
            $clickedSortName = !$clickedSortName;
            var journalItems = jsondata.sort(function (first, second) {
                if (first.name > second.name) {
                    return ($clickedSortName ? -1 : 1);
                } if (second.name > first.name) {
                    return ($clickedSortName ? 1 : -1);
                }
            })
            // WRITE
            $entryList.empty();
            for (var index in journalItems) {
                var writer = journalItems[index].name;
                var id = journalItems[index].id;
                var diaryEntries = journalItems[index].diaryItemList;
                for (var textindex in diaryEntries) {
                    var diaryText = diaryEntries[textindex].diaryText;
                    var date = diaryEntries[textindex].date;
                    var $tr = $("<tr>");
                    $tr.appendTo($entryList);
                    $("<td>").text(date).appendTo($tr);
                    $("<td>").text(writer).appendTo($tr);
                    $("<td>").text(diaryText).appendTo($tr);

                }
            }
        })
    });

    // Show all entries
    $("#btn").click(function () {
        $showTable.toggleClass('hide');
        $.getJSON('/api/diaryEntries', function (jsondata) {
            $entryList.empty();
            var journalItems = jsondata;
            for (var index in journalItems) {
                var writer = journalItems[index].name;
                var id = journalItems[index].id;
                var diaryEntries = journalItems[index].diaryItemList;
                for (var textindex in diaryEntries) {
                    var diaryText = diaryEntries[textindex].diaryText;
                    var date = diaryEntries[textindex].date;
                    var $tr = $("<tr>");
                    $tr.appendTo($entryList);
                    $("<td>").text(date).appendTo($tr);
                    $("<td>").text(writer).appendTo($tr);
                    $("<td>").text(diaryText).appendTo($tr);
                }
            }
        })
    });

    $("#btn_my").click(function () {
        $.getJSON('/api/diaryEntries/' + cookie, function (jsondata) {
            var $MyentryList = $("#accordion");
            $entryList.empty();
            $showTable.addClass('hide');
            var journalItems = jsondata;
            console.log("users entries data: ", journalItems);
            console.log("haetaan userin entryt ", cookie);
            for (var index in journalItems) {
                var writer = cookie;
                var textId = journalItems[index].textID;
                var diaryText = journalItems[index].diaryText;
                var date = journalItems[index].date;
                
                //console.log("tulostetaan rivia", index);
                
                //entry message preview
                $MyentryList.append($("<div>").addClass("panel panel-default").append($("<div>")
                .addClass("panel-heading").attr("id", "heading" +index).attr("role", "tab").append($("<h4>")
                .addClass("panel-title").append($("<div>")
                .addClass("collapsed").attr("role", "button")
                .attr("data-toggle", "collapse").attr("data-parent", "#accordion").attr("href", "#collapse" +index)
                .attr("aria-expanded", "false").attr("aria-controls", "collapse"+index)
                .text(date + "      " + diaryText)))));

                $MyentryList.append($("<div>").addClass("panel-collapse collapse")
                .attr("id", "collapse" +index).attr("role", "tabpanel")
                .attr("aria-labelledby", "heading" + index).append($("<div>").addClass("panel-body").text(diaryText)));
            }

        })

    });

    $("#btn-add").click(function () {
        // var $writer = $("#writer").val();
        var writer = cookie;
        console.log("kirjoittaja", writer); //value from cookie
        var $date = $("#date").val();
        var $entry = $("#learned").val();

        var diaryEntry = { "name": writer, "id": 22, "diaryEntry": $entry, "date": $date };
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
    })

 // deleting a message
    $("#btn_del").click(function () {
        //Vaatii tuloksen käsittelyn tauluun
        var username;
        var textId;
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
});