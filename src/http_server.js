const http = require('http');
const server = http.createServer((require,response)=>{
    response.writeHead(200,{
        'Content-Type':'text/html; charset=utf-8'
    });
    response.end(`
        <meta charset="UTF-8">
        <h2>Hello 你好</h2>
        <p>${require.url}</p>
    `);
});

server.listen(3000);