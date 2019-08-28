let dirTop='./src/mycode/'
let needDel=false;
// 配置你需要作为打包入口的TS文件的在 './src/'(具体看dirTop变量) 文件夹下的路径  
// 配置路径
//  (什么路径?)入口文件的路径
//      (什么样的入口文件?)TS文件
//  (路径怎么起笔?) 相对于'./src/'(具体看dirTop变量)
let dirArr=[ 
    // 'a/',
    'mesh/',
    // 'meshlight/',
];

module.exports={
    dirTop,
    dirArr,
    needDel
}