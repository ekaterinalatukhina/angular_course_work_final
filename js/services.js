app.service('emailService', function($http){
  this.getAll = () => {
    return $http.get('data/emails.json');
  }
});

app.service('userService', function($http){
  this.getAll = () => {
    return $http.get('data/users.json');
  }
});

app.service('boxService', function($http){
  this.getAll = () => {
    return $http.get('data/boxes.json');
  }
});

app.service('authService', function($window, $http){
  this.isAuthirized = () => {
    return JSON.parse($window.localStorage.getItem('auth')) || false;
  };

  this.login = (login, pass) => {
      return $http.get('data/auth.json').then((data) => { 
         var creds =  data.data;         
         if (creds.login == login &&
             creds.password == md5(pass)) {
             $window.localStorage.auth = angular.toJson({"login":login, "password":creds.password});
             return true;
         }else{
            return false;
         }
      });
  };

  this.logout = () => { 
    delete $window.localStorage.auth;
    return true;
  };

});
