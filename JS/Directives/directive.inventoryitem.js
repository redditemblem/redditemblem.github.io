app.directive('inventoryitem', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/inventoryitem.html',
        scope: {
            item: "=item",
            sysdata: "=sysdata",
            tagsysdata: "=tagsysdata",
            engravingsysdata: "=engravingsysdata",
            expanded: "=?expanded"
        },
        link: function($scope, element, attrs) {
            $scope.lockExpansion = false;

            //If we pass an expansion value in, lock to that value.
            if($scope.expanded == undefined) $scope.expanded = false; //start collapsed
            else $scope.lockExpansion = true;

            $scope.expandItemDisplay = function(){
                if(!$scope.lockExpansion)
                    $scope.expanded = !$scope.expanded;
            };
        }
    };
 });