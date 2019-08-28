const path=require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
let webpack =  require('webpack');

// let myWebpackFunction = require(' /mywebpackfunction');
let myWebpackFunction = require('./for_webpack/mywebpackfunction');


module.exports={
    mode:'development',
    entry:myWebpackFunction.getEntry2(),
    output:{
        filename:'mycode/js/[name].js',
        path:path.resolve(__dirname,'dist')
    },
    devtool: "source-map",
    resolve:{
        extensions:[".ts",".tsc",".js","json"]
    },
    module:{
        rules:[
            {
                test: /\.ts$/,
                use:[
                    {
                        loader: 'ts-loader',
                    },
                ]
            },
            {
                test: [/\.glsl$/i,/\.vert$/i,/\.frag$/i],
                use: 'raw-loader',
            },
        ]
    },

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3003,
        open:true,
        openPage:'mycode/'
    },
    watch:true,
    watchOptions:{
        poll:1000, //每秒 问我1000次
        aggregateTimeout:300, //防抖 我一直输入代码
        ignored:/node_modules/ // 不需要进行监控哪个文件
    },
    plugins: 
    myWebpackFunction.getHtmlWebPackPlugin2(),

    externals:{
        three:"THREE"
    }
};