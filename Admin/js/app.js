angular.module('kidushteam1', ['backand', 'ngCookies'])

	.config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    	    BackandProvider.setAppName('kidushteam1'); // change here to your app name
    	    BackandProvider.setSignUpToken('71694afb-65fc-48f3-b0f5-263ce3737d1c'); //token that enable sign up. see http://docs.backand.com/en/latest/apidocs/security/index.html#sign-up
    	    BackandProvider.setAnonymousToken('1518eae0-3438-43ad-aab2-6b34bc358efb'); // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access

        $stateProvider
            // setup an abstract state for the tabs directive
        .state('login', {
                url: '/login',
                templateUrl: 'templates/admin.html',
                controller: 'LoginCtrl as login'
            })
        .state('forgotpassword', {
                url: '/forgot-password',
                templateUrl: 'templates/forgot-password.html',
            })
        .state('tab', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/course.html'
            })
            .state('tab.videos', {
                url: '/videos',
                views: {
                    'tab-videos': {
                        templateUrl: 'templates/new_patient.html',
                        controller: 'VideosCtrl'
                    }
                }
            })
        .state('tab.games', {
                url: '/games',
                views: {
                    'tab-games': {
                        templateUrl: 'templates/patient.html'
                        
                    }
                }
            })
        .state('tab.help', {
                url: '/help',
                views: {
                    'tab-help': {
                        templateUrl: 'templates/Kd_Activity.html'
                        
                    }
                }
            })
        .state('details', {
		url: "/details/:id",
		templateUrl: 'templates/videoplayer.html',
		controller: 'detailsCtrl'
	       });

        $urlRouterProvider.otherwise('/login');

        $httpProvider.interceptors.push('APIInterceptor');
    })

    .run(function ($rootScope, $state, LoginService, Backand) {

        function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'login') {
                signout();
            }
            else if (toState.name != 'login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService, UserService, $cookieStore) {
        var login = this;

        function signin() {
            Backand.signin(login.email, login.password, login.appName)
                .then(function (response) {
                    $rootScope.$broadcast('authorized');
                    $state.go('admin');
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $state.go('admin');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        function SignInCtrl(Backand, $cookieStore) {
            $scope.signIn = function() {
                Backand.signin($scope.username, $scope.password, $scope.appName)
                .then(
                    function(token) {
                        
                    })
            }
        }

        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
    })

    
