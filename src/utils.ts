import Box from "cli-box"
import { createSpinner, Spinner } from "nanospinner"
import inquirer from "inquirer";
import { exec, ExecOptions, spawn } from "child_process"

const execCommand = (command: string, options?: ExecOptions): Promise<string | Buffer> => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
}

const spawnCommand = (programName: string, options: string[]) => {
  return spawn(programName, options, { stdio: "inherit" })
}

const createTextBox = (text: string, width: number, height: number): string => {
  const myBox = new Box({
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
  return myBox.stringify()
}

const startSpinner = (text: string): Spinner => {
  return createSpinner(text).start()
}

const createPrompt = async (questions: inquirer.QuestionCollection<any>): Promise<any> => {
  return await inquirer.prompt(questions)
}


export { execCommand, spawnCommand, createTextBox, startSpinner, createPrompt }