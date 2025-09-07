# Squad MCP Server

A **Model Context Protocol (MCP) server** that connects _Squad_ — the AI‑powered product‑discovery and strategy platform — to any MCP‑aware large‑language‑model (LLM) application. It exposes a rich tool‑kit for creating, querying and updating product‑strategy artefacts (opportunities, solutions, outcomes, requirements, knowledge, workspaces and feedback) directly from your favourite AI co‑pilot.

This repository also contains the source code for the `@squadai/tools` NPM package, which provides the client-side tools for interacting with the Squad API.

## Why?

With the Squad MCP Server you can research, ideate and plan products in one conversational flow, without ever leaving your editor or chat window.

## ✨ Tools

| Tool prefix     | Purpose                                        | Typical actions      |
| --------------- | ---------------------------------------------- | -------------------- |
| opportunity\_\* | Discover and refine product opportunities      | create, list, update |
| solution\_\*    | Generate and iterate on solutions              | create, list, update |
| outcome\_\*     | Track desired business or user outcomes        | create, list         |
| knowledge\_\*   | Store useful references / research             | create, list         |
| workspace\_\*   | Manage Squad workspaces                        | get, update          |
| feedback\_\*    | Send customer or analytics feedback into Squad | create               |

Each tool conforms to the MCP JSON‑schema format so agents can introspect inputs and outputs automatically.

## 🚀 Quick start

### 1 · Obtain a Squad API key

1. Sign up / sign in at <https://meetsquad.ai>.
2. Open **Settings → Developer → API Keys**.
3. Create a key and copy the value.

### 2 · Run the server

Pick whichever installation method suits your environment.

#### Option A – Stand‑alone executable *(recommended for local usage)*

Download the latest binary for your operating system from the project’s [GitHub releases](https://github.com/the-basilisk-ai/squad-mcp/releases) page and run it directly:

```bash
# Windows
squad-mcp.exe

# macOS / Linux — make the file executable first
chmod +x squad-mcp
./squad-mcp
```

Pass environment variables in the usual way:

```bash
SQUAD_API_KEY=<your‑key> SQUAD_ENV=production ./squad-mcp
```

#### Option B – Docker *(recommended for production)*

```bash
# Build the image (once)
docker build -t mcp/meet-squad -f Dockerfile .

# Run the server on stdio
docker run --rm -i \
  -e SQUAD_API_KEY=<your‑key> \
  mcp/meet-squad
```

#### Option C – NPX _(recommended for easy setup)_

```bash
# Run directly with npx (no installation required)
SQUAD_API_KEY=<your‑key> npx @squadai/tools

# Or pass API key as command argument
npx @squadai/tools --api-key <your‑key>
```

#### Option C – From source

```bash
git clone https://github.com/the-basilisk-ai/squad-mcp.git
cd squad-mcp
npm install
npm run build           # transpiles to ./dist
node dist/index.js
```

---

## 📦 NPM Package (@squadai/tools)

This repository also includes an NPM package, `@squadai/tools`, which provides a set of functions for interacting with the Squad API programmatically from your own Node.js applications or scripts.

To install the package:

```bash
npm install @squadai/tools
# or
yarn add @squadai/tools
# or
pnpm add @squadai/tools
```

You can then import and use the tools in your code. You will still need a Squad API key or JWT for authentication (see Quick start section above).

Example usage (Vercel AI):

```typescript
import { generateText, tool } from "ai";
import { tools as squadTools } from "@squadai/tools";

const result = await generateText({
  model: yourModel,
  tools: squadTools({
    jwt: "JWT",
    orgId: "orgId",
    workspaceId: "workspaceId",
  }),
  prompt: "What is the weather in San Francisco?",
});
```

## ⚙️ Integrating with an MCP client

Add a _mcpServers_ entry to your client’s configuration (e.g. **claude_desktop_config.json** or **Cursor**). Adjust **command** to match the installation method.

### Using the stand‑alone executable

```jsonc
{
  "mcpServers": {
    "@squadai/tools": {
      "command": "C:/path/to/squad-mcp.exe",
      "env": {
        "SQUAD_API_KEY": "YOUR_API_KEY_HERE",
      },
    },
  },
}
```

### Using Docker

```jsonc
{
  "mcpServers": {
    "@squadai/tools": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "SQUAD_API_KEY", "mcp/meet-squad"],
      "env": {
        "SQUAD_API_KEY": "YOUR_API_KEY_HERE",
      },
    },
  },
}
```

### Using NPX

```jsonc
{
  "mcpServers": {
    "squad": {
      "command": "npx",
      "args": ["@squadai/tools"],
      "env": {
        "SQUAD_API_KEY": "YOUR_API_KEY_HERE",
      },
    },
  },
}
```

### Claude Code Integration

For [Claude Code](https://claude.ai/code), you can add the Squad MCP server using:

```bash
claude mcp add squad -e SQUAD_API_KEY=YOUR_API_KEY_HERE -- npx @squadai/tools
```

This will make Squad tools available in all your Claude Code sessions.

Once your client restarts you should see the Squad tools (hammer 🔨 icon) listed and ready for use.

## 🛠️ Environment variables

| Variable        | Required | Default      | Description                                                   |
| --------------- | -------- | ------------ | ------------------------------------------------------------- |
| `SQUAD_API_KEY` | Yes      | –            | Personal access token generated in Squad                      |
| `SQUAD_ENV`     | No       | `production` | Override the Squad API base URL (`staging`, `development`, …) |

## 🧑‍💻 Development

```bash
npm install
npm run format
npm run openapi:squad   # re‑generate typed client from openapi/squad.json
npm run build
node dist/index.js
```

The test suite is work‑in‑progress; contributions welcome.
