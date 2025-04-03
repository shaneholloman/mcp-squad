To build the docker image
```bash
docker build -t mcp/meet-squad -f Dockerfile .
```

To get started add this to your MCP config
```
{
  "mcpServers": {
    "meet-squad": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "-e",
        "SQUAD_API_KEY",
        "mcp/meet-squad"
      ],
      "env": {
        "SQUAD_API_KEY": "<your-squad-api-key>"
      }
    }
  }
}
```