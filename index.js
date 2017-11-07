"use strict";
var child = require("child_process");

module.exports = {
    folderInfo: getFolderInfo,
    usbInfo: getUSBInfo,
    fileInfo: getFileInfo,
    folderInfoSync: getFolderInfoSync,
    usbInfoSync: getUSBInfoSync,
    fileInfoSync: getFileInfoSync
};

function getFileInfo(fileName, callback) {
    var totalSize = 0;
    var dirPath = fileName.endsWith("/") ? fileName.slice(0, -1) : fileName;
    var callbackFunction = callback || function() {};
    if (typeof callbackFunction !== "function") {
        callbackFunction = function() {};
    }
    child.exec("du -s " + dirPath, (error, stdout, stderr) => {
        if (error) {
            callbackFunction(error, { totalSize: totalSize, files: files });
        } else {
            var raw = stdout.toString().split("\n");
            for (var i = 0; i < raw.length; i++) {
                var parse = raw[i].match(/^([0-9]+)(?:\s+)?(.*)$/);
                if (parse) {
                    files.push({ path: parse[2], size: parseInt(parse[1]) });
                    totalSize += parseInt(parse[1]);
                }
            }
            callbackFunction(null, { totalSize: totalSize, files: files });
        }
    });
}

function getFileInfoSync(fileName) {
    var totalSize = 0;
    var dirPath = fileName.endsWith("/") ? fileName.slice(0, -1) : fileName;
    try {
        var oProcess = child.execSync("du -s " + dirPath);
        var raw = oProcess.toString().split("\n");
        for (var i = 0; i < raw.length; i++) {
            var parse = raw[i].match(/^([0-9]+)(?:\s+)?(.*)$/);
            if (parse) {
                files.push({ path: parse[2], size: parseInt(parse[1]) });
                totalSize += parseInt(parse[1]);
            }
        }
    } finally {
        return { totalSize: totalSize, files: files };
    }
}

function getUSBInfo(callback) {
    var Drives = [];
    var totalAvailableSpace = 0;
    var callbackFunction = callback || function() {};
    if (typeof callbackFunction !== "function") {
        callbackFunction = function() {};
    }
    child.exec("df -P | awk 'NR > 1'", (error, stdout, stderr) => {
        if (error) {
            callbackFunction(error, { totalAvailableSpace: totalAvailableSpace, drives: Drives });
        } else {
            var aLines = stdout.toString().split("\n");
            for (var i = 0; i < aLines.length; i++) {
                var parse = aLines[i].match(/^(?!(?:\/dev\/md[0-9]+))\S+\s+[0-9]+\s+[0-9]+\s+([0-9]+)\s+[0-9]+\%\s+(.+USB[0-9]+)$/);
                if (parse) {
                    Drives.push({ name: parse[2], size: parseInt(parse[1]) });
                    totalAvailableSpace += parseInt(parse[1]);
                }
            }
            callbackFunction(null, { totalAvailableSpace: totalAvailableSpace, drives: Drives });
        }
    });
}

function getUSBInfoSync() {
    var Drives = [];
    var totalAvailableSpace = 0;
    try {
        var oProcess = child.execSync("df -P | awk 'NR > 1'");
        var aLines = oProcess.toString().split("\n");
        // For each line get drive info and add to array
        for (var i = 0; i < aLines.length; i++) {
            var parse = aLines[i].match(/^(?!(?:\/dev\/md[0-9]+))\S+\s+[0-9]+\s+[0-9]+\s+([0-9]+)\s+[0-9]+\%\s+(.+USB[0-9]+)$/);
            if (parse) {
                Drives.push({ name: parse[2], size: parseInt(parse[1]) });
                totalAvailableSpace += parseInt(parse[1]);
            }
        }
    } finally {
        return { totalAvailableSpace: totalAvailableSpace, drives: Drives };
    }
}

function getFolderInfo(FolderName, callback) {
    var files = [];
    var totalSize = 0;
    var folder = FolderName || "./";
    var dirPath = folder.endsWith("/") ? folder + "*" : folder + "/*";
    var callbackFunction = callback || function() {};
    if (typeof callbackFunction !== "function") {
        callbackFunction = function() {};
    }
    child.exec("du -s " + dirPath, (error, stdout, stderr) => {
        if (error) {
            callbackFunction(error, { totalSize: totalSize, files: files });
        } else {
            var raw = stdout.toString().split("\n");
            for (var i = 0; i < raw.length; i++) {
                var parse = raw[i].match(/^([0-9]+)(?:\s+)?(.*)$/);
                if (parse) {
                    files.push({ path: parse[2], size: parseInt(parse[1]) });
                    totalSize += parseInt(parse[1]);
                }
            }
            callbackFunction(null, { totalSize: totalSize, files: files });
        }
    });
}

function getFolderInfoSync(FolderName) {
    var files = [];
    var totalSize = 0;
    var folder = FolderName || "./";
    var dirPath = folder.endsWith("/") ? folder + "*" : folder + "/*";
    try {
        var oProcess = child.execSync("du -s " + dirPath);
        var raw = oProcess.toString().split("\n");
        for (var i = 0; i < raw.length; i++) {
            var parse = raw[i].match(/^([0-9]+)(?:\s+)?(.*)$/);
            if (parse) {
                files.push({ path: parse[2], size: parseInt(parse[1]) });
                totalSize += parseInt(parse[1]);
            }
        }
    } finally {
        return { totalSize: totalSize, files: files };
    }
}
