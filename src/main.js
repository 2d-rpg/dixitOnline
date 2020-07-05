// サーバーサイド：必要なモジュールを読み込む
var http = require('http');
var socketio = require('/app/node_modules/socket.io');
var fs = require('fs');
// サーバーサイド：HTTPサーバを生成する
// サーバー生成時にfunction以下のリクエストリスナーが登録されるため
// クライアントからHTTPリクエストが送信されるたびにfunctionが実行される
// ここではヘッダ出力(writeHead)とindex.htmlの出力(readFileSync)
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}).listen(3000);  // 使用するポート(ポート競合の場合は値を変更)
// サーバーサイド：HTTPサーバにソケットをひも付ける（WebSocket有効化）
var io = socketio.listen(server);
 
io.sockets.on('connection', function(socket) {
    socket.on('client_to_server', function(data) {
        io.sockets.emit('server_to_client', {value : data.value});
    });
});