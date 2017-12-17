# ASUSTOR Node

[![CircleCI](https://img.shields.io/circleci/project/github/rimaulana/asustor-node.svg)](https://circleci.com/gh/rimaulana/asustor-node/tree/master) [![codecov](https://codecov.io/gh/rimaulana/asustor-node/branch/master/graph/badge.svg)](https://codecov.io/gh/rimaulana/asustor-node) [![Coveralls github](https://img.shields.io/coveralls/github/rimaulana/asustor-node.svg)](https://coveralls.io/github/rimaulana/asustor-node?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A node module to get files and removable storage information from ASUSTOR NAS running on Ubuntu OS

## Installation

```bash
npm install @rimaulana/asustor-node
```

## Example

Getting attached USB drives information :

```javascript
var asustor = require("asustor-node");

// Asynchronous
asustor.usbInfo(function(error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
});

// Synchronous
console.log(asustor.usbInfoSync());
```

Getting File information :

```javascript
var asustor = require("asustor-node");
var file_path = "/home/user/file.mkv";

// Asynchronous
asustor.fileInfo(file_path, function(error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
});

// Synchronous
console.log(asustor.fileInfoSync(file_path));
```

Getting Folder information :

```javascript
var asustor = require("asustor-node");
var folder_path = "/home/user";

// Asynchronous
asustor.folderInfo(folder_path, function(error, data) {
    if (error) {
        console.log(error);
    } else {
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
