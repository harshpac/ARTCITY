exports.errController = (req,res,next) => {
    res.status(404).render('404',{
        path: '/add-product',
        pageTitle: 'Page Not Found'});
};
 