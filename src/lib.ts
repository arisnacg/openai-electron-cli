import fs from "fs"
import { execCommand, startSpinner, createTextBox, createPrompt } from "./utils"
import { Configuration, OpenAIApi } from "openai"
import { platformMap } from "./const"
import path from "path"

const installElectronDepencies = async () => {

  const dir = "electron_app"
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const spinner = startSpinner("Install depedencies...").start()
  try {
    await execCommand('electron-forge init', {
      cwd: 'electron_app'
    })
    spinner.success({
      text: "Depedencies installed", mark: "✅"
    })
  } catch (err) {
    if (err instanceof Error) {
      const { message } = err
      spinner.error({ text: message, mark: "🚨" })
      if (message.includes("electron-forge: not found")) {
        console.log("Run this command to fix it:")
        console.log(createTextBox(`npm install --global electron-forge`, 50, 3))
      }
      return;
    }
  }
}

const setPrompt = async (str: string) => {
  const filePath = path.resolve("prompt.txt")
  try {
    fs.writeFileSync(filePath, str);
  } catch (err) {
    throw err
  }
}

const getPrompt = (): string => {
  try {
    return fs.readFileSync("prompt.txt").toString()
  } catch (err) {
    throw err
  }
}

const generateSourceCode = async (prompt: string, openaiKey: string): Promise<string | undefined> => {
  const openaiModel = `text-davinci-003`
  const spinner1 = startSpinner(`Generate source code using OpenAI: ${openaiModel} model`).start()
  const configuration = new Configuration({
    apiKey: openaiKey
  });
  const openai = new OpenAIApi(configuration);
  const promptText = getPrompt()
  try {
    const completion = await openai.createCompletion({
      model: openaiModel,
      prompt: promptText,
      max_tokens: 4000
    });
    spinner1.success({ text: "Source code generated successfully", mark: "✅" })
    const htmlText = completion.data.choices[0].text
    return htmlText
  } catch (err) {
    if (err instanceof Error) {
      spinner1.error({ text: err.message, mark: "🚨" })
    } else {
      spinner1.error({ text: "Unexpected error", mark: "🚨" })
    }
  }
}

const saveSourceCode = (sourceCode: string | undefined) => {
  const spinner2 = startSpinner("Saving source code...").start()
  if (sourceCode) {
    const electronIndexHtmlPath = `electron_app/src/index.html`
    fs.writeFileSync(electronIndexHtmlPath, sourceCode);
  }
  spinner2.success({ text: "Source code saved and application is ready to run", mark: "✅" })
}

const runSourceCode = async () => {
  return await execCommand('electron-forge start', {
    cwd: './electron_app'
  })
}

const exportSourceCode = async (outputPath: string, platform: string) => {
  const spinner = startSpinner(`Making the application for ${platform} (${platformMap.get(String(platform))})`)
    .update({ color: "green" })
    .start()
  const command = `electron-forge make --platform=${platformMap.get(String(platform))}`
  try {
    await execCommand(command, {
      cwd: './electron_app'
    })
    await execCommand(`cp -r electron_app/out ${outputPath}`)
    spinner.success({ text: "Application packaged successfully", mark: "✅" })
  } catch (err) {
    if (err instanceof Error) {
      spinner.error({ text: err.message, mark: "🚨" })
    }
  }
}

export { installElectronDepencies, setPrompt, getPrompt, generateSourceCode, saveSourceCode, runSourceCode, exportSourceCode }