console.log("执行changeSetting.js 脚本");
let type = getType();
change(type);

function getType(){
    let program = require('commander'); 
    program
        .option('-h, --hidden','hidden file')
        .parse(process.argv);
    return program.hidden;
}

function change(type){ // type为true 隐藏多余文件夹, 否则 显示所有文件夹
    let showFile = './.vscode/settings.show.json';
    let hiddenFile = './.vscode/settings.hidden.json';
    let file = type ? hiddenFile : showFile;

    let fs = require('fs');
    let readdata = fs.readFileSync(file);
    let str = readdata.toString();

    fs.writeFileSync('./.vscode/settings.json', str);

    let message = type ? "已隐藏文件夹" : "已显示文件夹";
    console.log(message);
}