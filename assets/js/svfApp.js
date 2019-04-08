var svfApp = angular.module('svfApp', []);

svfApp.factory('SvfApi', function ($http) {
    return {
        request: function (method, service, data) {
            return $http({ 
                method: method.toUpperCase(), 
                url: 'https://akundportal.svenskafonster.se/api/' + service, 
                data: data 
            }).then(function (response) {
                return response.data;
            }, function (error) {
                console.log(error);
            });
        }
    }
});

svfApp.controller('svfAppController', function ($scope, SvfApi) {
    const PAGE_SIZE = 20;
    
    var currentPage = PAGE_SIZE;
    var allResellers = [];
    var tmpResellers = [];

    this.$onInit = function () {
        searchResellerAndRender('');
    };
    
    $scope.searchResellerByKeyword = function () {
        var keyword = $scope.searchKeyword;
        
        if (keyword.length >= 2) {
            searchResellerAndRender(keyword);
        } 

        if (keyword.length == 0) {
            searchResellerAndRender(keyword);  
        }              
    };
    
    $scope.showResellerDetailsByAccountId = function (accountId) {
        SvfApi.request(
            'get', 
            'windowselector/getCustomerBySvfAccount?svfAccount=' + accountId + '&brand',
            {}
        ).then (function (response) {
            $scope.resellerDetails = response;
        });
    };

    $scope.resellerPageNavigate = function (pageSize) {
        var tmpPage = currentPage + pageSize;
        currentPage = tmpPage;
        
        if (tmpPage == PAGE_SIZE) {
            tmpPage = 0;            
        }
        
        tmpResellers = JSON.parse(JSON.stringify(allResellers)); // Deep copy (not by reference)
        $scope.resellers = tmpResellers.splice(tmpPage, PAGE_SIZE);
    };
    
    function searchResellerAndRender(filterName) {
        SvfApi.request(
            'post', 
            'snicApp/GetResellers', 
            { 'filterName' : filterName }
        ).then (function (response) {
            allResellers = JSON.parse(response.data);            
            tmpResellers = JSON.parse(response.data); // Avoid copy by reference.
            $scope.resellers = tmpResellers.splice(0, PAGE_SIZE);
        });   
    }
});
