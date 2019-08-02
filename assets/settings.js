function get_url_param(param) {
    var u = new URL(location.href);
    return u.searchParams.get(param);
}


function populate_settings_data() {
    var data = localStorage.getItem('invana_search_settings');
    if (data) {
        data = JSON.parse(data);
        document.getElementById("search_url_base").value = data.search_url_base || null;
        document.getElementById("search_fields").value = data.search_fields || null;
        document.getElementById("heading_field").value = data.heading_field || null;
        document.getElementById("subheading_field").value = data.subheading_field || null;
        document.getElementById("summary_field").value = data.summary_field || null;
        document.getElementById("default_filters").value = data.default_filters || null;
        document.getElementById("result_size").value = data.result_size || 10;
    }
}

function setup_settings_data() {

    document.getElementById("search_url_base").value = get_url_param("search_url_base") || null;
    document.getElementById("search_fields").value = get_url_param("search_fields") || null;
    document.getElementById("heading_field").value = get_url_param("heading_field") || null;
    document.getElementById("subheading_field").value = get_url_param("subheading_field") || null;
    document.getElementById("summary_field").value = get_url_param("summary_field") || null;
    document.getElementById("default_filters").value = get_url_param("default_filters") || null;
    document.getElementById("result_size").value = get_url_param("result_size") || 10;

}


function update_settings() {
    var data = {
        "search_url_base": document.getElementById("search_url_base").value,
        "search_fields": document.getElementById("search_fields").value,
        "heading_field": document.getElementById("heading_field").value,
        "subheading_field": document.getElementById("subheading_field").value,
        "summary_field": document.getElementById("summary_field").value,
        "default_filters": document.getElementById("default_filters").value,
        "result_size": document.getElementById("result_size").value,
    };
    localStorage.setItem('invana_search_settings', JSON.stringify(data));
    location.href = "./index.html";
}

function get_settings() {

    if (get_url_param("search_url_base")) {
        setup_settings_data();
    } else {
        populate_settings_data();

    }


}

$(document).ready(function () {
    $('body').show();

    get_settings();
    $("#search-settings-form").submit(function (e) {
        e.preventDefault();
        update_settings();
    });
});