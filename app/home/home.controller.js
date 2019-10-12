var viewContainer;

// angular
//     .module('app')
//     .controller('HomeController', HomeController);

angular
    .module('app')
    .controller('HomeController', function($scope, UserService, $rootScope, $mdDialog) {
        console.log("HomeController invoked");
        var today = new Date();
        $scope.startDate = today;
        $scope.endDate = moment().add(1, 'y').toDate();

        $scope.user = null;
        $scope.allUsers = [];
        $scope.deleteUser = deleteUser;

        $scope.milestones = [];
        $scope.checkIns = [];

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function(user) {
                    $scope.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function(users) {
                    $scope.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function() {
                    loadAllUsers();
                });
        }

        $scope.customFullscreen = false;

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialog/dialog1.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.showPrompt = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('What would you name your dog?')
                .textContent('Bowser is a common name.')
                .placeholder('Dog name')
                .ariaLabel('Dog name')
                .initialValue('Buddy')
                .targetEvent(ev)
                .required(true)
                .ok('Okay!')
                .cancel('I\'m a cat person');

            $mdDialog.show(confirm).then(function(result) {
                $scope.status = 'You decided to name your dog ' + result + '.';
            }, function() {
                $scope.status = 'You didn\'t name your dog.';
            });
        };

        $scope.addMilestone = function(newMilestone) {
            $scope.milestones.push(newMilestone);
            console.log("$scope.milestones: ", $scope.milestones);
        };

        $scope.addCheckIns = function(newCheckIns) {
            $scope.checkIns.push(newCheckIns);
            console.log("$scope.checkIns: ", $scope.checkIns);
        };

        $('#startDateDatepicker').datepicker({
            autoclose: true,
            todayBtn: "linked",
            todayHighlight: true
        });

        $('#startDateDatepicker').datepicker('setDate', $scope.startDate);

        $('#endDateDatepicker').datepicker({
            autoclose: true,
            todayBtn: "linked",
            todayHighlight: true
        });

        $('#endDateDatepicker').datepicker('setDate', $scope.endDate);

        $scope.addGoal = function() {
            console.log("goalName: ", $scope.goalName);
            console.log("goalDescription: ", $scope.goalDescription);
            console.log("startDate: ", $scope.startDate);
            console.log("endDate: ", $scope.endDate);
            console.log("goalChecked: ", $scope.goalChecked);
            // Check: Add it to data.js
            var goalObj = {};
            let startEvent = {};
            startEvent.date = $scope.startDate;
            startEvent.details = {};
            startEvent.details.event = "Goal Start";
            startEvent.details.object = "Test";

            let endEvent = {};
            endEvent.date = $scope.endDate;
            endEvent.details = {};
            endEvent.details.event = "Goal Due Time";
            endEvent.details.object = "Test";

            goalObj.name = $scope.goalName;
            goalObj.data = [];
            goalObj.data.push(startEvent);
            goalObj.data.push(endEvent);
            goalObj.milestones = $scope.milestones;
            goalObj.checkIns = $scope.checkIns;
            goalObj.startDate = $scope.startDate;
            goalObj.endDate = $scope.endDate;
            goalObj.goalChecked = $scope.goalChecked;
            json.push(goalObj);
            console.log("json collection: ", json);
            updateTimeline(json);
        };

        initTimeline(json);

        // drawHeatmap();
    });

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