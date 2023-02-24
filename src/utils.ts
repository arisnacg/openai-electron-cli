import Box from "cli-box"
import { createSpinner, Spinner } from "nanospinner"
import inquirer from "inquirer";
import { exec, ExecOptions } from "child_process"

const execCommand = (command: string, options?: ExecOptions): Promise<string | Buffer> => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)
      resolve(stdout)
    })
  })
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


export { execCommand, createTextBox, startSpinner, createPrompt }