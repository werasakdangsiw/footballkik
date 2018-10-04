'use strict';
var fetch = require('node-fetch');
var FormData = require('form-data');

module.exports = function (_, passport, User) {
    return {
        SetRouting: function (router) {

            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
           
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);


            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp);
        },

        indexPage: function (req, res) {
            const errors = req.flash('error');
           
            const form = new FormData();
            form.append('gamecode', '1');
            form.append('logintoken', 'Rct+sNrsSSd1PfADe6oNWmO48SdrDjwCFoiGfEa9ZFSAREr8y89ug6Qfnz9y0tWJ7relXV1GfiB9RqL0V3gXBFoC30anzDhu');
            form.append('pageno', '1');
            form.append('pagesize', '6');
            form.append('url', 'game/gamehistory');
        
        
            fetch('http://stage.xyzblue.com/api/v2/utils/proxy', { method: 'POST', body: form, headers: form.getHeaders() })
              .then(res => res.json())
              .then(json => {
                var arr = [];
                var arr = json.data.list;
                let j = []
                let k = []
                let y = []

                for (var i = 0; i < arr.length; i++) {
                    (function () {
                     j[i] = arr[i].roundid;
                     k[i] = arr[i].result.pop();     
                     if(k[i] == 1){
                         y[i] = j[i]+' => GOAL';
                     } 
                     if(k[i] == 2){
                        y[i] = j[i]+' => OUT';
                    }              
                    })();
                  }
                  console.log(y);
            //console.log(k);
                console.log("----");
                return res.render('index', { title: 'Footballfanclub | Login', messages: errors, hasErrors: errors.length,data: y });
                
            });

           
            
        },

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function (req, res) {
            const errors = req.flash('error');
            return res.render('signup', { title: 'Footballfanclub | SignUp', messages: errors, hasErrors: errors.length > 0 });
        },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getFacebookLogin: passport.authenticate('facebook', {
           scope: 'email' 
        }),

        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        })


    }
}