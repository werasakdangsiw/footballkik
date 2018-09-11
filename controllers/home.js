
module.exports = function (async, Club, _) {
    return {
        SetRouting: function (router) {
            router.get('/home', this.homePage);
           // router.post()
           router.get('/logout', this.logout);
        },

        homePage: function (req, res) {
            async.parallel([
                function (callback) {
                    Club.find({}, (err, result) => {
                        callback(err, result);
                    })
                },
                function(callback){
                    Club.aggregate({
                        $group: {
                            _id: "$country"
                        }
                    },(err,newResult) => {
                        callback(err,newResult);
                    });
                }
            ], (err, results) => {
                const dataChunk = results[0];
                const res2 = results[1];
                
                const countrySort = _.sortBy(res2,'_id');
                
                res.render('home', { title: 'Footballkik - Home',user: req.user, data: dataChunk ,country:countrySort});
            })
        },
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }
}