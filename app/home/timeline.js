// Comment sample
/**
 * Created by Joey Xia on 26th Sept 2018
 * Functions for user preference retrieve, update, and initiation in localstorage
 * Types of user preferences:
 * - Global level:
 *      firstRunForm
 *      showAssistant
 * - User level:
 *      table_settings_
 *          + "change", "assets", "rules", "object_groups", "support", "risks"
 *          + "paths", "paths_in_rules_table"
 * - Workspace Level:
 *      global_pinned
 *      workspaceLoginTimestamp
 *      NERCReportHistorySettings
 *      topology_theme
 */

/**
 * Util function for modal page - Rule table
 * Load rule table with parsed rulest content
 * @param {Array} rulesData. [Required]
 * @param {String} version. [Required]
 *  timestamp of ruleset constructed, eg. '20190517_185445'
 * @param {String} searchText. [Optional]
 *  If provided, open modal with table content been filtered with searchtext
 * @return {Undefined}.
 */

var element = {};
var timeline = {};

const ONE_HOUR = 60 * 60 * 1000,
    ONE_DAY = 24 * ONE_HOUR,
    ONE_WEEK = 7 * ONE_DAY,
    ONE_MONTH = 30 * ONE_DAY,
    SIX_MONTHS = 6 * ONE_MONTH;

// parseJSON and prepare selectpicker
function parseJSON(json) {
    // Reset selectpicker first
    $('#timeline-selectpicker').html('');
    var data = [];
    // Parse dataset from json
    for (var x in json) {
        data[x] = {};
        data[x].name = json[x].name;
        data[x].data = [];
        for (var y in json[x].data) {
            data[x].data.push({});
            data[x].data[y].date = new Date(json[x].data[y].date);
            data[x].data[y].details = json[x].data[y].details;
        }
        // ToImprove: Use ng-repeat instead
        $('#timeline-selectpicker').append("<option>" + data[x].name + "</option>");
        data[x].display = true;
    }
    $('#timeline-selectpicker').selectpicker('selectAll');
    return data;
}

function initTimeline(json) {
    $(document).ready(function() {
        popoverTimeline();
    });

    $(document).on('click', '.drop', function() { $(this).popover('show'); });

    $(document).on('click', '.grid', function() { $('[data-toggle="popover"]').popover('hide'); });

    // Todo: should have a function to filter the start and end date
    // min date
    // start = new Date(''),
    // max date
    // end = new Date(''),
    var data = [],
        start = new Date('2016-04-02T20:14:22.691Z'),
        endDate = new Date('2022-06-01T20:14:22.691Z'),
        today = new Date();

    data = parseJSON(json);

    timeline = d3.chart.timeline()
        .end(endDate)
        .start(start)
        .minScale(ONE_WEEK / ONE_MONTH)
        .maxScale(ONE_WEEK / ONE_DAY)
        .eventClick(function(el) {
            // Show detail of events
            var table = '<table class="table table-striped table-bordered">';
            if (el.hasOwnProperty("events")) {
                table = table + '<thead>This is a group of ' + el.events.length + ' events starting on ' + el.date + '</thead><tbody>';
                table = table + '<tr><th>Date</th><th>Event</th><th>Object</th></tr>';
                for (var i = 0; i < el.events.length; i++) {
                    table = table + '<tr><td>' + el.events[i].date + ' </td> ';
                    for (var j in el.events[i].details) {
                        table = table + '<td> ' + el.events[i].details[j] + ' </td> ';
                    }
                    table = table + '</tr>';
                }
                table = table + '</tbody>';
            } else {
                table = table + 'Date: ' + el.date + '<br>';
                for (i in el.details) {
                    table = table + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + el.details[i] + '<br>';
                }
            }
            $('#legend').html(table);

        });
    if (countNames(data) <= 0) {
        timeline.labelWidth(60);
    }

    element = d3.select('#pf-timeline').append('div').datum(data.filter(function(eventGroup) {
        return eventGroup.display === true;
    }));
    timeline(element);

    $('#timeline-selectpicker').on('changed.bs.select', function(event, clickedIndex, newValue, oldValue) {
        data[clickedIndex].display = !data[clickedIndex].display;
        element.datum(data.filter(function(eventGroup) {
            return eventGroup.display === true;
        }));
        resetTimeline();
    });

    $(window).on('resize', function() {
        resetTimeline();
    });

    $('#datepicker').datepicker({
        autoclose: true,
        todayBtn: "linked",
        todayHighlight: true
    });

    $('#datepicker').datepicker('setDate', today);

    $('#datepicker').on('changeDate', zoomFilter);

    $(document.body).on('click', '.dropdown-menu li', function(event) {
        var $target = $(event.currentTarget);
        $target.closest('.dropdown')
            .find('[data-bind="label"]').text($target.text())
            .end()
            .children('.dropdown-toggle').dropdown('toggle');

        zoomFilter();

        return false;
    });

    function countNames(data) {
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].name !== undefined && data[i].name !== '') {
                count++;
            }
        }
        return count;
    }

    function zoomFilter() {
        var range = $('#range-dropdown').find('[data-bind="label"]').text(),
            position = $('#position-dropdown').find('[data-bind="label"]').text(),
            date = $('#datepicker').datepicker('getDate'),
            startDate,
            endDate;

        switch (range) {
            case '1 hour':
                range = ONE_HOUR;
                break;

            case '1 day':
                range = ONE_DAY;
                break;

            case '1 week':
                range = ONE_WEEK;
                break;

            case '1 month':
                range = ONE_MONTH;
                break;
        }
        switch (position) {
            case 'centered on':
                startDate = new Date(date.getTime() - range / 2);
                endDate = new Date(date.getTime() + range / 2);
                break;

            case 'starting':
                startDate = date;
                endDate = new Date(date.getTime() + range);
                break;

            case 'ending':
                startDate = new Date(date.getTime() - range);
                endDate = date;
                break;
        }
        timeline.Zoom.zoomFilter(startDate, endDate);
    }

    $('#reset-button').click(function() {
        resetTimeline();
    });
}

function popoverTimeline() {
    $('[data-toggle="popover"]').popover({
        'container': '#pf-timeline',
        'placement': 'top'
    });
}

function resetTimeline() {
    timeline(element);
    popoverTimeline();
}

function updateTimeline(json) {
    var data = parseJSON(json);
    element.datum(data.filter(function(eventGroup) {
        return eventGroup.display === true;
    }));
    resetTimeline();
}