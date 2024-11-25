const decoder = require('./decode.js');
const fs = require('fs');
const path = require('path');

// Read the file
const dataPath = 'data';
const files = walkSync(dataPath)[0];
const folders = walkSync(dataPath)[1];
const targetDir = 'decodedData/';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}
for (let j = 0; j < folders.length; j++) {
    if (!fs.existsSync(targetDir + folders[j])) {
        fs.mkdirSync(targetDir + folders[j]);
    }
}


const users = fs.readFileSync('users.json', 'utf-8').split('\n');
let parsedUsers = [];
for (let i = 0; i < users.length; i++) {
    if (users[i] == '') {
        continue;
    }
    parsedUsers[i] = JSON.parse(users[i]);
}


let file = "";
let chunks = [];
let message = "";
for (let i = 0; i < files.length; i++) { // for each file [i]
    if (!fs.existsSync(targetDir + files[i].replace('.json', ''))) {
        fs.mkdirSync(targetDir + files[i].replace('.json', ''));
    }
    file = fs.readFileSync(files[i], 'utf-8').replace(/‎/, '').split('\n');
    for (let i = 0; i < file.length; i++) {
        if (!file[i]) {
            continue;
        }
        chunks[i] = JSON.parse(file[i]);
    }
    for (let k = 0; k < file.length; k++) { // for each chunk in file [k]
        if (!chunks[k]) {
            continue;
        }
        if (fs.existsSync(targetDir + files[i].replace('.json', '') + '/' + k + '.txt')) {
            fs.rmSync(targetDir + files[i].replace('.json', '') + '/' + k + '.txt', { force: true });
        }
        for (let j = 0; j < chunks[k].length; j++) { //for each message in chunk [j]
            message = decoder.decodeChatMessage(chunks[k][j], parsedUsers);
            // console.log(message);
            fs.appendFileSync(targetDir + files[i].replace('.json', '') + '/' + k + '.txt', message, { flag: 'a' });
        }
    }
}


// Walk through the directory
function walkSync(dir, filelist, dirlist) {
    let files = fs.readdirSync(dir);
    var dirlist = dirlist || [];
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            dirlist.push(path.join(dir, file));
            let temp = walkSync(path.join(dir, file), filelist, dirlist);
            filelist = temp[0];
            dirlist = temp[1];
        } else {
            filelist.push(path.join(dir, file));
        }
    });
    dirlist.unshift(dir);
    return [filelist, dirlist];
};