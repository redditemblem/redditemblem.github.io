app.directive('battalion', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/battalion.html',
        scope: {
            battalion: "=battalion",
            battalionsysdata: "=battalionsysdata",
            gambitsysdata: "=gambitsysdata",
            battalionlabel: "=battalionlabel",
            gambitlabel: "=gambitlabel"
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed
        }
    };
 });