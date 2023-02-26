#! /usr/bin/env node
import fs from "fs"
import { Command } from "commander"
import {
  askPlatformQuestion,
  editSourceCode,
  exportSourceCode,
  generateSourceCode,
  getPrompt,
  installElectronDepencies,
  runSourceCode,
  runSourceCodeWebServer,
  saveSourceCode,
  setPrompt
} from "./lib"

const program = new Command()
program
  .name("OpenAI Electron CLI")
  .description(`OpenAI Electron Generator Command Line Tool`)
  .version("1.1.0")

// install electron depedencies
program
  .command("install")
  .description("Install electron depedencies")
  .action(() => {
    installElectronDepencies()
  });

// set the prompt from user input
program
  .command("set-prompt")
  .description("Set prompt for OpenAI")
  .argument("<string>",
    "OpenAI prompt string")
  .action((str: string) => {
    if (!str) {
      console.error("🚨 Prompt is not allowed to be empty");
      process.exit(1);
    }
    setPrompt(str)
  });

// read the prompt from user
program
  .command("get-prompt")
  .description("Get the prompt that setted for OpenAI")
  .action(() => {
    if (fs.existsSync("prompt.txt")) {
      console.log(getPrompt())
    }
    else {
      console.error("🚨 Prompt is empty. Set the prompt first");
      process.exit(1);
    }
  });

interface commandGenerateCodeOptions {
  openaiKey: string
}

// generate code using openai API
program.command("generate-code")
  .description("Get generated code from OpenAI using the prompt")
  .requiredOption("--openai-key <api-key>, OpenAI API key")
  .action(async (options: commandGenerateCodeOptions) => {
    const { openaiKey } = options
    const sourceCode = await generateSourceCode(getPrompt(), openaiKey).catch(err => { throw err })
    saveSourceCode(sourceCode)
  });

interface commandEditSourceCodeOptions {
  textEditor: string
}

// edit the generated source code
program.command("edit-code")
  .description("Edit generated code from OpenAI")
  .option("-T, --text-editor <text-editor>, text editor program (default: vim)")
  .action(async (options: commandEditSourceCodeOptions) => {
    editSourceCode(options.textEditor)
  });

// run the generated app
program
  .command("run")
  .description("Run the generated electron app")
  .action(() => {
    runSourceCode()
  });

// run the generated app on web browser
program
  .command("run-webserver")
  .description("Run the generated electron app")
  .action(() => {
    runSourceCodeWebServer()
  });


interface CommandMakeOptions {
  output: string
}

// export the generated app
program
  .command("export")
  .description("Export the generated electron app")
  .requiredOption('-o, --output <path>', 'Path to store executable file')
  .action(async (options: CommandMakeOptions) => {
    const { output } = options
    const platform = await askPlatformQuestion()
    exportSourceCode(output, platform)
  });

program.parse()