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
        "<h3>" + show_fields_data[show_fields[0]] + "</h3>" +
        "<p>" + show_fields_data[show_fields[1]] + "</p>" +
        "</div>";

}

function render_result(result, keyword, search_url, settings_config) {


    var data = {
        hits: result.hits.hits,
        total: result.hits.total,
        time_taken: result.took / 1000 + " seconds"
    };
    console.log(data);
    document.getElementById("resultStats").innerText = "About " + data.total + " results(" + data.time_taken + ")";


    var result_html = "";
    data.hits.forEach(function (hit) {
        result_html += render_result_item(hit, settings_config);
    })

    console.log("result_html", result_html);
    document.getElementById("resultHits").innerHTML = result_html;

};

function search(keyword) {
    var settings_config = localStorage.getItem('invana_search_settings');
    settings_config = JSON.parse(settings_config);
    console.log(settings_config, typeof settings_config);
    console.log(settings_config.search_url_base);
    console.log(settings_config['search_url_base']);

    var search_suffixes = "";
    if (keyword) {
        search_suffixes = "&" + settings_config.search_fields + ":" + keyword;
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