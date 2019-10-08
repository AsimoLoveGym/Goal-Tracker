var viewContainer;

angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['UserService', '$rootScope'];

function HomeController(UserService, $rootScope) {
    console.log("HomeController invoked");

    var vm = this;
    vm.user = null;
    vm.allUsers = [];
    vm.deleteUser = deleteUser;

    initController();

    function initController() {
        loadCurrentUser();
        loadAllUsers();
    }

    function loadCurrentUser() {
        UserService.GetByUsername($rootScope.globals.currentUser.username)
            .then(function(user) {
                vm.user = user;
            });
    }

    function loadAllUsers() {
        UserService.GetAll()
            .then(function(users) {
                vm.allUsers = users;
            });
    }

    function deleteUser(id) {
        UserService.Delete(id)
            .then(function() {
                loadAllUsers();
            });
    }


    // Progress bar

    var colors = { green: '#4DC87F', lightGreen: '#D9F0E3' };
    var width = 960,
        height = 120,
        offset = 48;

    width += offset * 2;
    height += offset * 2;
    var dimensions = '' + 0 + ' ' + 0 + ' ' + width + ' ' + height;

    viewContainer = d3.select('body').append('svg')
        .attr('id', 'scene', true)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', dimensions)
        .classed('svg-content', true);

    var steps = ['0', '1', '2', '3', '4', '5'];
    var stepWidth = (width - offset * 2) / (steps.length - 1),
        currentStep = '0';

    var progressBar = viewContainer.append('g')
        .attr('transform', 'translate(' + offset + ',' + offset + ')')
        .style('pointer-events', 'none');

    var progressBackground = progressBar.append('rect')
        .attr('fill', colors.lightGreen)
        .attr('height', 8)
        .attr('width', width - offset * 2)
        .attr('rx', 4)
        .attr('ry', 4);

    var progress = progressBar.append('rect')
        .attr('fill', colors.green)
        .attr('height', 8)
        .attr('width', 0)
        .attr('rx', 4)
        .attr('ry', 4);

    progress.transition()
        .duration(1000)
        .attr('width', function() {
            var index = steps.indexOf(currentStep);
            return (index + 1) * stepWidth;
        });

    progressBar.selectAll('circle')
        .data(steps)
        .enter()
        .append('circle')
        .attr('id', function(d, i) { return 'step_' + i; })
        .attr('cx', function(d, i) { return i * stepWidth; })
        .attr('cy', 4)
        .attr('r', 20)
        .attr('fill', '#FFFFFF')
        .attr('stroke', colors.lightGreen)
        .attr('stroke-width', 6)

    progressBar.selectAll('text')
        .data(steps)
        .enter()
        .append('text')
        .attr('id', function(d, i) { return 'label_' + i; })
        .attr('dx', function(d, i) { return i * stepWidth; })
        .attr('dy', 10)
        .attr('text-anchor', 'middle')
        .text(function(d, i) { return i + 1; })

    updateProgressBar("0");

    updateProgressBar("3");

    //self-running demo
    // setInterval(function() { updateProgressBar(Math.floor(Math.random() * (steps.length - 1)).toString()); }, 2500)

    function setupProgressBar(data_) {
        var output = [];
        for (var i = 0; i < data_.length; i++) { output.push(data_[i].id.toString()); }
        return output;
    }

    function updateProgressBar(step_) {
        progress.transition()
            .duration(1000)
            .attr('fill', colors.green)
            .attr('width', function() {
                var index = steps.indexOf(step_);
                return (index) * stepWidth;
            });
        for (var i = 0; i < steps.length; i++) {
            if (i <= steps.indexOf(step_)) {
                d3.select('#step_' + i).attr('fill', colors.green).attr('stroke', colors.green);
                d3.select('#label_' + i).attr('fill', '#FFFFFF');
            } else {
                d3.select('#step_' + i).attr('fill', '#FFFFFF').attr('stroke', colors.lightGreen);
                d3.select('#label_' + i).attr('fill', '#000000');
            }
        }
    }

    drawHeatmap();
}

// Build heatmap with plugin library calendar-heatmap
function drawHeatmap() {
    var now = moment().endOf('day').toDate();
    var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
    var chartData = d3.timeDays(yearAgo, now).map(function(dateElement) {
        return {
            date: dateElement,
            count: (dateElement.getDay() !== 0 && dateElement.getDay() !== 6) ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 10)
        };
    });

    var heatmap = calendarHeatmap()
        .data(chartData)
        .selector('.container')
        .tooltipEnabled(true)
        .colorRange(['#f4f7f7', '#79a8a9'])
        .onClick(function(data) {
            console.log('data', data);
        });
    heatmap(); // render the chart
}

// Build heatmap from scratch with d3.js
// function drawHeatmap() {
//     sample.sort((a, b) => new Date(a.Date) - new Date(b.Date));

