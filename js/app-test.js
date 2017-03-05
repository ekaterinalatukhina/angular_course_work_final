describe('myApp', () => {
  beforeEach(module('myApp'));


  describe('boxListComponent', () => {
     let $componentController, boxService;
     let boxes = [1,2];
     
     beforeEach(inject(($q, _$componentController_, _boxService_) => {
        $componentController = _$componentController_;
        boxService = _boxService_;
        spyOn(boxService, 'getAll').and.returnValue($q.resolve({boxes:boxes}));
     }));
    
     it('it should call service', () => {
        componentController = $componentController('boxList');
        expect(boxService.getAll).toHaveBeenCalled();
     });

     it('it should set boxes', () => {
        componentController = $componentController('boxList', null, {boxes:boxes});

        expect(componentController.boxes).toEqual([1,2]);
     });

  })

  describe('emailLineComponent', () => {
     let $componentController;
     let email = {subject:'test'};
     
     beforeEach(inject((_$componentController_) => {
        $componentController = _$componentController_;
     }));
    
     it('it should link email', () => {
        componentController = $componentController('emailLine', null, {email:email});
        expect(componentController.email).toEqual({subject:'test'});
     });

  })

  describe('newMailComponent', () => {
     let $componentController;
     let userslist = [{subject:'test'}];
     
     beforeEach(inject((_$componentController_) => {
        $componentController = _$componentController_;
     }));
    
     it('it should link userslist', () => {
        componentController = $componentController('newMail', null, {userslist:userslist});
        expect(componentController.userslist).toEqual([{subject:'test'}]);
     });

  })

  describe('loginComponent', () => {
     let $componentController, authService;
     //let boxes = [1,2];
     
     beforeEach(inject(($q, _$componentController_, _authService_, _$state_) => {
        $componentController = _$componentController_;
        authService = _authService_;
        $state = _$state_;
        spyOn(authService, 'isAuthirized').and.returnValue($q.resolve(false));
        spyOn(authService, 'login').and.returnValue($q.resolve(true));
     }));
    
     it('it should call isAuthirized', () => {
        componentController = $componentController('login');
        expect(authService.isAuthirized).toHaveBeenCalled();
     });

     it('it should call login', () => {
        componentController = $componentController('login');
        componentController.loginMe();
        expect(authService.login).toHaveBeenCalled();
     });
    
     

  })
  

  
});