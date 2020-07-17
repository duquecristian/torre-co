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
        },
        width: 500,
        height: 500
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
        },
        width: 500,
        height: 500
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
        var person = data.person;
        var strengthsJson = data.strengths;
        var interestsJson = data.interests;
        var experiencesJson = data.experiences;
        var languagesJson = data.languages;
        var strengths = "", interests = "", experiences = "", languages = "";
        for (j = 0; j < strengthsJson.length; j++) {
            if (j > 0)
                strengths += " | ";
            strengths += strengthsJson[j].name;
        }
        for (j = 0; j < interestsJson.length; j++) {
            if (j > 0)
                interests += " | ";
            interests += interestsJson[j].name;
        }
        for (j = 0; j < experiencesJson.length; j++) {
            if (j > 0)
                experiences += " | ";
            experiences += experiencesJson[j].name;
        }
        for (j = 0; j < languagesJson.length; j++) {
            if (j > 0)
                languages += " | ";
            languages += languagesJson[j].language;
        }
        var output =
            '                        <div class="card-body">' +
            '    <div class= "card flex-md-row mb-4 shadow-sm h-md-250">' +
            '<div class="card-body d-flex flex-column align-items-start">' +
            '    <img src="' + person.picture + '" class="bd-placeholder-img card-img-right flex-auto d-none d-lg-block" />' +
            '    <strong class="d-inline-block mb-2 text-primary">' + person.location.name + '</strong>' +
            '    <h3 class="mb-0">' + person.name + '</h3>' +
            '<p class="cadr-text mb-auto">' +
            person.professionalHeadline + '<br/>' +
            '<strong>Strengths:</strong> ' + strengths + '<br/>' +
            '<strong>Interests:</strong> ' + interests + '<br/>' +
            '<strong>Experiences:</strong> ' + experiences + '<br/>' +
            '<strong>Languages:</strong> ' + languages + '<br/>' +
            '        </p>' +
            '<strong><a href="https://bio.torre.co/' + person.publicId + '">View Professional Genome</a></strong>' +
            '    </div>' +
            '</div>' +
            '</div>';
        $("div.worker-info").html(jQuery.parseHTML(output));
        $(".worker-loading").hide();
    });
    $("#worker-dialog").dialog("open");
}

function job(id) {
    $.get("https://cors-anywhere.herokuapp.com/https://torre.co/api/opportunities/" + id, function (data, status) {
        var owner = data.owner;
        var strengthsJson = data.strengths;
        var detailsJson = data.details;
        var languagesJson = data.languages;
        var strengths = "", details = "", organization = "", languages = "", remote;
        for (j = 0; j < strengthsJson.length; j++) {
            if (j > 0)
                strengths += " | ";
            strengths += strengthsJson[j].name;
        }
        for (j = 0; j < detailsJson.length; j++) {
            if (j > 0)
                details += " | ";
            details += detailsJson[j].content;
        }
        if (data.place.remote === "true")
            remote = "Yes";
        else
            remote = "No";
        for (j = 0; j < languagesJson.length; j++) {
            if (j > 0)
                languages += " | ";
            languages += languagesJson[j].language.name;
        }
        for (k = 0; k < data.organizations.length; k++) {
            if (k > 0)
                organization += " | ";
            organization += data.organizations[k].name;
        }
        var output =
            '                        <div class="card-body">' +
            '    <div class= "card flex-md-row mb-4 shadow-sm h-md-250">' +
            '<div class="card-body d-flex flex-column align-items-start">' +
            '    <img src="' + owner.picture + '" class="bd-placeholder-img card-img-right flex-auto d-none d-lg-block" />' +
            '    <strong class="d-inline-block mb-2 text-primary">Remote:' + remote + '</strong>' +
            '    <h3 class="mb-0">' + data.objective + '</h3>' +
            '<p class="cadr-text mb-auto">' +
            organization + '<br/>' +
            details + '<br/>' +
            '<strong>Strengths:</strong> ' + strengths + '<br/>' +
            '<strong>Languages:</strong> ' + languages + '<br/>' +
            '        </p>' +
            '<strong><a href="https://torre.co/es/jobs/' + id + '">View All Specs</a></strong>' +
            '    </div>' +
            '</div>' +
            '</div>';
        $("div.job-info").html(jQuery.parseHTML(output));
        $(".job-loading").hide();
    });
    $("#job-dialog").dialog("open");
}