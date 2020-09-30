const db = require(__dirname + '/db_connect2');


const sql = "INSERT INTO `admins`(`account`, `password`, `nickname`) VALUES (?, ?, ?)";


db.query(sql, [1,1,1])
    .then(([r])=>{
        return db.query(sql, [2,2,2])
    })
    .then(([r])=>{
        return db.query(sql, [3,3,3])
    })

console.log('ok');



//async await

// const sql = "INSERT INTO `admins`(`account`, `password`, `nickname`) VALUES (?, ?, ?)";

// console.log(new Date());
// (async ()=>{
//     for(i=1; i<=1000; i++){
//         await db.query(sql, ['b'+i, i, i]);
//     }
// })();

// console.log(new Date());

