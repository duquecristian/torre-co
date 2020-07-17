var keywords;
var requestCounter = 0;
var noResultsPeople = false;

$(function () {
    $("#worker-dialog").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });
    $("#job-dialog").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });
});

$.ajaxSetup({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});
function fetchData() {
    keywords = $("#filter").val();
    $(".loading").show();
    callNumber = ++requestCounter;
    find("https://search.torre.co/people/_search/?offset=0&size=10&aggregate=false", people);
    find("https://search.torre.co/opportunities/_search/?offset=0&size=10&aggregate=false", opportunities);
}

function find(url, callback) {
    if (callback === people)
        $.post(url,
            JSON.stringify({ "name": { "term": keywords } }),
            callback);
    else
        $.post(url,
            //{ "skill": { "term": keywords } },
            JSON.stringify({ "and": [{ "skill": { "term": keywords, "experience": "potential-to-develop" } }] }),
            callback);
}

function retry(url, callback) {
    if (callback === people)
        $.post(url,
            JSON.stringify({ "skill": { "term": keywords, "experience": "potential-to-develop" } }),
            callback);
}

function people(data, status) {
    if (callNumber === requestCounter) {
        $("div.people-container").html("");
        var results = data.results;
        var records = results.length;
        var output = "";
        if (records === 0) {
            retry("https://search.torre.co/people/_search/?offset=0&size=10&aggregate=false", people);
            return;
        }

        for (i = 0; i < records; i++) {
            output +=
                '                        <div class="card-body">' +
                '    <div class= "card flex-md-row mb-4 shadow-sm h-md-250">' +
                '<div class="card-body d-flex flex-column align-items-start">' +
                '    <strong class="d-inline-block mb-2 text-primary">' + results[i].locationName + '</strong>' +
                '    <h3 class="mb-0">' + results[i].name + '</h3>' +
                '<p class="cadr-text mb-auto">' +
                results[i].professionalHeadline +
                '        </p>' +
                '<a href="javascript:bio(\'' + results[i].username + '\');">View more info</a>' +
                '    </div>' +
                '<img src="' + results[i].picture + '" class="bd-placeholder-img card-img-right flex-auto d-none d-lg-block" />' +
                '</div>' +
                '</div>';
        }
        $("div.people-container").html(jQuery.parseHTML(output));
    }
    $(".loading").hide();
}

function opportunities(data, status) {
    if (callNumber === requestCounter) {
        $("div.opportunities-container").html("");
        var results = data.results;
        var records = results.length;
        var output = "";
        var remote;
        var skills = "";
        var organizations = "";
        var picture = "";
        for (i = 0; i < records; i++) {
            if (results[i].remote === "true")
                remote = "Yes";
            else
                remote = "No";
            for (j = 0; j < results[i].skills.length; j++) {
                if (j > 0)
                    skills += " | ";
                if (j = 10)
                    break;
                skills += results[i].skills[j].name;
            }
            for (k = 0; k < results[i].organizations.length; k++) {
                if (k > 0)
                    organizations += " | ";
                organizations = results[i].organizations[k].name;
                picture = results[i].organizations[k].picture;
            }
            output +=
                '                        <div class="card-body">' +
                '    <div class= "card flex-md-row mb-4 shadow-sm h-md-250">' +
                '<div class="card-body d-flex flex-column align-items-start">' +
                '    <strong class="d-inline-block mb-2 text-primary">Remote: ' + remote + '</strong>' +
                '    <h3 class="mb-0">' + organizations + '</h3>' +
                '<p class="cadr-text mb-auto">' +
                results[i].objective + '<br/>' + skills +
                '        </p>' +
                '<a href="javascript:job(\'' + results[i].id + '\');">View more info</a>' +
                '    </div>' +
                '<img src="' + picture + '" class="bd-placeholder-img card-img-right flex-auto d-none d-lg-block" />' +
                '</div>' +
                '</div>';
        }
        $("div.opportunities-container").html(jQuery.parseHTML(output));
    }
    $(".loading").hide();
}

function bio(id) {
    $.get("https://cors-anywhere.herokuapp.com/https://bio.torre.co/api/bios/" + id, function (data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    });
    $("#worker-dialog").dialog("open");
}

function job(id) {
    $.get("https://cors-anywhere.herokuapp.com/https://torre.co/api/opportunities/" + id, function (data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    });
    $("#job-dialog").dialog("open");
}