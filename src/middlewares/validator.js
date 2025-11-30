module.exports = (req, res, next) => {
    if (!req.body.text || req.body.text.trim() === '') {
        return res.redirect('/form.html');
    }
    next();
};