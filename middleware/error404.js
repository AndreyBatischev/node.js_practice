const erorrPage404 = function (req, res, next) {
    res.status(404).render('404', {
        title: 'Page not found'
    })
}


export default erorrPage404