//     const dateValues = sample.map(dv => ({
//         date: d3.timeDay(new Date(dv.Date)),
//         value: Number(dv.AnswerCount)
//     }));

//     const svg = d3.select("#svg");
//     const { width, height } = document
//         .getElementById("svg")
//         .getBoundingClientRect();


//     function draw() {
//         const years = d3
//             .nest()
//             .key(d => d.date.getUTCFullYear())
//             .entries(dateValues)
//             .reverse();

//         const values = dateValues.map(c => c.value);
//         const maxValue = d3.max(values);
//         const minValue = d3.min(values);

//         const cellSize = 15;
//         const yearHeight = cellSize * 7;

//         const group = svg.append("g");

//         const year = group
//             .selectAll("g")
//             .data(years)
//             .join("g")
//             .attr(
//                 "transform",
//                 (d, i) => `translate(50, ${yearHeight * i + cellSize * 1.5})`
//             );

//         year
//             .append("text")
//             .attr("x", -5)
//             .attr("y", -30)
//             .attr("text-anchor", "end")
//             .attr("font-size", 16)
//             .attr("font-weight", 550)
//             .attr("transform", "rotate(270)")
//             .text(d => d.key);

//         const formatDay = d => ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][d.getUTCDay()];
//         const countDay = d => d.getUTCDay();
//         const timeWeek = d3.utcSunday;
//         const formatDate = d3.utcFormat("%x");
//         const colorFn = d3
//             .scaleSequential(d3.interpolateBuGn)
//             .domain([Math.floor(minValue), Math.ceil(maxValue)]);
//         const format = d3.format("+.2%");

//         year
//             .append("g")
//             .attr("text-anchor", "end")
//             .selectAll("text")
//             .data(d3.range(7).map(i => new Date(1995, 0, i)))
//             .join("text")
//             .attr("x", -5)
//             .attr("y", d => (countDay(d) + 0.5) * cellSize)
//             .attr("dy", "0.31em")
//             .attr("font-size", 12)
//             .text(formatDay);

//         year
//             .append("g")
//             .selectAll("rect")
//             .data(d => d.values)
//             .join("rect")
//             .attr("width", cellSize - 1.5)
//             .attr("height", cellSize - 1.5)
//             .attr(
//                 "x",
//                 (d, i) => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 10
//             )
//             .attr("y", d => countDay(d.date) * cellSize + 0.5)
//             .attr("fill", d => colorFn(d.value))
//             .append("title")
//             .text(d => `${formatDate(d.date)}: ${d.value.toFixed(2)}`);

//         const legend = group
//             .append("g")
//             .attr(
//                 "transform",
//                 `translate(10, ${years.length * yearHeight + cellSize * 4})`
//             );

//         const categoriesCount = 10;
//         const categories = [...Array(categoriesCount)].map((_, i) => {
//             const upperBound = (maxValue / categoriesCount) * (i + 1);
//             const lowerBound = (maxValue / categoriesCount) * i;

//             return {
//                 upperBound,
//                 lowerBound,
//                 color: d3.interpolateBuGn(upperBound / maxValue),
//                 selected: true
//             };
//         });

//         const legendWidth = 60;

//         function toggle(legend) {
//             const { lowerBound, upperBound, selected } = legend;

//             legend.selected = !selected;

//             const highlightedDates = years.map(y => ({
//                 key: y.key,
//                 values: y.values.filter(
//                     v => v.value > lowerBound && v.value <= upperBound
//                 )
//             }));

//             year
//                 .data(highlightedDates)
//                 .selectAll("rect")
//                 .data(d => d.values, d => d.date)
//                 .transition()
//                 .duration(500)
//                 .attr("fill", d => (legend.selected ? colorFn(d.value) : "white"));
//         }

//         legend
//             .selectAll("rect")
//             .data(categories)
//             .enter()
//             .append("rect")
//             .attr("fill", d => d.color)
//             .attr("x", (d, i) => legendWidth * i)
//             .attr("width", legendWidth)
//             .attr("height", 15)
//             .on("click", toggle);

//         legend
//             .selectAll("text")
//             .data(categories)
//             .join("text")
//             .attr("transform", "rotate(90)")
//             .attr("y", (d, i) => -legendWidth * i)
//             .attr("dy", -30)
//             .attr("x", 18)
//             .attr("text-anchor", "start")
//             .attr("font-size", 11)
//             .text(d => `${d.lowerBound.toFixed(2)} - ${d.upperBound.toFixed(2)}`);

//         legend
//             .append("text")
//             .attr("dy", -5)
//             .attr("font-size", 14)
//             .attr("text-decoration", "underline")
//             .text("Click on category to select/deselect days");
//     }

//     draw();
// }