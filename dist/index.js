#! /usr/bin/env node
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const child_process_1 = require("child_process");
const openai_1 = require("openai");
const utils_1 = require("./utils");
const const_1 = require("./const");
const program = new commander_1.Command();
program
    .name("OpenAI Electron CLI")
    .description(`OpenAI Electron Generator Command Line Tool`)
    .version("1.0.0");
// set the prompt from user input
program
    .command("install")
    .description("Install all depedencies")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// set the prompt from user input
program
    .command("set-prompt")
    .description("Set prompt for OpenAI")
    .argument("<string>", "OpenAI prompt string")
    .action((str) => {
    if (!str) {
        console.error("🚨 Prompt is not allowed to be empty");
        process.exit(1);
    }
    const filePath = path_1.default.resolve("prompt.txt");
    fs_1.default.writeFileSync(filePath, str);
});
// read the prompt from user
program
    .command("get-prompt")
    .description("Get the prompt that setted for OpenAI")
    .action(() => {
    if (fs_1.default.existsSync("prompt.txt")) {
        const promptText = fs_1.default.readFileSync("prompt.txt").toString();
        console.log(promptText);
    }
    else {
        console.error("🚨 Prompt is empty. Set the prompt first");
        process.exit(1);
    }
});
program.command("generate-code")
    .description("Get generated code from OpenAI using the prompt")
    .requiredOption("--openai-key <api-key>, OpenAI API key")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const openaiModel = `text-davinci-003`;
    const spinner1 = (0, utils_1.startSpinner)(`Generate source code using OpenAI: ${openaiModel} model`).start();
    const { openaiKey } = options;
    const configuration = new openai_1.Configuration({
        apiKey: openaiKey
    });
    const openai = new openai_1.OpenAIApi(configuration);
    if (fs_1.default.existsSync("prompt.txt")) {
        const promptText = fs_1.default.readFileSync("prompt.txt").toString();
        try {
            const completion = yield openai.createCompletion({
                model: openaiModel,
                prompt: promptText,
                max_tokens: 4000
            });
            spinner1.success({ text: "Source code generated successfully", mark: "✅" });
            const htmlText = completion.data.choices[0].text;
            const spinner2 = (0, utils_1.startSpinner)("Saving source code...").start();
            if (htmlText) {
                const electronIndexHtmlPath = `electron_app/src/index.html`;
                fs_1.default.writeFileSync(electronIndexHtmlPath, htmlText);
            }
            spinner2.success({ text: "Source code saved and application is ready to run", mark: "✅" });
        }
        catch (err) {
            if (err instanceof Error) {
                spinner1.error({ text: err.message, mark: "🚨" });
            }
            else {
                spinner1.error({ text: "Unexpected error", mark: "🚨" });
            }
        }
    }
    else {
        console.error("🚨 Prompt is empty. Set the prompt first");
        process.exit(1);
    }
}));
// run the generated app
program
    .command("run")
    .description("Run the generated electron app")
    .action(() => {
    if (fs_1.default.existsSync("prompt.txt")) {
        (0, child_process_1.exec)('electron-forge start', {
            cwd: './electron_app'
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                return;
            }
            if (stderr) {
                console.error(error);
                return;
            }
            console.log(stdout);
        });
    }
    else {
        console.error("🚨 Set the prompt first");
        process.exit(1);
    }
});
// run the generated app
program
    .command("make")
    .description("Make the generated electron app")
    .requiredOption('-o, --output <path>', 'Path to store executable file')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync("prompt.txt")) {
        const { output } = options;
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
        const { platform } = answers;
        const spinner = (0, utils_1.startSpinner)(`Making the application for ${platform} (${const_1.platformMap.get(String(platform))})`)
            .update({ color: "green" })
            .start();
        (0, child_process_1.exec)(`electron-forge make --platform=${const_1.platformMap.get(String(platform))}`, {
            cwd: './electron_app'
        }, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                spinner.error({ text: err.message, mark: "🚨" });
                return;
            }
            if (stderr) {
                console.error(err);
                return;
            }
            (0, child_process_1.exec)(`cp -r electron_app/out ${output}`);
            spinner.success({ text: "Application packaged successfully", mark: "✅" });
        });
    }
    else {
        console.error("🚨 Set the prompt first");
        process.exit(1);
    }
}));
program.parse();
//# sourceMappingURL=index.js.map