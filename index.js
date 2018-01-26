"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child = require("child_process");
function initUsbList() {
    return { drives: new Array(), totalAvailableSpace: 0 };
}
function initFileList() {
    return { files: new Array(), totalSize: 0 };
}
function getTotalSize(collection) {
    var total = 0;
    collection.map(function (item) {
        total += item.size;
    });
    return total;
}
function sanitizePath(type, input) {
    // by default all path are added backslash (/) at the end of it
    var result = (input || ".") + "/";
    // then we replace when double backslash with a backslash
    result = result.replace("//", "/");
    // if it is folder path, it needs to be added with asterisk (*)
    if (type === "folder") {
        result += "*";
    }
    else {
        // meanwhile, in file path, the trailing backslash needs to be removed
        result = result.slice(0, -1);
    }
    return result;
}
function extract(regex, input) {
    // initialize empty array as the default return value
    var result = new Array();
    // loop for each element of the array and find a match with defined regular expression.
    for (var i = 0; i < input.length; i++) {
        var parse = input[i].match(regex);
        // only matched string will be added into result array that will be returned by the function
        if (parse) {
            result.push(parse);
        }
    }
    return result;
}
function formatData(type, input) {
    // initialize array for putting the result
    var result = new Array();
    // for each element of input do the following
    for (var i = 0; i < input.length; i++) {
        // if the type is usb format data with usb information format
        if (type == "usb") {
            result.push({
                path: input[i][2] + input[i][3],
                size: parseInt(input[i][1]),
                index: parseInt(input[i][3])
            });
            // meanwhile if it not usb it might be folder or file
        }
        else {
            result.push({
                size: parseInt(input[i][1]),
                path: input[i][2]
            });
        }
    }
    return result;
}
function parser(type, input) {
    // initialized all required variable, including default regex pattern that is going to be used.
    var result = new Array();
    var regex = /^([0-9]+)(?:\s+)?(.*)$/;
    // However, if the type of is usb, we need to change the regex pattern
    // for handling usb raw data.
    if (type === "usb") {
        regex = /^(?!(?:\/dev\/md[0-9]+))\S+\s+[0-9]+\s+[0-9]+\s+([0-9]+)\s+[0-9]+\%\s+(.+USB[0-9]+)$/;
    }
    // we need to split the input per line by split it with new character
    var raw = input.split("\n");
    // removing empty line
    raw = raw.filter(item => item.length > 0);
    // match each line with defined regex
    var parsedLine = extract(regex, raw);
    // prepare the data format based on its type
    result = formatData(type, parsedLine);
    return result;
}
function execFile(command, type, callback) {
    child.exec("du -s " + sanitizePath(type, command), (error, stdout, stderr) => {
        if (error) {
            callback(error, initFileList());
        }
        else {
            var files = parser("file", stdout.toString());
            callback(null, {
                files: files,
                totalSize: getTotalSize(files)
            });
        }
    });
}
function execUsb(command, type, callback) {
    child.exec(command, (error, stdout, stderr) => {
        if (error) {
            callback(error, initUsbList());
        }
        else {
            var drives = parser("usb", stdout.toString());
            callback(null, {
                drives: drives,
                totalAvailableSpace: getTotalSize(drives)
            });
        }
    });
}
function execFileSync(path, type) {
    var result = initFileList();
    try {
        var output = child.execSync("du -s " + sanitizePath(type, path));
        result.files = parser(type, output.toString());
        result.totalSize = getTotalSize(result.files);
    }
    finally {
        return result;
    }
}
function usbInfo(callback) {
    execUsb("df -P | awk 'NR > 1'", "usb", callback);
}
exports.usbInfo = usbInfo;
function fileInfo(fileName, callback) {
    execFile(fileName, "file", callback);
}
exports.fileInfo = fileInfo;
function folderInfo(folderName, callback) {
    execFile(folderName, "folder", callback);
}
exports.folderInfo = folderInfo;
function usbInfoSync() {
    var result = initUsbList();
    try {
        var output = child.execSync("df -P | awk 'NR > 1'");
        result.drives = parser("usb", output.toString());
        result.totalAvailableSpace = getTotalSize(result.drives);
    }
    finally {
        return result;
    }
}
exports.usbInfoSync = usbInfoSync;
function folderInfoSync(folderName) {
    return execFileSync(folderName, "folder");
}
exports.folderInfoSync = folderInfoSync;
function fileInfoSync(fileName) {
    return execFileSync(fileName, "file");
}
exports.fileInfoSync = fileInfoSync;
