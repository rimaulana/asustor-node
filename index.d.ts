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
export declare function usbInfo(callback: Function): void;
export declare function fileInfo(fileName: string, callback: Function): void;
export declare function folderInfo(folderName: string, callback: Function): void;
export declare function usbInfoSync(): usbList;
export declare function folderInfoSync(folderName: string): fileList;
export declare function fileInfoSync(fileName: string): fileList;
