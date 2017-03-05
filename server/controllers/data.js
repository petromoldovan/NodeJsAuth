exports.displayData = function(req, res, next) {
    res.send({
        de1:{title: 'this is just', id:1},
        de2:{title: 'some sample data', id:2}
    })
}
