exports.displayData = function(req, res, next) {
    res.send({
        de1:{title: 'some', id:1},
        de2:{title: 'some', id:2}
    })
}
