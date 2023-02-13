app.directive('emblem', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/emblem.html',
        scope: {
            emblem: "=emblem",
            sysdata: "=sysdata",
            skillsysdata: "=skillsysdata",
            itemsysdata: "=itemsysdata",
            tagsysdata: "=tagsysdata",
            engravingsysdata: "=engravingsysdata"
        },
        link: function($scope, element, attrs) {
            $scope.expanded = false; //start collapsed
        }
    };
 });