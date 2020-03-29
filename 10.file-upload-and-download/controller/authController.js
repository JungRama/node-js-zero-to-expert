const User = require('../models/user')

const Validation = require('../helpers/validation')
const Joi = require('joi')

const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(
    sendGridTransport({
        auth: {
            api_key: process.env.SENDGRID_APIKEY
        }
    })
)

/* ---------------------------------- LOGIN --------------------------------- */

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        rName: 'authLogin',
        title: 'Login',
        message: req.flash('message'),
        oldForm: req.flash('oldForm')
    });
};

exports.postLogin = (req, res, next) => {
    const request = req.body

    const validation = Validation.validate({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(72).required(),
    }, request);
    
    if(validation.length > 0){
        req.flash('message', validation)
        req.flash('oldForm', req.body)      
        res.redirect('/login')
    }
    
    User.findOne({email: request.email})
    .then(user => {
        if(!user){
            req.flash('message', {
                type: 'is-danger',
                text: 'Invalid email or password'
            })
            req.flash('oldForm', req.body)
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
                    req.flash('oldForm', req.body)
                    res.redirect('/login')
                }
            })
            .catch(err => {
                console.log('failed to bcyrpt ' + err);
            })
        }
    })
}

/* -------------------------------- REGISTER -------------------------------- */

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        rName: 'authRegister',
        title: 'Register',
        message: req.flash('message'),
        oldForm: req.flash('oldForm'),
    });
};

exports.postRegister = (req, res, next) => {
    const request = req.body

    const validation = Validation.validate({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(72).required(),
        confirm_password: Joi.string().valid(Joi.ref('password')).required()
    }, request);
    
    if(validation.length > 0){
        req.flash('message', validation)
        req.flash('oldForm', req.body)
        res.redirect('/register')
    }

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

/* ----------------------------- RESET PASSWORD ----------------------------- */
exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset-password', {
        rName: 'authResetPassword',
        title: 'Reset Password',
        message: req.flash('message')
    });
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err)
            return res.redirect('/reset')
        }

        const token = buffer.toString('hex')

        User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                req.flash('message', {
                    type: 'is-danger',
                    text: 'User not found'
                })
                res.redirect('/reset-password')
            }else{
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000

                user.save()
                .then(result => {         
                    
                    req.flash('message', {
                        type: 'is-success',
                        text: 'Check your email to change your password'
                    })
                    res.redirect('/reset-password') 

                    transporter.sendMail({
                        to: result.email,
                        from: 'jungrama.id@gmail.com',
                        subject: 'Reset Password',
                        html: `<h1>Change your password <a href="${process.env.baseURL}/reset-password/${result.resetToken}">here</a></h1>`
                    }) 
                    
                })
                .catch(err => {
                    req.flash('message', {
                        type: 'is-danger',
                        text: JSON.stringify(err)
                    })
                    res.redirect('/reset-password') 
                })
            }
        })
    })
}

/* ------------------------------ NEW PASSWORD ------------------------------ */
exports.getNewPassword = (req, res, next) => {
    const token = req.params.token

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user => {
        if(user){
            res.render('auth/new-password', {
                rName: 'authNewPassword',
                token: token,
                title: 'Reset to new password',
                message: req.flash('message')
            });
        }
        else{
            res.render('static/404', {
                rName: '',
                title: 'Page Not Founds'
            })
        }
    })
}

exports.postNewPassword = (req, res, next) => {
    const token = req.params.token
    const request = req.body

    if(request.password == request.confirm_password){
        User.findOne({resetToken: token})
        .then(user => {

            return bcrypt.hash(request.password, 12)
            .then(password => {
                user.resetToken = null
                user.resetTokenExpiration = null
                user.password = password

                return user.save()
            })
            
        })
        .then(result => {
            req.flash('message', {
                type: 'is-success',
                text: "Success change your password"
            })
            res.redirect('/login') 
        })
        .catch(err => {
            req.flash('message', {
                type: 'is-danger',
                text: JSON.stringify(err)
            })
            res.redirect(`/reset-password/${token}`) 
        })
    }else{
        req.flash('message', {
            type: 'is-danger',
            text: "Password must be match"
        })
        res.redirect(`/reset-password/${token}`) 
    }
}

/* --------------------------------- LOGOUT --------------------------------- */
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
}