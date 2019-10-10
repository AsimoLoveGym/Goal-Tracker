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

    // drawTimeline();

    // drawHeatmap();
}

// function drawTimeline() {
//     var timelineChart = d3.chart.timeline();
//     d3.select('#chart_placeholder')
//         .datum(data)
//         .call(timelineChart);
// }

// Build heatmap with plugin library calendar-heatmap
// function drawHeatmap() {
//     var now = moment().endOf('day').toDate();
//     var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
//     var chartData = d3.timeDays(yearAgo, now).map(function(dateElement) {
//         return {
//             date: dateElement,
//             count: (dateElement.getDay() !== 0 && dateElement.getDay() !== 6) ? Math.floor(Math.random() * 60) : Math.floor(Math.random() * 10)
//         };
//     });

//     var heatmap = calendarHeatmap()
//         .data(chartData)
//         .selector('.container')
//         .tooltipEnabled(true)
//         .colorRange(['#f4f7f7', '#79a8a9'])
//         .onClick(function(data) {
//             console.log('data', data);
//         });
//     heatmap(); // render the chart
// }