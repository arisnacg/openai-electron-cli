import fs from "fs"
import http from "http"
import { execCommand, startSpinner, createTextBox, createPrompt, spawnCommand } from "./utils"
import { Configuration, OpenAIApi } from "openai"
import { platformMap, ELECTRON_APP_DIR, PROMPT_PATH } from "./const"
import path from "path"
import { throws } from "assert"


const installElectronDepencies = async () => {

  if (!fs.existsSync(ELECTRON_APP_DIR)) {
    fs.mkdirSync(ELECTRON_APP_DIR);
  }
  const spinner = startSpinner("Install depedencies...").start()
  try {
    await execCommand('npx electron-forge init', {
      cwd: ELECTRON_APP_DIR
    })
    // delete .git folder of electron project
    // await execCommand(`rm -r .git`, { cwd: ELECTRON_APP_DIR })
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
  const filePath = path.resolve(PROMPT_PATH)
  try {
    fs.writeFileSync(filePath, str);
  } catch (err) {
    throw err
  }
}

const getPrompt = (): string => {
  try {
    return fs.readFileSync(PROMPT_PATH).toString()
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
    const electronIndexHtmlPath = `${ELECTRON_APP_DIR}/src/index.html`
    fs.writeFileSync(electronIndexHtmlPath, sourceCode);
  }
  spinner2.success({ text: "Source code saved and application is ready to run", mark: "✅" })
}

const editSourceCode = (textEditor: string) => {
  if (!textEditor)
    textEditor = "vim"
  spawnCommand(textEditor, [`${ELECTRON_APP_DIR}/src/index.html`])
}

const runSourceCode = async () => {
  try {

    await execCommand('npx electron-forge start', {
      cwd: ELECTRON_APP_DIR
    })
  } catch (err) {
    console.log(`🚨 Application get terminated`)
  }
}

const runSourceCodeWebServer = async () => {
  const server = http.createServer((req, res) => {
    const htmlText = fs.readFileSync(ELECTRON_APP_DIR + "/src/index.html")
    res.writeHead(200);
    res.end(htmlText);
  })
  server.listen(5000, () => {
    console.log(createTextBox(`Application run on http://localhost:5000`, 50, 3))
  })
}

const exportSourceCode = async (outputPath: string, platform: string) => {
  const spinner = startSpinner(`Making the application for ${platform} (${platformMap.get(String(platform))})`)
    .update({ color: "green" })
    .start()
  const command = `npx electron-forge make --platform=${platformMap.get(String(platform))}`
  try {
    await execCommand(command, {
      cwd: ELECTRON_APP_DIR
    })
    await execCommand(`cp -r ${ELECTRON_APP_DIR}/out ${outputPath}`)
    spinner.success({ text: "Application packaged successfully", mark: "✅" })
  } catch (err) {
    if (err instanceof Error) {
      spinner.error({ text: err.message, mark: "🚨" })
    }
  }
}

const askPlatformQuestion = async (): Promise<string> => {
  const answers: { platform: string } = await createPrompt([
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
  ])
  return answers.platform
}

export {
  installElectronDepencies,
  setPrompt,
  getPrompt,
  generateSourceCode,
  saveSourceCode,
  editSourceCode,
  runSourceCode,
  runSourceCodeWebServer,
  exportSourceCode,
  askPlatformQuestion
}