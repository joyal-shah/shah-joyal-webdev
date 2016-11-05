(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController",WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController);

    function WidgetListController($sce, $routeParams, $location, WidgetService){
        var vm = this;

        vm.getSafeHtml = getSafeHtml;
        vm.checkSafeURL = checkSafeURL;
        vm.editRedirect = editRedirect;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];

            WidgetService.findWidgetsByPageId(vm.pageId)
                .success(function (widgetsFound) {
                    vm.widgets = widgetsFound;
                })
                .error(function (err) {
                    vm.error = "Error while fetching widgets!! Please try after sometime";
                });
        }
        init();

        function getSafeHtml(text) {
            return $sce.trustAsHtml(text);
        }

        function editRedirect(wdg){
            if(wdg.widgetType != "HTML") {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + wdg._id);
            }
        }

        function checkSafeURL(widgetURL) {
            var parts = widgetURL.split('/');
            var id = parts[parts.length - 1];
            url = "https://www.youtube.com/embed/"+id;

            return $sce.trustAsResourceUrl(url);
        }
    }

    function NewWidgetController($location ,$routeParams, WidgetService){
        var vm = this;

        vm.createNewWidget = createNewWidget;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            //vm.currentWidgetId = $routeParams['wgid'];
            //vm.currentWidget = WidgetService.findWidgetById(vm.currentWidgetId);
            /*
            WidgetService.findWidgetById(vm.currentWidgetId)
                .success(function(curWidget){
                    vm.currentWidget = curWidget;
                })
                .error(function(err){
                    vm.error = "Error while fetching current widget!! Please try after sometime";
                });*/
            vm.newWidgetHeader = {_id: "", widgetType: "HEADER", pageId: vm.pageId, size: 2, text: "New Header Text"};
            vm.newWidgetImage = {_id: "", widgetType: "IMAGE", pageId: vm.pageId, width: "100%", url: "http://lorempixel.com/400/200/"};
            vm.newWidgetYouTube = {_id: "", widgetType: "YOUTUBE", pageId: vm.pageId, width: "100%", url: "https://youtu.be/AM2Ivdi9c4E"};
        }
        init();

        function createNewWidget(newWidget){
            WidgetService.createWidget(vm.pageId, newWidget)
                .success(function(widgetCreated){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widgetCreated._id);
                })
                .error(function (err) {
                    vm.error = "Failed to create new widget";
                });

            /*
            var widgetCreated = WidgetService.createWidget(vm.pageId, newWidget);

            if (widgetCreated._id != 0) {
                // Redirecting to widget edit page
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget/" + widgetCreated._id);
            }
            else {
                vm.error = "Failed to create new widget";
            }*/

        }
    }

    function EditWidgetController($routeParams, $location, WidgetService){
        var vm = this;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init(){
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.currentWidgetId = $routeParams['wgid'];
            //vm.currentWidget = WidgetService.findWidgetById(vm.currentWidgetId);
            WidgetService.findWidgetById(vm.currentWidgetId)
                .success(function(curWidget){
                    vm.currentWidget = curWidget;
                })
                .error(function(err){
                    vm.error = "Error while fetching current widget!! Please try after sometime";
                });
        }
        init();

        function updateWidget(){
            WidgetService.updateWidget(vm.currentWidgetId, vm.currentWidget)
                .then(function(response){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                },function(err){
                    vm.error = "Failed to update widget";
                });

            /*var updateSuccessful = WidgetService.updateWidget(vm.currentWidgetId, vm.currentWidget);
            if (updateSuccessful) {
                // Redirect to widget list page
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            }
            else {
                vm.error = "Failed to update widget";
            }*/
        }

        function deleteWidget(){
            WidgetService.deleteWidget(vm.currentWidgetId)
                .success(function(res){
                    $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
                })
                .error(function(err){
                    vm.error = "Failed to delete widget";
                });
            /*var deleteSuccessful = WidgetService.deleteWidget(vm.currentWidgetId);
            if(deleteSuccessful){
                // Redirect to widget list page
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            }
            else{
                vm.error = "Failed to delete widget";
            }*/
        }
    }
})();
