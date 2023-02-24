import { execCommand } from "./utils";

(async () => {
  try {
    const result = await execCommand("bitch -la")
    console.log(result)
  } catch (err) {
    if (err instanceof Error) {
      console.log("lol")
    }
  }
})()