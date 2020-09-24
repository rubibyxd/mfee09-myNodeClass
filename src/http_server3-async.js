const http = require('http');
const fs = require('fs'); //file system

function myWriteFile(path,content){
    return new Promise((resolve,reject)=>{
        fs.writeFile(
            path,
            content,
            error=>{
                if(error){
                    reject(error);
                }else{
                    resolve('OK');
                }
            }
        )
    });
}

const server = http.createServer((require,response)=>{
    myWriteFile(__dirname + '/../data/header01.txt',JSON.stringify(require.headers))
    .then(msg=>{
        response.end(msg);
    }).catch(ex=>{
        response.end(error);
    })
    
});

server.listen(3000);