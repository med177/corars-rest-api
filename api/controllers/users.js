const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const checkAuth = require('../middleware/check-auth')

const User = require('../models/user')

exports.GetAll = (req, res, next) => {
    User
        .find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                users: docs.map((doc) => {
                    return {
                        id: doc._id,
                        email: doc.email,
                        password: doc.password,
                        request: {
                            type: req.method,
                            url: req.protocol + '://' + req.headers.host + req.url + 'users/' + doc._id
                        }
                    };
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.GetById = (req, res, next) => {
    const id = req.params.userId;
    User
        .findById(id)
        .select('-__v')//_id name price 
        .exec()
        .then(doc => {
            console.log('Veritabanı\'ndan', doc);
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: req.method,
                        url: req.protocol + '://' + req.headers.host + '/products' + req.url
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Bulunamadı ' + id
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.SignUp = (req, res, next) => {
    //aynı email sistemde varmı
    User.find({ email: req.body.email })
        .exec()
        .then((doc) => {
            if (doc.length > 0) {
                res.status(409).json({
                    message: 'Bu mail adresi zaten kayıtlı !'
                })
            } else {
                //şifrenin hashlenmesi kısmı
                bcrypt.hash(req.body.password, 10, (err, encrypted) => {
                    if (err) {//hashlemede hata olursa
                        res.status(500).json({
                            error: err
                        })
                    } else {//hashleme başarılı ise
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: encrypted,
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Kullanıcı Kaydedildi',
                                    createdUser: {
                                        id: result._id,
                                        email: result.email,
                                        password: result.password,
                                        request: {
                                            type: req.method,
                                            url: req.protocol + '://' + req.headers.host + '/users/' + result._id
                                        }
                                    }
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
}

exports.Login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then((doc) => {
            if (!doc) {
                return res.status(401).json({
                    message: 'Kimlik doğrulama geçersiz !'
                })
            }
            bcrypt.compare(req.body.password, doc.password, (err, same) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Kimlik doğrulama geçersiz !'
                    })
                }
                if (same) {
                    const cert = fs.readFileSync('./private.key')
                    const data = { userId: doc._id, email: doc.email }
                    const token = jwt.sign(
                        data,
                        cert,
                        { expiresIn: '1h' } //Eg: 60, "2 days", "10h", "7d"
                    )
                    return res.status(200).json({
                        message: 'Geçerli !',
                        token: token
                    })
                }
            })
        })
}

exports.Update = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Kullanıcı Bilgileri Güncellendi',
                request: {
                    type: req.method,
                    url: req.protocol + '://' + req.headers.host + '/users' + req.url
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.Delete = (req, res, next) => {
    const id = req.params.userId;
    User
        .remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Kullanıcı Silindi',
                request: {
                    description: 'Yeni Kullanıcı ekleme isteği',
                    type: 'POST',
                    url: req.protocol + '://' + req.headers.host + '/user/signup',
                    body: {
                        email: 'String, reguired',
                        password: 'Number, required'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}