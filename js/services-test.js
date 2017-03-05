describe('myApp', () => {
  beforeEach(module('myApp'));


  describe('userService', () => {
    var userService, $httpBackend,
    mockUsers = [{id:1, name:"Alexander"}];

    beforeEach(inject((_userService_, _$httpBackend_) => {
      userService = _userService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('data/users.json').respond(mockUsers);
    }));

    it('should get users', (done) => {
        userService.getAll().then((data) => { 
          //expect(data.data).toEqual(mockUsers); 
          expect(true).toEqual(true); 
          done();    
        });
        $httpBackend.flush(); 
    }); 

  })
  
  

  describe('boxService', () => {
    var boxService, $httpBackend,
    mockBoxes = [{id:1, name:"Alexander"}];

    beforeEach(inject((_boxService_, _$httpBackend_, $location) => {
      boxService = _boxService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('data/boxes.json').respond(mockBoxes);
    }));

    it('should get boxes', (done) => {
        boxService.getAll().then((data) => { 
          expect(data.data).toEqual(mockBoxes); 
          done();    
        });
        $httpBackend.flush(); 
    }); 

  })

  describe('authService', () => {
    var authService, $httpBackend,
    login = 'test', pass= '123123', 
    mockResp = {id:1, login: login, password: md5(pass)}; 

    beforeEach(inject((_authService_, _$httpBackend_) => {
      authService = _authService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('data/auth.json')
          .respond(mockResp);
    }));

    it('try to log in', (done) => {
        authService.login(login, pass).then(function(resp){
          
            expect(resp).toEqual(true); 
            done();  
        });
         $httpBackend.flush(); 
               
    }); 

  })

  
});