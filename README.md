# AIAgentBot

AIAgentBot is a browser automation backend using Puppeteer and provider-based scripts.

## Quick start

- Install dependencies: `npm install`
- Start server: `npm start`
- Set `API_KEY` or `BOT_API_KEY` for authenticated endpoints.

## API documentation

See `ENDPOINTS_GUIDE.md` for full API documentation, including:

- profile management (`/profiles`)
- automation execution (`/run`, `/browser/*`, `/execute-js`)
- JS mode profiles and provider script execution

## JS mode notes

Profiles saved with:

- `workflowMode: "js"`
- `scriptSource: "provider"`

will execute a provider command script (for example, `deepseek` + `prompt`).

Profiles saved with:

- `workflowMode: "js"`
- `scriptSource: "custom"`

will execute the custom JavaScript stored in `script`.

## Direct JS API usage

The app also supports direct JS execution without saving a profile using `/execute-js-direct`.

### Endpoint

`POST /execute-js-direct`

### Required headers

- `Content-Type: application/json`
- `x-api-key: your_api_key_here`

### Example body (provider script)

```json
{
  "runMode": "provider",
  "script": "",
  "context": {
    "provider": "deepseek",
    "command": "prompt",
    "prompt": "Hello from direct JS mode",
    "credentials": {
      "email": "user@example.com",
      "password": "secret",
      "apiKey": ""
    }
  }
}
```

### Example body (custom JS)

```json
{
  "runMode": "custom",
  "script": "async function run(context) { return { success: true, prompt: context.prompt }; }",
  "context": {
    "prompt": "Hello from custom JS mode",
    "credentials": {
      "email": "",
      "password": "",
      "apiKey": ""
    }
  }
}
```

### Notes

- `runMode` must be `provider` or `custom`
- `provider` and `command` are required for provider-based execution
- `prompt` is passed into the script context as `context.prompt`
- The response will contain the result from the executed script

## Browser usage

The app can run Puppeteer in headless mode automatically when no X display is available. Use `PUPPETEER_HEADLESS=false` to force UI mode when an X server is present.
