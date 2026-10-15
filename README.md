# Human Bridge

Human Bridge is a small, local-first web app for turning the wish to connect
into a manageable human step. It offers low-pressure suggestions, editable
message starters, and optional plans saved in the current browser.

The project is designed to support human connection—not imitate it.

## Features

- Choose what kind of support would help and see practical suggestions.
- Draft and copy a message. The app never sends messages.
- Save, remove, export, or delete plans stored in the browser.
- Use the app without an account, API key, backend, or AI service.
- Run from a simple local Python web server.

## Requirements

- Python 3
- A modern web browser

No dependency installation is required.

## Run locally

From the repository root:

```bash
chmod +x scripts/dev.sh
./scripts/dev.sh

Open http://localhost:8000 in your browser. To use another port:

bash


PORT=8080 ./scripts/dev.sh
Data and privacy
Plans are stored in the browser's localStorage on the current device.
They are not uploaded by this application. Clearing browser site data may
remove them. Use Export my plans to save a copy before clearing them.

This project does not access contacts, send messages, create accounts, or call
third-party APIs. Do not use a shared device for private plans.