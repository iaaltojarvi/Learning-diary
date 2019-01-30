
$(document).ready(function () {
    // cookie username to write hello username
    const cookie = document.cookie.split("=");
    const span = $('#welcome');
    span.text(`${cookie[1]}`);

    $("#btn").click(function () {

        $.getJSON('/api/diaryEntries', function (jsondata) {
            var $entryList = $("tbody");
            $entryList.empty();
            var journalItems = jsondata;
            console.log("jounnalItems pituus ", journalItems.length);
            for (var index in journalItems) {
                var writer = journalItems[index].name;
                var id = journalItems[index].id;
                var diaryEntries = journalItems[index].diaryItemList;
                console.log(diaryEntries.length);
                for (var textindex in diaryEntries) {
                    var diaryText = diaryEntries[textindex].diaryText;
                    var date = diaryEntries[textindex].date;
                    var $tr = $("<tr>");
                    $tr.appendTo($entryList);
                    //   ($("<td>").text(date).$("<td>").text(writer).$("<td>").text(diaryText)).appendTo($tr);
                    $("<td>").text(date).appendTo($tr);
                    $("<td>").text(writer).appendTo($tr);
                    $("<td>").text(diaryText).appendTo($tr);

                }

            }

        })

    });

    $("#btn_my").click(function () {
        //Vaatii tuloksen käsittelyn tauluun
        $.getJSON('/api/diaryEntries/' + cookie[1], function (jsondata) {
            var $entryList = $("#accordion");
            $entryList.empty();
            var journalItems = jsondata;
            console.log("users entries data: ", journalItems);
            console.log("haetaan userin entryt ", cookie[1]);
            for (var index in journalItems) {
                var writer = cookie[1];
                var textId = journalItems[index].textID;
                var diaryText = journalItems[index].diaryText;
                var date = journalItems[index].date;
                

                //console.log("tulostetaan rivia", index);
                
                //entry message preview
                $entryList.append($("<div>").addClass("panel panel-default").append($("<div>")
                .addClass("panel-heading").attr("id", "heading" +index).attr("role", "tab").append($("<h4>")
                .addClass("panel-title").append($("<div>")
                .addClass("collapsed").attr("role", "button")
                .attr("data-toggle", "collapse").attr("data-parent", "#accordion").attr("href", "#collapse" +index)
                .attr("aria-expanded", "false").attr("aria-controls", "collapse"+index)
                .text(date + " " + diaryText)))));

                $entryList.append($("<div>").addClass("panel-collapse collapse")
                .attr("id", "collapse" +index).attr("role", "tabpanel")
                .attr("aria-labelledby", "heading" + index).append($("<div>").addClass("panel-body").text(diaryText)));
                
                
            }

        })

    });

     /* $entryList.append($("<div>").addClass("panel panel-default").append()); //
                    $("<div>").addClass("panel-heading").attr("id", "heading" +textindex).attr("role", "tab").appendTo($entryList);
                    $("<h4>").addClass("panel-title").appendTo($entryList);
                    $("<div>").addClass("collapsed").attr("role", "button").attr("data-toggle", "collapse").attr("data-parent", "#accordion").attr("href", "#collapse" +textindex).attr("aria-expanded", "false").attr("aria-controls", "collapse"+textindex)
                    .text(date + " " + diaryText).appendTo($entryList);*/

    $("#btn-add").click(function () {

        // var $writer = $("#writer").val();
        var writer = cookie[1];
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