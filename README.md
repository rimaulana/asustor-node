asustor-node
============
[![Build Status](https://travis-ci.org/rimaulana/asustor-node.svg?branch=master)](https://travis-ci.org/rimaulana/asustor-node)
[![Coverage Status](https://coveralls.io/repos/github/rimaulana/asustor-node/badge.svg?branch=master)](https://coveralls.io/github/rimaulana/asustor-node?branch=master)

A node module to get files and removable storage information from ASUSTOR NAS running on Ubuntu OS

## Installation
```bash
npm install @rimaulana/asustor-node
```

## Example
Getting attached USB drives information :
```javascript
var asustor = require('asustor-node');

// Asynchronous
asustor.usbInfo(function(error,data){
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
});

// Synchronous
console.log(asustor.usbInfoSync());
```
Getting File information :
```javascript
var asustor = require('asustor-node');
var file_path = "/home/user/file.mkv";

// Asynchronous
asustor.fileInfo(file_path, function(error,data){
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
});

// Synchronous
console.log(asustor.fileInfoSync(file_path));
```
Getting Folder information :
```javascript
var asustor = require('asustor-node');
var folder_path = "/home/user";

// Asynchronous
asustor.folderInfo(folder_path, function(error,data){
    if(error){
        console.log(error);
    }else{
        console.log(data);
    }
});

// Synchronous
console.log(asustor.folderInfoSync(folder_path));
```
## Tests
```bash
npm test
```
