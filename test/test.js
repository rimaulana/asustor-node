"use_strict";

var asustor = require("../index");
var expect = require("chai").expect;

describe("usbInfo", function() {
    it("Synchronous and Asynchronous function returned correct result", function() {
        asustor.usbInfo(function(error, data) {
            if (error) {
                console.log(error);
            } else {
                var result = asustor.usbInfoSync();
                expect(result).to.equal(data);
            }
        });
    });
});

describe("fileInfo", function() {
    it("Synchronous and Asynchronous function returned correct result", function() {
        var file_path = require("path").dirname(require.main.filename) + "/test.js";
        asustor.fileInfo(file_path, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                var result = asustor.fileInfoSync(file_path);
                expect(result).to.equal(data);
            }
        });
    });
});

describe("folderInfo", function() {
    it("Synchronous and Asynchronous function returned correct result", function() {
        var folder_path = require("path").dirname(require.main.filename);
        asustor.folderInfo(folder_path, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                var result = asustor.folderInfoSync(folder_path);
                expect(result).to.equal(data);
            }
        });
    });
});
