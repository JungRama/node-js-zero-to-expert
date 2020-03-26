const User = require('../models/user')

const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: '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'
        }
    })
)

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        rName: 'authLogin',
        title: 'Login',
        message: req.flash('message')
    });
};

exports.postLogin = (req, res, next) => {
    const request = req.body

    User.findOne({email: request.email})
    .then(user => {
        if(!user){
            req.flash('message', {
                type: 'is-danger',
                text: 'Invalid email or password'
            })
            res.redirect('/login')
        }else{
            bcrypt.compare(request.password, user.password)
            .then((match) =>{
                if(match){
                    req.session.user = user._id;
                    req.session.isLoggedIn = true
                    res.redirect('/')
                }else{
                    req.flash('message', {
                        type: 'is-danger',
                        text: 'Invalid email or password'
                    })
                    res.redirect('/login')
                }
            })
            .catch(err => {
                console.log('failed to bcyrpt ' + err);
            })
        }
    })
}

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        rName: 'authRegister',
        title: 'Register',
        message: req.flash('message'),
    });
};

exports.postRegister = (req, res, next) => {
    const request = req.body

    if(request.password != request.confirm_password){
        req.flash('message', {
            type: 'is-danger',
            text: 'Password must be match'
        })
        res.redirect('/register')
    }else{
        
        bcrypt.hash(request.password, 12)
        .then(password => {

            const user = new User({
                name: request.name,
                email: request.email,
                password: password,
                cart: {
                    items: []
                }
            })

            user.save()
            .then(response => {
                transporter.sendMail({
                    to: response.email,
                    from: 'jungrama.id@gmail.com',
                    subject: 'Register Success!',
                    html: '<h1>You successfully register!</h1>'
                })

                req.flash('message', {
                    type: 'is-success',
                    text: 'Success create account, Login to continue'
                })
                res.redirect('/login')
            })
            .catch(err => {
                req.flash('message', {
                    type: 'is-danger',
                    text: 'Internal Server Error : ' + err
                })
                res.redirect('/register')
            })

        }).catch(err => {
            console.log('failed to bcyrpt ' + err);
        })

    }
}