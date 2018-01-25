import * as child from "child_process";

export interface task {
    type: string;
    input: string;
}

export interface usb {
    size: number;
    name: string;
    index: number;
}

export interface usbList {
    drives: collection[];
    totalAvailableSpace: number;
}

export interface file {
    path: string;
    size: number;
}

export type collection = usb | file;

function getTotalSize(collection: collection[]): number {
    var total: number = 0;
    collection.map(function(item) {
        total += item.size;
    });
    return total;
}

function sanitizePath(type: string, input?: string): string {
    var result: string = input || "./";
    if (type === "folder") {
        result = result.endsWith("/") ? result + "*" : result + "/*";
    } else {
        result = result.endsWith("/") ? result.slice(0, -1) : result;
    }
    return result;
}

function extract(regex: RegExp, input: string[]): RegExpMatchArray[] {
    var result: RegExpMatchArray[] = new Array();
    for (var i = 0; i < input.length; i++) {
        var parse = input[i].match(regex);
        if (parse) {
            result.push(parse);
        }
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

    // iterate on every element in raw
    raw.map(function(line) {
        var parse: RegExpMatchArray | null = line.match(regex);
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

export function usbInfo(callback: Function): void {
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

export function usbInfoSync(): usbList {
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
