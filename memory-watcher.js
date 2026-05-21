const fs = require("fs");
const chokidar = require("chokidar");
const path = require("path");

const MEMORY_FILE = "./project_memory.json";

function updateMemory(fileChanged) {
  console.log("File changed:", fileChanged);

  let memory = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"));

  // simple update log (bisa kamu upgrade nanti ke AI analysis)
  memory.last_updated = new Date().toISOString();
  memory.last_changed_file = fileChanged;

  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));

  console.log("Memory updated ✔");
}

// watch project folder
chokidar.watch("./", {
  ignored: [
    "node_modules",
    ".git",
    "dist",
    "build"
  ],
  persistent: true
}).on("change", (filePath) => {
  updateMemory(filePath);
});