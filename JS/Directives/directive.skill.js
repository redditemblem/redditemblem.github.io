app.directive('skill', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/skill.html',
        scope: {
            skill: "=skill",
            sysdata: "=sysdata",
            active: "=active",
            expanded: "=expanded"
        }
    };
 });