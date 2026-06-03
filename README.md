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

## Touch mode execution

Touch mode workflows execute saved click/type/send/navigate steps in the browser.

### Run profile

`POST /run/{slug}`

Request body:

```json
{
  "prompt": "optional prompt text"
}
```

`prompt` is optional for touch mode; the workflow will still execute even when it is empty.

### Example

```bash
curl -X POST "http://localhost:3000/run/my-touch-profile" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"prompt":"Hello"}'
```

You can also call:

```bash
curl "http://localhost:3000/run/my-touch-profile?prompt=Hello" \
  -H "x-api-key: $API_KEY"
```

## JS mode execution

JS mode uses the JS engine and provider scripts instead of touch-based browser interactions.

### Main JS execution endpoints

- `POST /execute-js-direct` — execute a one-off custom JS script or provider command via API
- `POST /execute-js-ui` — execute JS through the app builder UI flow
- `POST /execute-js` — execute a saved JS profile by name

> Use `/execute-js-direct` for external JS-based execution from other services or scripts. This route is implemented in `server.js` and dispatches through the same JS action runtime used by the app.

### Direct provider execution via API

Use `POST /execute-js-direct` with `runMode: "provider"`.

```bash
curl -X POST "http://localhost:3000/execute-js-direct" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "runMode": "provider",
    "context": {
      "provider": "deepseek",
      "command": "prompt",
      "prompt": "Hello from JS mode",
      "credentials": {
        "email": "user@example.com",
        "password": "secret",
        "apiKey": ""
      }
    }
  }'
```

### Direct custom JS execution via API

Use `POST /execute-js-direct` with `runMode: "custom"`.

```bash
curl -X POST "http://localhost:3000/execute-js-direct" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "runMode": "custom",
    "script": "async function run(context) { return { success: true, prompt: context.prompt }; }",
    "context": {
      "prompt": "Hello from custom JS mode",
      "credentials": {"email":"","password":"","apiKey":""}
    }
  }'
```

### Saved JS profile execution

Use `POST /execute-js` with a profile name to run a saved JS profile.

```bash
curl -X POST "http://localhost:3000/execute-js" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "profile": "My JS Profile",
    "prompt": "Hello from saved JS profile"
  }'
```

### UI-driven JS execution

Use `POST /execute-js-ui` to execute JS through the app builder UI flow.

```bash
curl -X POST "http://localhost:3000/execute-js-ui" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "runMode": "provider",
    "context": {
      "provider": "deepseek",
      "command": "prompt",
      "prompt": "Hello from remote UI",
      "credentials": {
        "email": "user@example.com",
        "password": "secret",
        "apiKey": ""
      }
    }
  }'
```

### Notes

- `runMode` must be `provider` or `custom`
- `provider` and `command` are required when `runMode` is `provider`
- `prompt` is optional and is available in `context.prompt`
- `POST /execute-js-direct` and `POST /execute-js-ui` both route through the internal JS execution path
- `POST /execute-js` runs saved profiles with `workflowMode: js`

## Google provider support

This app now supports a `google` provider with the following commands:

- `login` — enter Google email and password on the sign-in page
- `2fa` — submit a 6-digit verification code when prompted

### Example direct provider login

```bash
curl -X POST "http://localhost:3000/execute-js-direct" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "runMode": "provider",
    "script": "",
    "context": {
      "provider": "google",
      "command": "login",
      "email": "your-email@gmail.com",
      "password": "your-password"
    }
  }'
```

### Google 2FA example

```bash
curl -X POST "http://localhost:3000/execute-js-direct" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "runMode": "provider",
    "script": "",
    "context": {
      "provider": "google",
      "command": "2fa",
      "code": "123456"
    }
  }'
```

## Postgres schema fix

If your database is already initialized and the `runs` table is missing the `workflow_mode` column, run this SQL:

```sql
ALTER TABLE runs ADD COLUMN IF NOT EXISTS workflow_mode text;
```

## Browser usage

The app can run Puppeteer in headless mode automatically when no X display is available. Use `PUPPETEER_HEADLESS=false` to force UI mode when an X server is present.
