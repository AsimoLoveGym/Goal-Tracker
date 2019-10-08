(function() {
    'use strict';

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

        var svg = d3.select('body').append('svg')
            .attr('id', 'scene', true)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', dimensions)
            .classed('svg-content', true);

        var steps = ['0', '1', '2', '3', '4', '5'];
        var stepWidth = (width - offset * 2) / (steps.length - 1),
            currentStep = '0';

        var progressBar = svg.append('g')
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




    }



})();
