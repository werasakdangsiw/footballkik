module.exports = function () {
    return {
        SetRouting: function (router) {
            router.get('/group/:name', this.groupPage);
            router.get('/logout', this.logout);

            router.post('/group/:name', this.groupPage);
        },

        groupPage: function (req, res) {
            const name = req.params.name;
            res.render('groupchat/group', { title: 'Footballfanclub - Group', user: req.user, groupName: name })
        },
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
               res.redirect('/');
            });
        }
    }

}
