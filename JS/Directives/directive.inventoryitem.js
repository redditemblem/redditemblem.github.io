app.directive('inventoryitem', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/inventoryitem.html',
        scope: {
            item: "=item",
            sysdata: "=sysdata",
            tagsysdata: "=tagsysdata"
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed
        }
    };
 });