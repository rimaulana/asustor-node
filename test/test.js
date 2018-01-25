// "use_strict";

var asustor = require("../dist/index.js");
var expect = require("chai").expect;
var sinon = require("sinon");
var child = require("child_process");

var folder_path = require("path").dirname(require.main.filename);

describe("fileInfo", function() {
    beforeEach(function() {
        this.exec = sinon.stub(child, "exec");
        this.execSync = sinon.stub(child, "execSync");
    });

    afterEach(function() {
        child.exec.restore();
        child.execSync.restore();
    });

    it("Async and Sync function returned the same result", function(done) {
        var expected = {
            totalSize: 2700,
            files: [
                {
                    path: "/mock/1",
                    size: 2700
                }
            ]
        };
        var rawInput = "2700  /mock/1\nnon_existent";
        var handler = this.exec.callsArgWith(1, null, rawInput, null);
        var handlerSync = this.execSync.returns(rawInput);
        asustor.fileInfo("/mock/1", function(error, data) {
            expect(asustor.fileInfoSync("/mock/1")).to.be.deep.equal(data);
            sinon.assert.calledOnce(handler);
            sinon.assert.calledOnce(handlerSync);
            sinon.assert.calledWith(handler, "du -s /mock/1");
            sinon.assert.calledWith(handlerSync, "du -s /mock/1");
            done();
        });
    });
    it("Async and Sync function convert folder path to file path", function(done) {
        var expected = {
            totalSize: 2300,
            files: [
                {
                    path: "/mock/2",
                    size: 2300
                }
            ]
        };
        var rawInput = "2300  /mock/2\nnon_existent";
        var handler = this.exec.callsArgWith(1, null, rawInput, null);
        var handlerSync = this.execSync.returns(rawInput);
        asustor.fileInfo("/mock/2/", function(error, data) {
            expect(asustor.fileInfoSync("/mock/2/")).to.be.deep.equal(data);
            sinon.assert.calledOnce(handler);
            sinon.assert.calledOnce(handlerSync);
            sinon.assert.calledWith(handler, "du -s /mock/2");
            sinon.assert.calledWith(handlerSync, "du -s /mock/2");
            done();
        });
    });
    it("Async function return error message when file was not found", function(done) {
        // var expected = {
        //     totalSize: 0,
        //     files: []
        // };
        var expectedError = new Error("Command failed\nNo such file or directory");
        expectedError.code = 1;
        var rawInput = "nonexistent";
        var handler = this.exec.callsArgWith(1, expectedError, rawInput, null);
        asustor.fileInfo("nonexistent", function(error, data) {
            expect(error.code).to.be.equal(1);
            // expect(data).to.be.deep.equal(expected);
            expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(error.message)).to.be.true;
            done();
        });
    });
    // it("Async function return error if no file path is passed as param", function(done) {
    //     asustor.fileInfo(function(error, data) {
    //         expect(error.code).to.be.equal(1);
    //         expect(error.message).to.be.equal("fileName cannot be empty");
    //         done();
    //     });
    // });
    // it("Async function return error if no file path is not passed as a string", function(done) {
    //     asustor.fileInfo(123456, function(error, data) {
    //         expect(error.code).to.be.equal(1);
    //         expect(error.message).to.be.equal("fileName needs to be string");
    //         done();
    //     });
    // });
    // it("Async function return empty if no file path and callback function is passed as param", function(done) {
    //     asustor.fileInfo();
    //     done();
    // });
    it("Sync function return empty file info object when file was not found", function(done) {
        var handlerSync = this.execSync.throws(new Error("Command failed\nNo such file or directory"));
        var result = asustor.fileInfoSync("nonexistent");
        expect(result).to.be.deep.equal({
            totalSize: 0,
            files: []
        });
        done();
    });
    it("Sync function return list of current directory if no folder path is passed as param", function() {
        var handlerSync = this.execSync.returns("2700  /mock/1\n2300    /mock/2\nnon_existent");
        var result = asustor.fileInfoSync();
        expect(result.files.length).to.be.greaterThan(0);
    });
});

