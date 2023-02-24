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
exports.askPlatformQuestion = exports.exportSourceCode = exports.runSourceCode = exports.saveSourceCode = exports.generateSourceCode = exports.getPrompt = exports.setPrompt = exports.installElectronDepencies = void 0;
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
const openai_1 = require("openai");
const const_1 = require("./const");
const path_1 = __importDefault(require("path"));
const installElectronDepencies = () => __awaiter(void 0, void 0, void 0, function* () {
    const dir = "electron_app";
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir);
    }
    const spinner = (0, utils_1.startSpinner)("Install depedencies...").start();
    try {
        yield (0, utils_1.execCommand)('electron-forge init', {
            cwd: 'electron_app'
        });
        spinner.success({
            text: "Depedencies installed", mark: "✅"
        });
    }
    catch (err) {
        if (err instanceof Error) {
            const { message } = err;
            spinner.error({ text: message, mark: "🚨" });
            if (message.includes("electron-forge: not found")) {
                console.log("Run this command to fix it:");
                console.log((0, utils_1.createTextBox)(`npm install --global electron-forge`, 50, 3));
            }
            return;
        }
    }
});
exports.installElectronDepencies = installElectronDepencies;
const setPrompt = (str) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.resolve("prompt.txt");
    try {
        fs_1.default.writeFileSync(filePath, str);
    }
    catch (err) {
        throw err;
    }
});
exports.setPrompt = setPrompt;
const getPrompt = () => {
    try {
        return fs_1.default.readFileSync("prompt.txt").toString();
    }
    catch (err) {
        throw err;
    }
};
exports.getPrompt = getPrompt;
const generateSourceCode = (prompt, openaiKey) => __awaiter(void 0, void 0, void 0, function* () {
    const openaiModel = `text-davinci-003`;
    const spinner1 = (0, utils_1.startSpinner)(`Generate source code using OpenAI: ${openaiModel} model`).start();
    const configuration = new openai_1.Configuration({
        apiKey: openaiKey
    });
    const openai = new openai_1.OpenAIApi(configuration);
    const promptText = getPrompt();
    try {
        const completion = yield openai.createCompletion({
            model: openaiModel,
            prompt: promptText,
            max_tokens: 4000
        });
        spinner1.success({ text: "Source code generated successfully", mark: "✅" });
        const htmlText = completion.data.choices[0].text;
        return htmlText;
    }
    catch (err) {
        if (err instanceof Error) {
            spinner1.error({ text: err.message, mark: "🚨" });
        }
        else {
            spinner1.error({ text: "Unexpected error", mark: "🚨" });
        }
    }
});
exports.generateSourceCode = generateSourceCode;
const saveSourceCode = (sourceCode) => {
    const spinner2 = (0, utils_1.startSpinner)("Saving source code...").start();
    if (sourceCode) {
        const electronIndexHtmlPath = `electron_app/src/index.html`;
        fs_1.default.writeFileSync(electronIndexHtmlPath, sourceCode);
    }
    spinner2.success({ text: "Source code saved and application is ready to run", mark: "✅" });
};
exports.saveSourceCode = saveSourceCode;
const runSourceCode = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, utils_1.execCommand)('electron-forge start', {
        cwd: './electron_app'
    });
});
exports.runSourceCode = runSourceCode;
const exportSourceCode = (outputPath, platform) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, utils_1.startSpinner)(`Making the application for ${platform} (${const_1.platformMap.get(String(platform))})`)
        .update({ color: "green" })
        .start();
    const command = `electron-forge make --platform=${const_1.platformMap.get(String(platform))}`;
    try {
        yield (0, utils_1.execCommand)(command, {
            cwd: './electron_app'
        });
        yield (0, utils_1.execCommand)(`cp -r electron_app/out ${outputPath}`);
        spinner.success({ text: "Application packaged successfully", mark: "✅" });
    }
    catch (err) {
        if (err instanceof Error) {
            spinner.error({ text: err.message, mark: "🚨" });
        }
    }
});
exports.exportSourceCode = exportSourceCode;
const askPlatformQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield (0, utils_1.createPrompt)([
        {
            type: "list",
            name: "platform",
            message: 'What is your platform?',
            choices: [
                'Linux',
                'MacOS',
                'Windows'
            ]
        }
    ]);
    return answers.platform;
});
exports.askPlatformQuestion = askPlatformQuestion;
//# sourceMappingURL=lib.js.map