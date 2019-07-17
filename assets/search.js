function show_single_data(data) {
    console.log("data", data);
    $("#HitDetail").html("<pre>" + JSON.stringify(data, null, 2) + "</pre>")

};

function render_result_item(hit, settings_config) {

    var actually_data = hit._source;
    var show_fields = settings_config.show_fields.split(",");
    console.log("show_fields", show_fields);
    var show_fields_data = {};
    show_fields.forEach(function (field) {
        var field_splitted = field.split(".");
        if (field_splitted.length === 1) {
            show_fields_data[field] = actually_data[field];

        } else if (field_splitted.length === 2) {
            show_fields_data[field] = actually_data[field_splitted[0]][field_splitted[1]];

        }
    });
    show_fields_data["id"] = hit._id;
    console.log("show_fields_data", show_fields_data);
    return "<div class='result-item'>" +
        "<h3><a>" + show_fields_data[show_fields[0]] + "</a></h3>" +
        "<p>" + show_fields_data[show_fields[1]] + "</p>" +
        "</div>";

}

function render_shards_stats(shards_stats) {
    $("#shardsStats").html("<ul class='list-unstyled'>" +
        "<li >Total Shards : "+shards_stats.total+"</li>" +
        "<li>Successful Shards : "+shards_stats.successful+"</li>" +
        "<li>Skipped Shards : "+shards_stats.skipped+"</li>" +
        "<li>Failed Shards : "+shards_stats.failed+"</li>" +
        "</ul>");

}

function render_result(result, keyword, search_url, settings_config) {


    var data = {
        hits: result.hits.hits,
        total: result.hits.total,
        time_taken: result.took / 1000 + " seconds",
        shards: result._shards
    };
    console.log(data);
    document.getElementById("resultStats").innerText = "About " + data.total + " results(" + data.time_taken + ")";


    var result_html = [];
    data.hits.forEach(function (hit) {
        var el = $(render_result_item(hit, settings_config));
        el.click(function () {
            show_single_data(hit);
        });
        result_html.push(el);
    })

    console.log("result_html", result_html);
    // document.getElementById("").html = result_html;
    $("#resultHits").html(result_html)
    render_shards_stats(data.shards);
};

function search(keyword) {
    var settings_config = localStorage.getItem('invana_search_settings');
    settings_config = JSON.parse(settings_config);
    console.log(settings_config, typeof settings_config);
    console.log(settings_config.search_url_base);
    console.log(settings_config['search_url_base']);

    var search_suffixes = "";
    if (keyword) {
        search_suffixes = "&q=" + settings_config.search_fields + ":" + keyword;
    }
    var search_url = settings_config.search_url_base + search_suffixes + "&size=" + settings_config.result_size;
    console.log("search_url", search_url);

    $.ajax({
        url: search_url,
        type: 'GET',
        dataType: 'json', // added data type
        success: function (result) {
            console.log(result);
            render_result(result, keyword, search_url, settings_config)
        }
    });
}


$(document).ready(function () {


    $("#search-form").submit(function (e) {
        e.preventDefault();
        search(document.getElementById("search-keyword").value);
    });


    // $("search-keyword").change(function () {
    //     alert("The text has been changed.");
    // });


    search()


});