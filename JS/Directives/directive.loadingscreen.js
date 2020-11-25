app.directive('loadingscreen', function() {
    return{
        restrict: 'E', //element
        templateUrl: 'HTML/Directives/loadingscreen.html',
        scope: {
            error: "=error"
        },
        link: function($scope, element, attrs) {
            $scope.formatStackTrace = function(){
                var stacktrace = "";

                if($scope.error.innerException != null && $scope.error.innerException.stackTrace != null)
                    stacktrace = $scope.error.innerException.stackTrace;
                else if($scope.error.InnerException != null && $scope.error.InnerException.StackTraceString != null)
                    stacktrace = $scope.error.InnerException.StackTraceString;
                else if($scope.error.stackTrace != null)
                    stacktrace = $scope.error.stackTrace;
                else if($scope.error.StackTraceString  != null)
                    stacktrace = $scope.error.StackTraceString;

                return stacktrace.replace("\tat", "\nat").trim();
            };
        }
    };
 });