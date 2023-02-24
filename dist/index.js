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
const commander_1 = require("commander");
const lib_1 = require("./lib");
const program = new commander_1.Command();
program
    .name("OpenAI Electron CLI")
    .description(`OpenAI Electron Generator Command Line Tool`)
    .version("1.0.0");
// install electron depedencies
program
    .command("install")
    .description("Install electron depedencies")
    .action(() => {
    (0, lib_1.installElectronDepencies)();
});
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
    (0, lib_1.setPrompt)(str);
});
// read the prompt from user
program
    .command("get-prompt")
    .description("Get the prompt that setted for OpenAI")
    .action(() => {
    if (fs_1.default.existsSync("prompt.txt")) {
        console.log((0, lib_1.getPrompt)());
    }
    else {
        console.error("🚨 Prompt is empty. Set the prompt first");
        process.exit(1);
    }
});
// generate code using openai API
program.command("generate-code")
    .description("Get generated code from OpenAI using the prompt")
    .requiredOption("--openai-key <api-key>, OpenAI API key")
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    const { openaiKey } = options;
    const sourceCode = yield (0, lib_1.generateSourceCode)((0, lib_1.getPrompt)(), openaiKey).catch(err => { throw err; });
    (0, lib_1.saveSourceCode)(sourceCode);
}));
// run the generated app
program
    .command("run")
    .description("Run the generated electron app")
    .action(() => {
    (0, lib_1.runSourceCode)();
});
// export the generated app
program
    .command("export")
    .description("Export the generated electron app")
    .requiredOption('-o, --output <path>', 'Path to store executable file')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync("prompt.txt")) {
        const { output } = options;
        const platform = yield (0, lib_1.askPlatformQuestion)();
        (0, lib_1.exportSourceCode)(output, platform);
    }
    else {
        console.error("🚨 Set the prompt first");
        process.exit(1);
    }
}));
program.parse();
//# sourceMappingURL=index.js.map