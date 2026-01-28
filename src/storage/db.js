const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "data", "db.json");

// Lê o arquivo e devolve um objeto JS
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    // se o arquivo não existir, cria um padrão
    const empty = { condutores: [], agentes: [], veiculos: [], multas: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(empty, null, 2), "utf-8");
    return empty;
  }

  const content = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(content);
}

// Salva um objeto JS no arquivo
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

module.exports = { loadDB, saveDB };
