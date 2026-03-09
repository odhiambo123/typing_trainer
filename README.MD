# 🚀 Odhis Typing Trainer: K8s Edition

A specialized typing trainer designed to build muscle memory for **Kubernetes (CKA/LFS158)** commands and Linux syntax. This project is optimized for a lightweight Docker environment on macOS.

---

## 🛠 Project Overview
This application pulls dynamic command sets from a generated JSON file and tracks typing speed (Words Per Minute) and accuracy. It is specifically calibrated to help move from a **10 WPM baseline** to a **17 WPM target** for professional terminal proficiency.

### Core Features
* **Dynamic Command Generation:** Uses a Python engine to create permutations of `kubectl` syntax.
* **Live-Reload Environment:** Leverages Docker Volume Mounting for instant code updates.
* **System Reset:** Includes a `_FACTORY_RESET` feature to clear `localStorage` and start fresh.

---

## 🐳 Docker Setup & Deployment

The app runs on an Nginx web server. By using volume mounting, any changes you make to `index.html`, `app.js`, or `practice_data.json` on your iMac are reflected immediately in the browser.

### 1. Launch the Container
Run this command from your terminal inside the `typing_trainer` directory:

```bash
docker run -d \
  --name typing-trainer \
  -p 8080:80 \
  -v $(pwd):/usr/share/nginx/html \
  nginx:latest



  ### 🔄 Updating Practice Data
The command list is dynamic. To update the exercise set (e.g., adding new Kubernetes modules from LFS158), follow this workflow:

1. **Modify the Generator:** Open `generate_data.py` and update the `verbs`, `targets`, or `flags` arrays.
2. **Execute the Script:**
   ```bash
   python3 generate_data.py


   ---

### **Markdown for "Useful Docker Operations"**

```markdown
### 📟 Essential Docker Commands
Use these commands to manage the lifecycle of your Typing Trainer container.

| Command | Description |
| :--- | :--- |
| `docker ps` | **Status Check:** See if the trainer is currently running and on which port. |
| `docker stop typing-trainer` | **Pause:** Stops the container without deleting it. Use this when finished training. |
| `docker start typing-trainer` | **Resume:** Restarts a stopped container. |
| `docker restart typing-trainer` | **Reload:** Restarts the service (useful if the Nginx config hangs). |
| `docker logs -f typing-trainer` | **Debug:** Watch live traffic logs to see if JSON files are loading correctly. |
| `docker rm -f typing-trainer` | **Wipe:** Deletes the container. Use this if you need to change the port (e.g., from 8080 to 9000). |
| `docker exec -it typing-trainer bash` | **Terminal Access:** "Step inside" the container to inspect the `/usr/share/nginx/html` folder. |