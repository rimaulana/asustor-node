import * as child from "child_process";

interface task {
    type: string;
    input: string;
}

interface usb {
    size: number;
    name: string;
    index: number;
}

interface usbList {
    drives: collection[];
    totalAvailableSpace: number;
}

interface file {
    path: string;
    size: number;
}

type collection = usb | file;

function getTotalSize(collection: collection[]): number {
    var total: number = 0;
    collection.map(function(item) {
        total += item.size;
    });
    return total;
}

function sanitizePath(type: string, input?: string): string {
    var result: string;
    if (type === "folder") {
        result = input || "./";
        result = result.endsWith("/") ? result + "*" : result + "/*";
    } else {
        result = input || ".";
        result = result.endsWith("/") ? result.slice(0, -1) : result;
    }
    return result;
}

function parser(params: task): Array<collection> {
    var result: Array<collection> = new Array();
    var raw: string[] = params.input.split("\n");
    var regex: RegExp = /^([0-9]+)(?:\s+)?(.*)$/;
    if (params.type === "usb") {
        regex = /^(?!(?:\/dev\/md[0-9]+))\S+\s+[0-9]+\s+[0-9]+\s+([0-9]+)\s+[0-9]+\%\s+(.+USB[0-9]+)$/;
    }
    // removing empty string
    raw = raw.filter(item => item.length > 0);

    // iterate on every elemen in raw
    raw.map(function(line) {
        var parse: string[] = line.match(regex);
        if (parse) {
            if (params.type === "usb") {
                result.push({
                    size: parseInt(parse[1]),
                    name: parse[2],
                    index: parseInt(parse[2].match(/.+([0-9]+)/)[1])
                });
            } else {
                result.push({
                    path: parse[2],
                    size: parseInt(parse[1])
                });
            }
        }
    });
    return result;
}

function usbInfo(callback: Function): void {
    child.exec("df -P | awk 'NR > 1'", (error, stdout, stderr) => {
        if (error) {
            callback(error, null);
        } else {
            var data = parser({
                type: "usb",
                input: stdout.toString()
            });
            callback(null, {
                totalAvailableSpace: getTotalSize(data),
                drives: data
            });
        }
    });
}

function usbInfoSync(): usbList {
    var result: usbList = {
        drives: new Array(),
        totalAvailableSpace: 0
    };
    try {
        var output = child.execSync("df -P | awk 'NR > 1'");
        result.drives = parser({
            type: "usb",
            input: output.toString()
        });
        result.totalAvailableSpace = getTotalSize(result.drives);
    } finally {
        return result;
    }
}
