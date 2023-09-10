app.directive('adjutant', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/adjutant.html',
        scope: {
            adjutant: "=adjutant",
            sysdata: "=sysdata"
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed

            $scope.expandAdjutantDisplay = function(){
                $scope.expanded = !$scope.expanded;
            };
        }
    };
 });