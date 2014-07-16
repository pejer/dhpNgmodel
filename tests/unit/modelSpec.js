"use strict"

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('dhpNgModel'));

    describe('model', function() {
        it('should have the correct model', inject(function(model) {
            expect(model('user').find()).toEqual('finding user');
        }));
        it('should set new model name', inject(function(model) {
            expect(model('user').setModel('image').find()).toEqual('finding image');
        }));
        it('should parse data correctly', inject(function(model) {
            expect(model('user').__parseResponse({})).toEqual({});
        }));

        it('should make a get request', inject(function(model, $http, $httpBackend) {
            $httpBackend.expectGET('/user/1').respond(200,'{"user":"Henrik Pejer"}');
            var result = null;
            model('user').get(1).then(function(d){
                result = d;
            });
            $httpBackend.flush();
            expect(result.user).toEqual("Henrik Pejer");
        }));

        it('should make a get request without parameters when no id is supplied', inject(function(model, $http, $httpBackend) {
            $httpBackend.expectGET('/user/').respond(200,{"something":'Result for model get method without parameters'});
            var result = null;
            model('user').get().then(function(d){
                result = d;
            });
            $httpBackend.flush();
            expect(result.something).toEqual('Result for model get method without parameters');
        }));

        it('should return a model-instance when new is called',inject(function(model, $http, $httpBackend){
            var g = model('user').new({"name":"Henrik Pejer"});
            expect(g.name).toEqual("Henrik Pejer");
            $httpBackend.expectPOST('/user/').respond(200,{id:1,name: "Henrik Pejer"});
            g.$save();
            $httpBackend.flush();
            expect(g.id).toEqual(1);
            $httpBackend.expectPOST('/user/1').respond(200,{id:1,name: "Henrik Pejer"});
            g.$save();
            $httpBackend.flush();
        }));
    });
});