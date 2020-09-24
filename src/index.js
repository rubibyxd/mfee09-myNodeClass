const { response, json } = require('express');
const express = require('express');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/',(req, res)=>{
    // res.send('<h1>Hello World</h1>'); //html
    res.render('home',{name: 'Ruby'}); //render for 樣板引擎
});

app.get('/json-sales',(req,res)=>{
    const sales = require(__dirname + '/../data/sales');
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