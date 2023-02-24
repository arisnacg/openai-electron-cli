"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrompt = exports.startSpinner = exports.createTextBox = exports.execCommand = void 0;
const cli_box_1 = __importDefault(require("cli-box"));
const nanospinner_1 = require("nanospinner");
const inquirer_1 = __importDefault(require("inquirer"));
const child_process_1 = require("child_process");
const execCommand = (command, options) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, options, (error, stdout, stderr) => {
            if (error)
                return reject(error);
            if (stderr)
                return reject(stderr);
            resolve(stdout);
        });
    });
};
exports.execCommand = execCommand;
const createTextBox = (text, width, height) => {
    const myBox = new cli_box_1.default({
        width,
        height,
        stringify: false,
        marks: {
            nw: '╭',
            n: '─',
            ne: '╮',
            e: '│',
            se: '╯',
            s: '─',
            sw: '╰',
            w: '│'
        }
    }, text);
    return myBox.stringify();
};
exports.createTextBox = createTextBox;
const startSpinner = (text) => {
    return (0, nanospinner_1.createSpinner)(text).start();
};
exports.startSpinner = startSpinner;
const createPrompt = (questions) => __awaiter(void 0, void 0, void 0, function* () {
    return yield inquirer_1.default.prompt(questions);
});
exports.createPrompt = createPrompt;
//# sourceMappingURL=utils.js.map