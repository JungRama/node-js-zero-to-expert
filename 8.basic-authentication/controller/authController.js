exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        rName: 'authLogin',
        title: 'Login',
    });
};

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        rName: 'authRegister',
        title: 'Register',
    });
};