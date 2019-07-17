function render_pagination(page, totalPages) {

    var $pagination = $("#pagination");
    $pagination.html("");

    if (totalPages > 1) {

        var SHOW_MAX_PAGES = 5;
        var $pagination_elems = $('<ul class="pagination"></ul>');


        var minPage = 1;
        var maxPage = 8;

        if (totalPages >= SHOW_MAX_PAGES) {
            // calc what page numbers to show.
            var x = totalPages - page;

            if (x >= SHOW_MAX_PAGES) {
                minPage = page;
                maxPage = page + SHOW_MAX_PAGES;
            } else {
                pages_to_right_count = totalPages - page;
                pages_to_left_count = SHOW_MAX_PAGES - pages_to_right_count;
                minPage = page - pages_to_left_count;
                maxPage = page + pages_to_right_count;
            }
        } else {
            // show all the pages
            var pages_to_right_count = totalPages - page;
            var pages_to_left_count = SHOW_MAX_PAGES - pages_to_right_count;
            minPage = page - pages_to_left_count;
            maxPage = page + pages_to_right_count;
        }
        if (minPage <= 0) {
            minPage = 1;
        }

        if (page > 0) {
            if ((page - 1) >= 1 && totalPages >= SHOW_MAX_PAGES) {
                $pagination_elems.append('<li class="page-item next "><a href="#" data-page="1" class="page-link"><span class=" fa fa-angle-double-left"></span></a></li>');
                $pagination_elems.append('<li class="page-item next"><a href="#" data-page="' + (page - 1) + '" class="page-link"><span class="fa fa-angle-left"></span></a></li>');
            }
            for (i = minPage; i <= maxPage; i++) {
                if (i === page) {
                    active = "active"
                } else {
                    active = "";
                }
                $pagination_elems.append('<li class="page-item ' + active + '"><a href="#" data-page="' + i + '" class="page-link">' + i + '</a></li>');
            }
            if (maxPage !== totalPages && totalPages >= SHOW_MAX_PAGES) {
                $pagination_elems.append('<li class="page-item next"><a href="#" data-page="' + (page + 1) + '" class="page-link"><span class=" fa fa-angle-right "></span></a></li>');
                $pagination_elems.append('<li class="page-item next "><a href="#" data-page="' + totalPages + '" class="page-link"><span class=" fa fa-angle-double-right"></span></a></li>');
            }
        }
        $pagination.append($pagination_elems);
        $('.page-link').click(function () {
            var page_num = $(this).attr('data-page');
            console.log("pagination button clicked", page_num);
            search(document.getElementById("search-keyword").value, parseInt(page_num));
        });
    }
}

function get_settings_config() {
    var settings_config = localStorage.getItem('invana_search_settings');
    return JSON.parse(settings_config);
}

function show_single_data(data) {
    $("#HitDetail").html("<pre>" + JSON.stringify(data, null, 2) + "</pre>")

};

function render_result_item(hit, settings_config) {
    // show_fields


    function get_data(field) {
        try {
            var field_splitted = field.split(".");
            if (field_splitted.length === 1) {
                return actually_data[field];
            } else if (field_splitted.length === 2) {
                return actually_data[field_splitted[0]][field_splitted[1]];

            }
        } catch (e) {
            return null;
        }
    }

    var actually_data = hit._source;
    var result_card_data = {};
    result_card_data[settings_config.heading_field] = get_data(settings_config.heading_field);
    result_card_data[settings_config.subheading_field] = get_data(settings_config.subheading_field);
    result_card_data[settings_config.summary_field] = get_data(settings_config.summary_field);
    result_card_data["id"] = hit._id;
    var result_card_html = "<div class='result-item'>" +
        "<h3 class='mb-1'><a>" + result_card_data[settings_config.heading_field] + "</a></h3>";

    if (result_card_data[settings_config.subheading_field]) {
        result_card_html += "<h4 class='mb-1'>" + result_card_data[settings_config.subheading_field] + "</h4>";

    }
    if (result_card_data[settings_config.summary_field]) {
        result_card_html += "<p class='mb-0'>" + result_card_data[settings_config.summary_field] + "</p>";

    }
    result_card_html += "<p class='text-muted small'> score: " + hit._score + "; doc type:" + hit._type + ";  index: " + hit._index + "</p>" +
        // "<p class='text-muted small'> record id: "+ hit._id+"</p>" +
        "</div>";
    return result_card_html;

}

function render_shards_stats(shards_stats) {
    $("#shardsStats").html("<ul class='list-unstyled'>" +
        "<li >Total Shards : " + shards_stats.total + "</li>" +
        "<li>Successful Shards : " + shards_stats.successful + "</li>" +
        "<li>Skipped Shards : " + shards_stats.skipped + "</li>" +
        "<li>Failed Shards : " + shards_stats.failed + "</li>" +
        "</ul>");

}

function render_result(result, keyword, search_url, settings_config, page_num) {


    var data = {
        hits: result.hits.hits,
        total: result.hits.total,
        time_taken: result.took / 1000 + " seconds",
        shards: result._shards
    };

    if (page_num === 1) {
        document.getElementById("resultStats").innerText = "About " + data.total + " results(" + data.time_taken + ")";
    } else {
        document.getElementById("resultStats").innerText = "Page " + page_num + " of about " + data.total + " results(" + data.time_taken + ")";
    }


    var result_html = [];
    data.hits.forEach(function (hit) {
        var el = $(render_result_item(hit, settings_config));
        el.click(function () {
            show_single_data(hit);
        });
        result_html.push(el);
    });

    $("#resultHits").html(result_html)
    var totalPages = Math.ceil(result.hits.total / settings_config.result_size);
    render_pagination(page_num, totalPages);
    render_shards_stats(data.shards);
};

function search(keyword, page_num) {
    var settings_config = get_settings_config();

    var search_suffixes = "";
    if (keyword) {
        search_suffixes = "&q=" + settings_config.search_fields + ":" + keyword;
    }
    var search_url = settings_config.search_url_base + "?" + settings_config.default_filters + "&"
        + search_suffixes + "&size=" +
        settings_config.result_size + "&from=" + (page_num - 1) * settings_config.result_size;
    console.log("search_url", search_url);

    $.ajax({
        url: search_url,
        type: 'GET',
        dataType: 'json', // added data type
        success: function (result) {
            console.log(result);
            render_result(result, keyword, search_url, settings_config, page_num)
        }
    });
}


function perform_search(query) {
    document.getElementById("search-keyword").value = query
    search(query, 1);
}

$(document).ready(function () {

    var settings_config = get_settings_config();

    if (settings_config) {
        $("#resultVersionPage").show();
        $("#noSettingsVersionPage").hide();


        var url = new URL(location.href);
        perform_search(url.searchParams.get("q"), 1);
        $("#search-form").submit(function (e) {
            // e.preventDefault();
            // search(document.getElementById("search-keyword").value, 1);
        });


    } else {
        $("#noSettingsVersionPage").show();
        $("#resultVersionPage").hide();

    }


    // $("search-keyword").change(function () {
    //     alert("The text has been changed.");
    // });


});