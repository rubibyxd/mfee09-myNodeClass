require('dotenv').config();

const { response, json } = require('express');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest:__dirname + '/../tmp_uploads'});
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const db = require('./db_connect2');
const sessionStore = new MysqlStore({},db);

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req,res,next)=>{
    res.locals.title = '壹定發柏青哥';
    next();
});

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'adj2kakv24naoei51ja6jw78pqam',
    store: sessionStore,
    cookie:{
        maxAge: 1200000,
    }
}));

app.get('/try-session',(req,res)=>{
    req.session.myVar = req.session.myVar || 0;
    req.session.myVar++;
    res.json({
        myVar: req.session.myVar,
        session: req.session
    });
})

app.get('/try-moment',(req,res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const mo1 = moment(req.session.cookie.expires);
    const mo2 = moment(new Date());

    res.json({
        'mo1': mo1.format(fm),
        'mo2': mo2.format(fm),
        'process.env.DB_NAME': process.env.DB_NAME,
    });
});

app.get('/try-db',(req,res)=>{
    db.query('SELECT * FROM address_book LIMIT 2')
        .then(([results])=>{
            res.json(results);
            // console.log(results);
            // console.log(results[0].sid);
        })
});

app.use('/address-book',require(__dirname + '/routes/address-book'));

app.get('/rayark', async(req,res)=>{
    const response = await axios.get('https://www.rayark.com/zh/');
    res.send(response.data);
});

app.get('/',(req, res)=>{
    // res.send('<h1>Hello World</h1>'); //html
    res.render('home',{name: 'Ruby'}); //render for 樣板引擎
});

app.get('/json-sales',(req,res)=>{
    const sales = require(__dirname + '/../data/sales');
    res.locals.title += '-員工名單';
    res.render('json-sales',{sales});
    // res.json(sales);
});

app.get('/json-sales2',(req,res)=>{
    const sales = require(__dirname + '/../data/sales');
    res.render('abc/def/json-sales2',{sales});
    // res.json(sales);
});

app.get('/try-query',(req,res)=>{
    res.json(req.query);
});


app.post('/try-post',(req,res)=>{
    res.json(req.body);
});

app.get('/try-post-form',(req,res)=>{
    // res.render('try-post-form',{email:'', password:''});
    res.render('try-post-form');
});

app.post('/try-post-form',(req,res)=>{
    res.render('try-post-form',req.body);
});

app.set('view engine','ejs');

app.post('/try-upload',upload.single('avatar'),(req,res)=>{
    // res.json(req.file);
    console.log(req.file);
    
    if(req.file && req.file.originalname){
        switch(req.file.mimetype){
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':

                fs.rename(
                    req.file.path,
                    __dirname + '/../public/img/' + req.file.originalname,
                    error=>{
                        return res.json({
                            success: true,
                            path: '/img/'+ req.file.originalname
                        });
                    });

                break;
            default:
                fs.unlink(req.file.path, error=>{
                    return res.json({
                        success: false,
                        msg: '不是圖檔'
                    });
                });

        }
        } else {
        return res.json({
            success: false,
            msg: '沒有上傳檔案'
        });
        }
    });

const upload2 = require(__dirname + '/upload-img-module');
app.post('/try-upload2', upload2.single('avatar'), (req, res)=> {
    res.json(req.file);
});

app.get('/my-params/:action?/:id?',(req,res)=>{
    res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req,res)=>{
    let mobileUrl = req.url.slice(3).split('?')[0];
    mobileUrl = mobileUrl.replace(/-/g,'');
    res.send(mobileUrl);
});



app.get('/try-uuid',(req,res)=>{
    res.json({
        uuid1: uuidv4(),
        uuid2: uuidv4()
    })
});

app.use(require(__dirname + '/routes/admin2'));
app.use('/abc234',require(__dirname + '/routes/admin3'));

//靜態內容資料夾(非由JS動態生成的)
app.use(express.static(__dirname + '/../public'));

app.use((req,res)=>{
    res.type('text/plain');
    res.status(404);
    res.send('404 - 找不到網頁')
});

app.listen(3000, ()=>{
    console.log('伺服器已啟動...');
});