// describe("folderInfo", function() {
//     beforeEach(function() {
//         this.exec = sinon.stub(child, "exec");
//         this.execSync = sinon.stub(child, "execSync");
//     });

//     afterEach(function() {
//         child.exec.restore();
//         child.execSync.restore();
//     });

//     it("Async and Sync function returned the same result", function(done) {
//         var expectedResult = {
//             totalSize: 7000,
//             files: [
//                 {
//                     path: "/var/usr/file1",
//                     size: 3300
//                 },
//                 {
//                     path: "/var/usr/file2",
//                     size: 1700
//                 },
//                 {
//                     path: "/var/usr/file3",
//                     size: 2000
//                 }
//             ]
//         };
//         var rawInput = "3300    /var/usr/file1\n1700    /var/usr/file2\n2000    /var/usr/file3\nall file listed";
//         var handler = this.exec.callsArgWith(1, null, rawInput, null);
//         var handlerSync = this.execSync.returns(rawInput);
//         asustor.folderInfo("/var/usr/", function(error, data) {
//             expect(asustor.folderInfoSync("/var/usr")).to.be.deep.equal(data);
//             sinon.assert.calledOnce(handler);
//             sinon.assert.calledOnce(handlerSync);
//             sinon.assert.calledWith(handler, "du -s /var/usr/*");
//             sinon.assert.calledWith(handlerSync, "du -s /var/usr/*");
//             done();
//         });
//     });
//     it("Async function return error message when file was not found", function(done) {
//         var expectedError = new Error("Command failed\nNo such file or directory");
//         expectedError.code = 1;
//         var handler = this.exec.callsArgWith(1, expectedError, null, null);
//         asustor.folderInfo("nonexistent", function(error, data) {
//             sinon.assert.calledOnce(handler);
//             sinon.assert.calledWith(handler, "du -s nonexistent/*");
//             expect(error.code).to.equal(1);
//             expect(/Command\s+failed.*(?:\n)?.*No\s+such\s+file\s+or\s+directory/.test(error.message)).to.be.true;
//             done();
//         });
//     });
//     it("Async function return list of current directory if no folder path is passed as param", function(done) {
//         var expectedResult = {
//             totalSize: 7000,
//             files: [
//                 {
//                     path: "/var/usr/file1",
//                     size: 3300
//                 },
//                 {
//                     path: "/var/usr/file2",
//                     size: 1700
//                 },
//                 {
//                     path: "/var/usr/file3",
//                     size: 2000
//                 }
//             ]
//         };
//         var rawInput = "3300    /var/usr/file1\n1700    /var/usr/file2\n2000    /var/usr/file3\nall file listed";
//         var handler = this.exec.callsArgWith(1, null, rawInput, null);
//         asustor.folderInfo(function(error, data) {
//             sinon.assert.calledOnce(handler);
//             sinon.assert.calledWith(handler, "du -s ./*");
//             expect(data).to.be.deep.equal(expectedResult);
//             done();
//         });
//     });
//     it("Async function return empty if no folder path and callback function is passed as param", function(done) {
//         var handler = this.exec.callsArgWith(1, null, "", null);
//         asustor.folderInfo();
//         sinon.assert.calledOnce(handler);
//         sinon.assert.calledWith(handler, "du -s ./*");
//         done();
//     });
//     it("Sync function return empty folder info object when folder was not found", function(done) {
//         var handlerSync = this.execSync.returns("");
//         var result = asustor.folderInfoSync("nonexistent");
//         expect(result).to.deep.equal({ totalSize: 0, files: [] });
//         sinon.assert.calledOnce(handlerSync);
//         sinon.assert.calledWith(handlerSync, "du -s nonexistent/*");
//         done();
//     });
//     it("Sync function return list of current directory if no folder path is passed as param", function(done) {
//         var expectedResult = {
//             totalSize: 7000,
//             files: [
//                 {
//                     path: "/var/usr/file1",
//                     size: 3300
//                 },
//                 {
//                     path: "/var/usr/file2",
//                     size: 1700
//                 },
//                 {
//                     path: "/var/usr/file3",
//                     size: 2000
//                 }
//             ]
//         };
//         var rawInput = "3300    /var/usr/file1\n1700    /var/usr/file2\n2000    /var/usr/file3\nall file listed";
//         var handlerSync = this.execSync.returns(rawInput);
//         var result = asustor.folderInfoSync();
//         sinon.assert.calledOnce(handlerSync);
//         sinon.assert.calledWith(handlerSync, "du -s ./*");
//         done();
//     });
// });

