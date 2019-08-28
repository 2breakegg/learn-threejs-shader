let {dirTop,dirArr,needDel} = require('./path.config');

let filename="myfiles.js";
let filepath="./dist/mycode/";

// dirArr中没有的文件夹 在./dist/mycode/myfiles.js文件夹中被覆盖,删除
let getFileString = ()=>{ //{ a: './src/a', b: './src/b', index: './src/index' } 给 webpack 配置中的 entry使用
   let fs = require('fs');
   let result={};
   let dir = '';

   for(let i=0;i<dirArr.length;i++){
      dir=dirTop+'/'+dirArr[i];
      let fsdir = fs.readdirSync(dir);
      let files=[];
      for(let i=0; i<fsdir.length;i++){
         let filename=fsdir[i];
         if(filename.match(/\.ts$/)){
               filename=filename.replace(/\.ts/,"");
               files.push(filename);
         }
      }
      result[dirArr[i]]=files;
   }
   return result;
}

// 先读取...
let getFileString_noDel = ()=>{ //{ a: './src/a', b: './src/b', index: './src/index' } 给 webpack 配置中的 entry使用
   let fs = require('fs');
   let readdata = fs.readFileSync('./dist/mycode/myfiles.js');
   let files = JSON.parse(readdata.toString().replace("var files = ",""));

   let result=files;
   let dir = '';

   for(let i=0;i<dirArr.length;i++){
      dir=dirTop+'/'+dirArr[i];
      let fsdir = fs.readdirSync(dir);
      let files=[];
      for(let i=0; i<fsdir.length;i++){
         let filename=fsdir[i];
         if(filename.match(/\.ts$/)){
               filename=filename.replace(/\.ts/,"");
               files.push(filename);
         }
      }
      result[dirArr[i]]=files;
   }
   return result;
}


let fs = require("fs");

if(!fs.existsSync(filepath)){
   fs.mkdirSync(filepath);
}
// let data = getFileString();
let data = needDel ? getFileString() : getFileString_noDel();
// console.log(data)
fs.writeFileSync('./dist/mycode/myfiles.js', `var files = `+JSON.stringify(data,null,4));

module.exports={getFileString};