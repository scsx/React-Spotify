const path = require('path')
const fs = require('fs')
const Loki = require('lokijs')

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
    autosave: true,
    autosaveInterval: 5000,
  })

  jobs = db.getCollection('jobs') || db.addCollection('jobs', { indices: ['id'] })
}

function createJob(job) {
  if (!jobs) initStore()
  return jobs.insert(job)
}

function updateJob(jobId, patch) {
  if (!jobs) initStore()
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

  // Adiciona metadados
  const wrappedData = {
    meta: {
      syncedAt: new Date().toISOString(),
      playlistCount: data.playlists?.length || 0,
      totalTracks: data.playlists?.reduce((sum, pl) => sum + (pl.tracks?.length || 0), 0) || 0,
    },
    playlists: data.playlists || [],
    errors: data.errors || [],
  }

  fs.writeFileSync(resultPath, JSON.stringify(wrappedData), 'utf8')
  return resultPath
}

function getResult(jobId) {
  const resultPath = path.join(RESULTS_DIR, `${jobId}.json`)
  if (!fs.existsSync(resultPath)) return null
  const raw = fs.readFileSync(resultPath, 'utf8')
  return JSON.parse(raw)
}

function getAllJobs() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('DB_PATH não existe:', DB_PATH)
    return []
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8')
    const data = JSON.parse(raw)

    console.log('DB file - collections:', data.collections?.length)
    console.log('First collection:', data.collections?.[0]?.name)
    console.log('Jobs count:', data.collections?.[0]?.data?.length)

    if (data.collections && data.collections[0] && data.collections[0].data) {
      console.log('getAllJobs returning:', data.collections[0].data.length, 'jobs')
      return data.collections[0].data
    }
  } catch (e) {
    console.error('Error reading jobs:', e)
  }

  console.log('getAllJobs returning: 0 jobs')
  return []
}

module.exports = {
  initStore,
  createJob,
  updateJob,
  getJob,
  saveResult,
  getResult,
  getAllJobs,
}
