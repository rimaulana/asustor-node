// "use_strict";

var asustor = require("../index");
var expect = require("chai").expect;

var folder_path = require("path").dirname(require.main.filename);

describe("fileInfo", function() {
    it("Async and Sync function returned the same result", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.fileInfo(folder_path, function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        promise
            .then(asyncResult => {
                var syncResult = asustor.fileInfoSync(folder_path);
                expect(asyncResult).to.deep.equal(syncResult);
                done();
            })
            .catch(err => {
                expect(err.code).to.equal(1);
                expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(err.message)).to.be.true;
                done();
            });
    });
    it("Async and Sync function convert folder path to file path", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.fileInfo(folder_path + "/", function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        promise
            .then(asyncResult => {
                var syncResult = asustor.fileInfoSync(folder_path + "/");
                expect(asyncResult).to.deep.equal(syncResult);
                done();
            })
            .catch(err => {
                expect(err.code).to.equal(1);
                expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(err.message)).to.be.true;
                done();
            });
    });
    it("Async function return error message when file was not found", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.fileInfo("nonexistent", function(error, data) {
                if (error) {
                    reject(error);
                }
            });
        });
        promise.catch(err => {
            expect(err.code).to.equal(1);
            expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(err.message)).to.be.true;
            done();
        });
    });
    it("Async function return error if no file path is passed as param", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.fileInfo(function(error, data) {
                if (error) {
                    reject(error);
                }
            });
        });
        promise.catch(err => {
            expect(err.code).to.equal(1);
            expect(err.message).to.be.equal("fileName cannot be empty");
            done();
        });
    });
    it("Async function return error if no file path is not passed as a string", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.fileInfo({}, function(error, data) {
                if (error) {
                    reject(error);
                }
            });
        });
        promise.catch(err => {
            expect(err.code).to.equal(1);
            expect(err.message).to.be.equal("fileName needs to be string");
            done();
        });
    });
    it("Async function return empty if no file path and callback function is passed as param", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.fileInfo();
            resolve();
        });
        promise.then(asyncResult => {
            done();
        });
    });
    it("Sync function return empty folder info object when folder was not found", function() {
        var result = asustor.fileInfoSync("nonexistent");
        expect(result).to.deep.equal({ totalSize: 0, files: [] });
    });
    it("Sync function return list of current directory if no folder path is passed as param", function() {
        var result = asustor.fileInfoSync();
        expect(result.files.length).to.be.greaterThan(0);
    });
});

describe("folderInfo", function() {
    it("Async and Sync function returned the same result", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.folderInfo(folder_path, function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        promise
            .then(asyncResult => {
                var syncResult = asustor.folderInfoSync(folder_path);
                expect(asyncResult).to.deep.equal(syncResult);
                done();
            })
            .catch(err => {
                expect(err.code).to.equal(1);
                expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(err.message)).to.be.true;
                done();
            });
    });
    it("Async function return error message when file was not found", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.folderInfo("nonexistent", function(error, data) {
                if (error) {
                    reject(error);
                }
            });
        });
        promise.catch(err => {
            expect(err.code).to.equal(1);
            expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(err.message)).to.be.true;
            done();
        });
    });
    it("Async function return list of current directory if no folder path is passed as param", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.folderInfo(function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        promise
            .then(asyncResult => {
                expect(asyncResult.files.length).to.be.greaterThan(0);
                done();
            })
            .catch(err => {
                expect(err.code).to.equal(1);
                expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(err.message)).to.be.true;
                done();
            });
    });
    it("Async function return empty if no folder path and callback function is passed as param", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.folderInfo();
            resolve();
        });
        promise.then(asyncResult => {
            done();
        });
    });
    it("Sync function return empty folder info object when folder was not found", function() {
        var result = asustor.folderInfoSync("nonexistent");
        expect(result).to.deep.equal({ totalSize: 0, files: [] });
    });
    it("Sync function return list of current directory if no folder path is passed as param", function() {
        var result = asustor.folderInfoSync();
        expect(result.files.length).to.be.greaterThan(0);
    });
});

describe("USBInfo", function() {
    it("Async and Sync function returned the same result", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.usbInfo(function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        promise
            .then(asyncResult => {
                var syncResult = asustor.usbInfoSync();
                expect(asyncResult).to.deep.equal(syncResult);
                done();
            })
            .catch(err => {
                done();
            });
    });
    it("Async function return empty if no callback function is passed as param", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.usbInfo();
            resolve();
        });
        promise.then(asyncResult => {
            done();
        });
    });
    it("Async function return empty if param passed is not a function", function(done) {
        var promise = new Promise((resolve, reject) => {
            asustor.usbInfo("test123");
            resolve();
        });
        promise.then(asyncResult => {
            done();
        });
    });
});
