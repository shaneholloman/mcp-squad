# Squad MCP Server

A Model Context Protocol (MCP) server that connects [Squad](https://meetsquad.ai/) — the AI‑powered product discovery and strategy platform — to any MCP‑aware large‑language‑model (LLM) application. It exposes a rich tool‑kit for creating, querying and updating product strategy artefacts (opportunities, solutions, outcomes, requirements, knowledge, workspaces and feedback) directly from your favourite AI co-pilot.

> **Why?** With the Squad MCP Server you can **research**, **ideate** and **plan** products in one conversational flow, without ever leaving your editor or chat window.

---

## ✨ Tools

| Tool prefix | Purpose | Typical actions |
|-------------|---------|-----------------|
| **opportunity\_\*** | Discover and refine product opportunities | create, list, update |
| **solution\_\***   | Generate and iterate on solutions | create, list, update |
| **outcome\_\***    | Track desired business or user outcomes | create, list |
| **requirement\_\***| Capture detailed requirements | create, list |
| **knowledge\_\***  | Store useful references / research | create, list |
| **workspace\_\***  | Manage Squad workspaces | get, update |
| **feedback\_\***   | Send customer or analytics feedback into Squad | create |

Each tool conforms to the MCP JSON‑schema format so agents can introspect inputs and outputs automatically.

---

## 🚀 Quick start

### 1 · Obtain a Squad API key

1. Sign up or sign in at **[meetsquad.ai](https://meetsquad.ai/)**
2. Open **Settings → Developer → API Keys**
3. Create a key and copy the value

### 2 · Run the server

#### Option A – Docker (Recommended for production)

```bash
# Build the image (once)
docker build -t mcp/meet-squad -f Dockerfile .

# Run the server on stdio
docker run --rm -i \
  -e SQUAD_API_KEY=<your‑key> \
  mcp/meet-squad
```



#### Option B – From source

```bash
git clone https://github.com/the-basilisk-ai/squad-mcp.git
cd squad-mcp
npm install
npm run build           # transpiles to ./dist
node dist/index.js
```

---

## ⚙️ Integrating with an MCP client

Add the following snippet to your MCP application's configuration (e.g. **`claude_desktop_config.json`** or **Cursor**):

```jsonc
{
  "mcpServers": {
    "meet-squad": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "SQUAD_API_KEY",
        "mcp/meet-squad"
      ],
      "env": {
        "SQUAD_API_KEY": "YOUR_API_KEY_HERE",
        "SQUAD_ENV": "production"
      }
    }
  }
}
```

Prefer **`"command": "npx"`** if you installed via NPX.

Once your client restarts you should see the Squad tools (hammer 🔨 icon) listed and ready for use.

---

## 🛠️ Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SQUAD_API_KEY` | **Yes** | – | Personal access token generated in Squad |
| `SQUAD_ENV` | No | `production` | Override the Squad API base URL (`staging`, `development`.) |

---

## 🧑‍💻 Development

```bash
npm install
npm run format      
npm run openapi:squad # re‑generate typed client from openapi/squad.json
npm run build       
node dist/index.js
```

The test suite is work‑in‑progress; contributions welcome.

---
