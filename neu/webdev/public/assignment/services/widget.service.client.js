(function(){
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http){

        var api = {
            createWidget: createWidget,
            findWidgetsByPageId: findWidgetsByPageId,
            findWidgetById: findWidgetById,
            updateWidget: updateWidget,
            deleteWidget: deleteWidget
        };
        return api;

        function getNewWidgetId(){
            var date = new Date();

            var components = [
                date.getYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            ];

            var id = components.join("");

            return id;
        }

        function createWidget(pageId, widget){
            var url = "/api/page/"+pageId+"/widget";
            var newWidget = widget;
            newWidget._id = getNewWidgetId();
            newWidget.pageId = pageId;
            return $http.post(url, newWidget);
        }

        function findWidgetsByPageId(pageId){
            var url = "/api/page/"+pageId+"/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId){
            var url = "/api/widget/"+widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget){
            debugger;
            var url = "/api/widget/"+widgetId;
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId){
            var url = "/api/widget/"+widgetId;
            return $http.delete(url);
        }
    }
})();