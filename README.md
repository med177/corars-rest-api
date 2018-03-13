Uyarı: Bu döküman henüz hazır değildir !

# corars-rest-api
[![Build Status](https://travis-ci.org/med177/corars-rest-api.svg?branch=master)](https://travis-ci.org/med177/corars-rest-api)
[![Dependency Status](https://david-dm.org/med177/corars-rest-api.svg/status.svg)](https://david-dm.org/med177/corars-rest-api)
[![devDependencies Status](https://david-dm.org/med177/corars-rest-api/dev-status.svg)](https://david-dm.org/med177/corars-rest-api?type=dev)
[![Coverage Status](https://img.shields.io/codecov/c/github/med177/corars-rest-api/master.svg)](https://codecov.io/github/med177/corars-rest-api?branch=master)

Bu proje Rest Api yapısında bir test projesidir, bu proje sayesinde javascript teknolojilerinin bir kısmının denenmesi amaçlanmıştır.

## Links

- 📘 Documentation: [http://corars.com](http://corars.com)

# API'nin kurulumu

## 1. Node Modüllerini yükleyin
Terminal kullanarak npm den modülleri yükleyin.
```bash
$ npm install
```
## 2. Sunucu uygulamasını başlatın
Terminal kullanarak nodemon ile uygulamayı başlatın. Bu kısımda `package.json` içinde nodemon scripti npm üzerinde tanımlanmıştır.

```js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "nodemon server.js"
}
```

```bash
$ npm start
```


Proje'nin travis üzerindeki ayarları henüz tam olarak yapılamamıştır.
>Copyright 2018 Corars
---
<img src="http://corars.com/corars-micro.png"/>
