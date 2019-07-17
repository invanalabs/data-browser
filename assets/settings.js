function populate_settings_data() {
    var data = localStorage.getItem('invana_search_settings');
    data = JSON.parse(data);
    document.getElementById("search_url_base").value = data.search_url_base || null;
    document.getElementById("search_fields").value = data.search_fields || null;
    document.getElementById("show_fields").value = data.show_fields || null;
    document.getElementById("result_size").value = data.result_size || 10;

}

function update_settings() {
    var data = {
        "search_url_base": document.getElementById("search_url_base").value,
        "search_fields": document.getElementById("search_fields").value,
        "show_fields": document.getElementById("show_fields").value,
        "result_size": document.getElementById("result_size").value,
    };
    localStorage.setItem('invana_search_settings', JSON.stringify(data));
}


$(document).ready(function () {
    populate_settings_data();
    $("#search-settings-form").submit(function (e) {
        e.preventDefault();
        update_settings();
    });
});