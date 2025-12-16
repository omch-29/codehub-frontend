# 🚀 CodeHub - A light-weight version control system

A powerful and lightweight command-line interface built for the **CodeHub Web Application**, allowing developers to add files, commit changes, and push code directly from their terminal — similar to Git, but simpler, faster, and fully integrated with the CodeHub backend.

🔗 **Live Web App:**   
https://main.dc5bs2bxp9e9j.amplifyapp.com/

## ✨ Features

- 📁 Initialize a CodeHub repository  
- ➕ Add single files or entire folders to staging  
- ✍️ Commit changes with messages  
- ☁️ Push code to the CodeHub cloud backend  
- 📦 Automatically uploads files to AWS S3  
- 🔒 Auto-ignores sensitive & unwanted files  
- ⚡ Extremely fast & beginner friendly  
- 🧩 Works inside any project folder  

---------

## 📦 Installation

Install globally from npm:

```bash
npm install -g codehub-ghx-cli
url of package on npm : https://www.npmjs.com/package/codehub-ghx-cli

| Commands                | Description                       |
| ------------------      | --------------------------------- |
| `ghx init <repolink> `  | Initialize a local CodeHub repo   |
| `ghx add <file>`        | Add a file to staging             |
| `ghx add .`             | Add all files except ignored ones |
| `ghx commit "msg"`      | Commit staged files               |
| `ghx push`              | Upload commit to CodeHub          |

Quick Start
1️⃣ Initialize a new CodeHub repo, user will be provided with repolink whenever they create repository.
ghx init <repo-link>

2️⃣ Add files:
Add a single file:
ghx add <file-name>

Add everything in the current folder:
ghx add .

3️⃣ Commit your changes
ghx commit "your commit message"

4️⃣ Push to CodeHub cloud
ghx push

📁 Ignored Files (Auto-Ignored)

The CLI automatically ignores the following when using ghx add .:

node_modules/
.git/
.codehub/
.env
Any .env inside subfolders
Any node_modules inside subfolders