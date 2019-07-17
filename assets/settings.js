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
}


$(document).ready(function () {
    $('body').show();

    populate_settings_data();
    $("#search-settings-form").submit(function (e) {
        e.preventDefault();
        update_settings();
    });
});