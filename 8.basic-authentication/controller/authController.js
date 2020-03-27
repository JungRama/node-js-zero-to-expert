const User = require('../models/user')

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

/* -------------------------------- REGISTER -------------------------------- */

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
                    
                    transporter.sendMail({
                        to: 'jungrama.id@gmail.com',
                        from: 'jungrama.id@gmail.com',
                        subject: 'Register Success!',
                        html: '<h1>You successfully register!</h1>'
                    }).then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    })

                    // req.flash('message', {
                    //     type: 'is-success',
                    //     text: 'Check your email to change your password'
                    // })
                    // res.redirect('/reset-password') 

                    // transporter.sendMail({
                    //     to: result.email,
                    //     from: 'jungrama.id@gmail.com',
                    //     subject: 'Reset Password',
                    //     html: `<h1>Change your password <a href="${process.env.baseURL}/reset-password/${result.resetToken}">here</a></h1>`
                    // }) 
                    
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

/* --------------------------------- LOGOUT --------------------------------- */
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
}