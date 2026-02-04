/*
Inicializa o LokiDB (ou JSON).
Guarda e lê jobs.
Atualiza estado/progresso.
Salva resultados grandes em ficheiros e mantém só o caminho no DB.
*/

const path = require('path')
const fs = require('fs')
const Loki = require('lokijs')

// Ajusta estes caminhos se preferires outro local
const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const DB_PATH = path.join(DATA_DIR, 'library.db')
const RESULTS_DIR = path.join(DATA_DIR, 'library')

let db
let jobs

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true })
}

function initStore() {
  ensureDirs()

  db = new Loki(DB_PATH, {
    autoload: true,
    autoloadCallback: () => {
      jobs = db.getCollection('jobs') || db.addCollection('jobs', { indices: ['id'] })
    },
    autosave: true,
    autosaveInterval: 5000,
  })
}

function createJob(job) {
  if (!jobs) initStore()
  return jobs.insert(job)
}

function updateJob(jobId, patch) {
  const job = jobs.findOne({ id: jobId })
  if (!job) return null
  Object.assign(job, patch)
  jobs.update(job)
  return job
}

function getJob(jobId) {
  if (!jobs) initStore()
  return jobs.findOne({ id: jobId })
}

function saveResult(jobId, data) {
  ensureDirs()
  const resultPath = path.join(RESULTS_DIR, `${jobId}.json`)
  fs.writeFileSync(resultPath, JSON.stringify(data), 'utf8')
  return resultPath
}

function getResult(jobId) {
  const resultPath = path.join(RESULTS_DIR, `${jobId}.json`)
  if (!fs.existsSync(resultPath)) return null
  const raw = fs.readFileSync(resultPath, 'utf8')
  return JSON.parse(raw)
}

module.exports = {
  initStore,
  createJob,
  updateJob,
  getJob,
  saveResult,
  getResult,
}
