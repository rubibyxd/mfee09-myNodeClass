const db = require(__dirname + '/../db_connect2');
const express = require('express');
const moment = require('moment-timezone');
const router = express.Router();
const upload = require(__dirname + '/../upload-img-module');

async function getListData (req){
    const output = {
        page: 1,
        perPage: 10,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        pages: []
    };

    const [ [ {totalRows} ] ] = await db.query("SELECT COUNT(1) totalRows FROM address_book");

    if(totalRows>0){
        let page =parseInt(req.query.page) || 1;
        output.totalRows = totalRows;
        output.totalPages = Math.ceil(totalRows/output.perPage);

        if(page < 1){
            output.page = 1;
        }else if(page >output.totalPages){
            output.page = output.totalPages;
        }else{
            output.page = page;
        }

        if(output.totalPages <= 5){
            for(let i=1; i<=output.totalPages; i++){
                output.pages.push(i);
            }
        }else{
            const fAr = [], bAr = [];

            //從前面開始數
            for(let i = output.page -2; i<=output.totalPages; i++){
                if(i >= 1){
                    fAr.push(i);
                }
                if(fAr.length >= 5) break;
            }
            //從後面開始數
            for(let i = output.page + 2; i >= 1; i--){
                if(i <= output.totalPages){
                    bAr.unshift(i);
                }
                if(bAr.length >= 5) break;
            }
            output.pages = fAr.length > bAr.length ? fAr : bAr;
        }

        let sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(output.page - 1) * output.perPage},${output.perPage}`;

        const [r2] = await db.query(sql);
        r2.forEach(element => {
            element.birthday = moment(element.birthday).format('YYYY-MM-DD');
        });
        output.rows = r2;
    }
    return output;
};

router.use((req, res, next)=>{
    const whiteList = ['list', 'login'];

    let u = req.url.split('?')[0];
    u = u.split('/');
    //console.log(`address-book: ${u[1]}`);
    if(whiteList.includes(u[1])){
        next();
    } else {
        if(! req.session.admin){
            res.redirect('/address-book/list');
        } else {
            next();
        }
    }
});

// 取得sql資料 以json格式呈現在api的router
router.get('/api', async (req,res)=>{
    res.json(await getListData(req));
});

// 取得sql資料(output) 將取回的資料渲染到 'address-book/list'
router.get('/list',async (req,res)=>{
    const output = await getListData(req);
    if(req.session.admin){
    res.render('address-book/list', output);
    }else{
        res.render('address-book/list-noadmin', output);
    }
});

router.get('/add', (req,res)=>{
    res.render('address-book/add')
});

router.post('/add',upload.none(),async(req,res)=>{
    const sql = "INSERT INTO `address_book` set ?";

    // const x = await db.query(sql,[req.body]);
    // res.json(x);
                        //影響了幾列      insert的ID
    // [{"fieldCount":0,"affectedRows":1,"insertId":554,"info":"","serverStatus":2,"warningStatus":1},null]

    const data = {...req.body};
    data.created_at = new Date();

    const [{affectedRows, insertId}] = await db.query(sql,[ data ]);
    res.json({
        success: !!affectedRows,
        affectedRows,
        insertId
    })

});

router.get('/edit/:sid', async(req,res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";

    const [ results ] = await db.query(sql,[req.params.sid]);
    if(! results.length){
        return res.redirect('/address-book/list');
    }
    // results[0].birthday = moment(results[0].birthday).format('YYYY-MM-DD');
    // res.json(results);
    res.render('address-book/edit',results[0]);
});

router.post('/edit/:sid', upload.none(), async(req,res)=>{
    const data = {...req.body};
    const sql = "UPDATE address_book SET ? WHERE sid=?";

    // const [ results ] = await db.query(sql,[data,req.params.sid]);
    const [{affectedRows, changedRows}] = await db.query(sql, [ data, req.params.sid ]);
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"info":"Rows matched: 1  Changed: 0  Warnings: 0","serverStatus":2,"warningStatus":0,"changedRows":0}

    res.json({
        success: !!changedRows,
        affectedRows,
        changedRows
    });
    // res.render('address-book/edit',results[0]);
});

router.delete('/del/:sid', async(req,res)=>{
    const sql = "DELETE FROM `address_book` WHERE sid=?";
    const [ results ] = await db.query(sql, [ req.params.sid ]);
    res.json(results);
});


router.get('/login',(req, res)=>{
    res.render('address-book/login');
});

router.post('/login',upload.none(),async (req, res)=>{
    const output = {
        bodey:req.body,
        success: false,
    }
    const sql ="SELECT `sid`, `account`, `nickname` FROM `admins` WHERE account=? AND password=SHA1(?)";
    const [ results ] = await db.query(sql,[req.body.account, req.body.password]);
    if(results.length){
        req.session.admin = results[0];
        output.success = true;
    }
    res.json(output);
});

router.get('/logout',(req, res)=>{
    delete req.session.admin;
    res.redirect('/address-book/list');
});

module.exports = router;
/*
    列表  /list
        列表呈現 GET

    新增  /add
        表單呈現 GET, 接收資料 POST

    修改  /edit/:sid
        修改的表單呈現 GET, 接收資料 POST

    刪除  /del/:sid
        POST
 */


/* RESTful API
    列表
    / GET

    新增
    / POST

    呈現單筆
    /:sid GET

    修改單筆
    /:sid PUT

    刪除單筆
    /:sid DELETE
 */