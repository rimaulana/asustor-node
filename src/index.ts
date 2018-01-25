import * as child from "child_process";

export interface collection {
    size: number;
    path: string;
    index?: number;
}

export interface usbList {
    drives: collection[];
    totalAvailableSpace: number;
}

export interface fileList {
    files: collection[];
    totalSize: number;
}

function getTotalSize(collection: collection[]): number {
    var total: number = 0;
    collection.map(function(item) {
        total += item.size;
    });
    return total;
}

function sanitizePath(type: string, input?: string): string {
    // by default all path are added backslash (/) at the end of it
    var result: string = (input || ".") + "/";
    // then we replace when double backslash with a backslash
    result = result.replace("//", "/");

    // if it is folder path, it needs to be added with asterisk (*)
    if (type === "folder") {
        result += "*";
    } else {
        // meanwhile, in file path, the trailing backslash needs to be removed
        result = result.slice(0, -1);
    }
    return result;
}

function extract(regex: RegExp, input: string[]): RegExpMatchArray[] {
    // initialize empty array as the default return value
    var result: RegExpMatchArray[] = new Array();

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

function formatData(type: string, input: RegExpMatchArray[]): collection[] {
    // initialize array for putting the result
    var result: collection[] = new Array();

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
        } else {
            result.push({
                size: parseInt(input[i][1]),
                path: input[i][2]
            });
        }
    }
    return result;
}

function parser(type: string, input: string): Array<collection> {
    // initialized all required variable, including default regex pattern that is going to be used.
    var result: Array<collection> = new Array();
    var regex: RegExp = /^([0-9]+)(?:\s+)?(.*)$/;

    // However, if the type of is usb, we need to change the regex pattern
    // for handling usb raw data.
    if (type === "usb") {
        regex = /^(?!(?:\/dev\/md[0-9]+))\S+\s+[0-9]+\s+[0-9]+\s+([0-9]+)\s+[0-9]+\%\s+(.+USB[0-9]+)$/;
    }

    // we need to split the input per line by split it with new character
    var raw: string[] = input.split("\n");

    // removing empty line
    raw = raw.filter(item => item.length > 0);

    // match each line with defined regex
    var parsedLine: RegExpMatchArray[] = extract(regex, raw);

    // prepare the data format based on its type
    result = formatData(type, parsedLine);

    return result;
}

function exec(command: string, type: string, callback: Function): void {
    child.exec(command, (error, stdout, stderr) => {
        if (error) {
            callback(error, null);
        } else {
            var data = parser(type, stdout.toString());
            var size: number = getTotalSize(data);
            if (type == "usb") {
                callback(null, {
                    totalAvailableSpace: size,
                    drives: data
                });
            } else {
                callback(null, {
                    totalSize: size,
                    files: data
                });
            }
        }
    });
}

function execFileSync(path: string, type: string): fileList {
    var result: fileList = {
        files: new Array(),
        totalSize: 0
    };
    try {
        var output = child.execSync("du -s " + sanitizePath(path));
        result.files = parser(type, output.toString());
        result.totalSize = getTotalSize(result.files);
    } finally {
        return result;
    }
}

export function usbInfo(callback: Function): void {
    exec("df -P | awk 'NR > 1'", "usb", callback);
}

export function fileInfo(fileName: string, callback: Function): void {
    exec("du -s " + sanitizePath("file", fileName), "file", callback);
}

export function folderInfo(folderName: string, callback: Function): void {
    exec("du -s " + sanitizePath("folder", folderName), "folder", callback);
}

export function usbInfoSync(): usbList {
    var result: usbList = {
        drives: new Array(),
        totalAvailableSpace: 0
    };
    try {
        var output = child.execSync("df -P | awk 'NR > 1'");
        result.drives = parser("usb", output.toString());
        result.totalAvailableSpace = getTotalSize(result.drives);
    } finally {
        return result;
    }
}

export function folderInfoSync(folderName: string): fileList {
    return execFileSync(folderName, "folder");
}

export function fileInfoSync(fileName: string): fileList {
    return execFileSync(fileName, "file");
}
