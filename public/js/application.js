window.app = angular.module("nodejs", ['ngRoute']);

window.app.controller('listArticleCtrl', function ($scope, $http) {
	$scope.articles = [];
	$http.get('/article').then(function (response) {
		$scope.articles = response.data;
	})
});

window.app.controller('editArticleCtrl', function ($scope, $http) {
	$scope.article = [];
	let url  = location.pathname;
		rurl = url.split('/');
		console.log(rurl);
		rurl = rurl[rurl.length -1];
          
	$http.get('/article/'+rurl).then(function (response) {
		console.log(response);
		$scope.article = response.data;
	})
	
});

window.app.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

window.app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.when("/", {
		templateUrl: '/'
	}).when("/login", {
		templateUrl: '/login'
	}).when("/profil", {
		templateUrl: '/profil'
	}).when("/register", {
		templateUrl: '/register'
	}).when("/admin-article", {
		templateUrl: '/admin-article'
	}).when("/new-article", {
		templateUrl: '/new-article'
	}).when("/edit-article/:id", {
		templateUrl: '/edit-article'
	}).when("/logout", {
		templateUrl: '/login'
	}).otherwise({
		templateUrl: "/404"
	});
});

$(document).on('submit', 'form', function (e) {
	e.preventDefault();
	let data = {};

	for (let entry of new FormData(e.target).entries()) {
		data[entry[0]] = entry[1];
	}

	$.ajax({
		url: $(this).attr('action') || location.href,
		method: $(this).attr('method') || 'POST',
		data: data
	}).always(function (response, status, xhr, err) {
		response = JSONfnParse(response);
		if (response && response.success) {
			response.success(response);
		}
		if (response && response.error) {
			response.error(response);
		}
	});
});

function JSONfnParse(str, date2obj) {
	var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;
	return JSON.parse(str, function (key, value) {
		var prefix;

		if (typeof value != 'string') {
			return value;
		}
		if (value.length < 8) {
			return value;
		}

		prefix = value.substring(0, 8);

		if (iso8061 && value.match(iso8061)) {
			return new Date(value);
		}
		if (prefix === 'function') {
			return eval('(' + value + ')');
		}
		if (prefix === '_PxEgEr_') {
			return eval(value.slice(8));
		}
		if (prefix === '_NuFrRa_') {
			return eval(value.slice(8));
		}

		return value;
	});
}