// describe("USBInfo", function() {
//     beforeEach(function() {
//         this.exec = sinon.stub(child, "exec");
//         this.execSync = sinon.stub(child, "execSync");
//     });

//     afterEach(function() {
//         child.exec.restore();
//         child.execSync.restore();
//     });
//     it("Async and Sync function returned the same result", function(done) {
//         var expectedResult = {
//             totalAvailableSpace: 1844910048 * 2,
//             drives: [
//                 {
//                     name: "/share/USB1",
//                     size: 1844910048,
//                     index: 1
//                 },
//                 {
//                     name: "/share/USB5",
//                     size: 1844910048,
//                     index: 5
//                 }
//             ]
//         };
//         var rawResult =
//             "/dev/md1             8707701440 6859629320 1844910048  79% /share/SomeOtherFolder\n/mnt/dev1             8707701440 6859629320 1844910048  79% /share/USB1\n/mnt/dev2             8707701440 6859629320 1844910048  79% /share/USB5";
//         var handler = this.exec.callsArgWith(1, null, rawResult, null);
//         var handlerSync = this.execSync.returns(rawResult);
//         asustor.usbInfo(function(error, data) {
//             expect(asustor.usbInfoSync()).to.be.deep.equal(data);
//             sinon.assert.calledOnce(handler);
//             sinon.assert.calledOnce(handlerSync);
//             sinon.assert.calledWith(handler, "df -P | awk 'NR > 1'");
//             sinon.assert.calledWith(handlerSync, "df -P | awk 'NR > 1'");
//             done();
//         });
//     });
//     it("Async function return empty if no callback function is passed as param", function(done) {
//         var rawResult =
//             "/dev/md1             8707701440 6859629320 1844910048  79% /share/SomeOtherFolder\n/mnt/dev1             8707701440 6859629320 1844910048  79% /share/USB1\n/mnt/dev2             8707701440 6859629320 1844910048  79% /share/USB5";
//         var handler = this.exec.callsArgWith(1, null, rawResult, null);
//         asustor.usbInfo();
//         sinon.assert.calledOnce(handler);
//         sinon.assert.calledWith(handler, "df -P | awk 'NR > 1'");
//         done();
//     });
//     it("Async function return empty if param passed is not a function", function(done) {
//         var rawResult =
//             "/dev/md1             8707701440 6859629320 1844910048  79% /share/SomeOtherFolder\n/mnt/dev1             8707701440 6859629320 1844910048  79% /share/USB1\n/mnt/dev2             8707701440 6859629320 1844910048  79% /share/USB5";
//         var handler = this.exec.callsArgWith(1, null, rawResult, null);
//         asustor.usbInfo("12345");
//         sinon.assert.calledOnce(handler);
//         sinon.assert.calledWith(handler, "df -P | awk 'NR > 1'");
//         done();
//     });
//     it("Async function return empty if param passed is not a function", function(done) {
//         var expectedError = new Error("Something happend that caused error");
//         expectedError.code = 1;
//         var expectedResult = {
//             totalAvailableSpace: 0,
//             drives: []
//         };
//         var rawResult = "";
//         var handler = this.exec.callsArgWith(1, expectedError, rawResult, null);
//         asustor.usbInfo(function(error, data) {
//             expect(expectedResult).to.be.deep.equal(data);
//             sinon.assert.calledOnce(handler);
//             sinon.assert.calledWith(handler, "df -P | awk 'NR > 1'");
//             done();
//         });
//     });
// });
