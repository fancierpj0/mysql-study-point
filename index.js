const http = require('http');

const mysql = require('mysql');

// console.log(mysql);

// { createConnection: [Function: createConnection],
//   createPool: [Function: createPool],
//   createPoolCluster: [Function: createPoolCluster],
//   createQuery: [Function: createQuery],
//   escape: [Function: escape],
//   escapeId: [Function: escapeId],
//   format: [Function: format],
//   raw: [Function: raw] }

//创建连接池
//更多配置项查看下面pool对象 の ConnectionConfig
const pool = mysql.createPool({host: 'localhost', user: 'root', password: '123',database:'2018719',port:'3306'});

// console.log(pool);

// Pool {
//   domain: null,
//     _events: {},
//   _eventsCount: 0,
//     _maxListeners: undefined,
//     config:
//   PoolConfig {
//     acquireTimeout: 10000,
//       connectionConfig:
//     ConnectionConfig {
//       host: 'localhost',
//         port: 3306,
//         localAddress: undefined,
//         socketPath: undefined,
//         user: 'root',
//         password: '123',
//         database: '2018719',
//         connectTimeout: 10000,
//         insecureAuth: false,
//         supportBigNumbers: false,
//         bigNumberStrings: false,
//         dateStrings: false,
//         debug: undefined,
//         trace: true,
//         stringifyObjects: false,
//         timezone: 'local',
//         flags: '',
//         queryFormat: undefined,
//         pool: [Circular],
//         ssl: false,
//         multipleStatements: false,
//         typeCast: true,
//         maxPacketSize: 0,
//         charsetNumber: 33,
//         clientFlags: 455631 },
//     waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0 },
//   _acquiringConnections: [],
//     _allConnections: [],
//     _freeConnections: [],
//     _connectionQueue: [],
//     _closed: false }

http.createServer(function (req, res) {

  //获取连接
  pool.getConnection(function(err,connection){
    if(err) {
      res.end('链接失败！少侠请重头来过');
      return console.error(err);
    }

    console.info('获取连接成功~');
    res.setHeader('Content-Type', 'text/html;charset=utf-8');

    if(req.url === '/select'){
      connection.query('SELECT * FROM `user`;',function(err,data){
        if(err) {
          res.end('查询失败！少侠请重头来过');
          return console.error(err);
        }

        console.log(data);
        res.end(JSON.stringify(data));
        //[ RowDataPacket { id: 1, user: 'ahh', pass: '123' },
        // RowDataPacket { id: 2, user: 'ahh2', pass: '123' } ]

        // 因为pool是长连接，查询完需要手动关闭连接
        connection.end();
        // Calling conn.end() to release a pooled connection is deprecated. In next version calling conn.end() will be restored to default conn.end() behavior. Use conn.release() instead.

        // connection.release();
      });
    }

    if(req.url === '/insert'){
      // connection.query('INSERT INTO `user` (`id`,`user`,`pass`) VALUES("5","BLL","123456")'
      //id可以省略，因为数据库里我们设置了自动递增
      connection.query('INSERT INTO `user` (`user`,`pass`) VALUES("BLL","123456")',function(err,data){
        if(err) {
          res.end('插入失败！少侠请重头来过');
          return console.error(err)
        };
        res.end();
        connection.end();
      });
    }

  });

}).listen(3000);

