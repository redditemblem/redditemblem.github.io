app.directive('skill', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/skill.html',
        scope: {
            skill: "=skill",
            sysdata: "=sysdata",
            expanded: "=expanded"
        }
    };
 });