import fs from "fs"
import { createSpinner } from "nanospinner"
import { Command } from "commander"
import { exec } from "child_process"

const program = new Command()
program
  .name("OpenAI Electron CLI")
  .description(`OpenAI Electron Generator Command Line Tool`)
  .version("1.0.0")

// set the prompt from user input
program
  .command("install")
  .description("Install all depedencies")
  .action(() => {
    const dir = "./electron_app"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const spinner = createSpinner("Install depedencies...").start()
    exec('electron-forge init', {
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
      spinner.success({
        text: "Depedencies installed"
      })
    })
  });

// set the prompt from user input
program
  .command("set-prompt")
  .description("Set prompt for OpenAI")
  .argument("<string>", "OpenAI prompt string")
  .action((str: string) => {
    if (!str) {
      console.error("🚨 Prompt is not allowed to be empty");
      process.exit(1);
    }
    fs.writeFileSync("prompt.txt", str);
  });

// read the prompt from user
program
  .command("get-prompt")
  .description("Get the prompt that setted for OpenAI")
  .action(() => {
    if (fs.existsSync("prompt.txt")) {
      const promptText = fs.readFileSync("prompt.txt").toString()
      console.log(promptText)
    }
    else {
      console.error("🚨 Prompt is empty. Set the prompt first");
      process.exit(1);
    }
  });

// run the generated app
program
  .command("run")
  .description("Run the generated electron app")
  .action(() => {
    if (fs.existsSync("prompt.txt")) {
      exec('electron-forge start', {
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
    } else {
      console.error("🚨 Set the prompt first");
      process.exit(1);
    }
  });

interface CommandMakeOptions {
  output: string
}

// run the generated app
program
  .command("make")
  .description("Make the generated electron app")
  .requiredOption('-o, --output <path>', 'Path to store executable file')
  .action((options: CommandMakeOptions) => {
    if (fs.existsSync("prompt.txt")) {
      const { output } = options
      exec(`cp -r electron_app/out ${output}`, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          return;
        }
        if (stderr) {
          console.error(error);
          return;
        }
      });
      // exec('electron-forge make --platform=linux', {
      //   cwd: './electron_app'
      // }, (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(error);
      //     return;
      //   }
      //   if (stderr) {
      //     console.error(error);
      //     return;
      //   }
      //   const { output } = options
      //   exec(`touch ${output}/test.txt`)
      // });
    } else {
      console.error("🚨 Set the prompt first");
      process.exit(1);
    }
  });

program.parse()