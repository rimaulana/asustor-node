# ASUSTOR Node

![DefinitelyTyped](https://img.shields.io/badge/DefinitelyTyped-.d.ts-blue.svg) [![CircleCI](https://img.shields.io/circleci/project/github/rimaulana/asustor-node.svg)](https://circleci.com/gh/rimaulana/asustor-node/tree/master) [![codecov](https://codecov.io/gh/rimaulana/asustor-node/branch/master/graph/badge.svg)](https://codecov.io/gh/rimaulana/asustor-node) [![codebeat badge](https://codebeat.co/badges/3f55e8bc-c264-434c-abd2-02473421cb65)](https://codebeat.co/projects/github-com-rimaulana-asustor-node-master) [![Maintainability](https://api.codeclimate.com/v1/badges/33cf960c68a9a198b820/maintainability)](https://codeclimate.com/github/rimaulana/asustor-node/maintainability) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

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
