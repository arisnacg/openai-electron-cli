"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT_PATH = exports.ELECTRON_APP_DIR = exports.platformMap = void 0;
const ELECTRON_APP_DIR = `${__dirname}/../electron_app`;
exports.ELECTRON_APP_DIR = ELECTRON_APP_DIR;
const PROMPT_PATH = `${__dirname}/../prompt.txt`;
exports.PROMPT_PATH = PROMPT_PATH;
const platformMap = new Map();
exports.platformMap = platformMap;
platformMap.set("Linux", "linux");
platformMap.set("MacOs", "darwin");
platformMap.set("Windows", "win32");
//# sourceMappingURL=const.js.map