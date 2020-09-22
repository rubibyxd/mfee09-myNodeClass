const http = require('http');
const fs = require('fs'); //file system

const server = http.createServer((require,response)=>{
    fs.writeFile(
        __dirname + '/../data/header01.txt',
        JSON.stringify(require.headers),
        error=>{
            if(error){
                response.end('Fail:' + error)
            }else{
                response.end('OK');
            }
        }
    )
});

server.listen(3000);