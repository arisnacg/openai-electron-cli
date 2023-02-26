const ELECTRON_APP_DIR = `${__dirname}/../electron_app`

const PROMPT_PATH = `${__dirname}/../prompt.txt`

const platformMap = new Map<string, string>()
platformMap.set("Linux", "linux")
platformMap.set("MacOs", "darwin")
platformMap.set("Windows", "win32")

export { platformMap, ELECTRON_APP_DIR, PROMPT_PATH }