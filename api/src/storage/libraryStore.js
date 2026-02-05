const path = require('path')
const fs = require('fs')

const DATA_DIR = path.join(__dirname, '..', '..', 'data')
const LIBRARY_DIR = path.join(DATA_DIR, 'library')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(LIBRARY_DIR)) fs.mkdirSync(LIBRARY_DIR, { recursive: true })
}

function initStore() {
  ensureDirs()
}

function createJob(job) {
  ensureDirs()
  const jobPath = path.join(LIBRARY_DIR, `${job.id}.json`)
  // Cria ficheiro com metadados iniciais
  const data = {
    id: job.id,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    meta: {
      syncedAt: null,
      playlistCount: 0,
      totalTracks: 0,
    },
    playlists: [],
    errors: [],
  }
  fs.writeFileSync(jobPath, JSON.stringify(data, null, 2), 'utf8')
  return job
}

function updateJob(jobId, patch) {
  ensureDirs()
  const jobPath = path.join(LIBRARY_DIR, `${jobId}.json`)

  if (!fs.existsSync(jobPath)) {
    console.error(`Job file not found: ${jobPath}`)
    return null
  }

  const raw = fs.readFileSync(jobPath, 'utf8')
  const data = JSON.parse(raw)

  // Atualiza apenas os campos de job (não playlists/errors)
  Object.assign(data, patch)

  fs.writeFileSync(jobPath, JSON.stringify(data, null, 2), 'utf8')
  return data
}

function getJob(jobId) {
  ensureDirs()
  const jobPath = path.join(LIBRARY_DIR, `${jobId}.json`)

  if (!fs.existsSync(jobPath)) return null

  try {
    const raw = fs.readFileSync(jobPath, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading job:', e)
    return null
  }
}

function saveResult(jobId, data) {
  ensureDirs()
  const jobPath = path.join(LIBRARY_DIR, `${jobId}.json`)

  if (!fs.existsSync(jobPath)) {
    console.error(`Job file not found: ${jobPath}`)
    return null
  }

  const raw = fs.readFileSync(jobPath, 'utf8')
  const jobData = JSON.parse(raw)

  // Atualiza o ficheiro com resultado completo
  jobData.meta = {
    syncedAt: new Date().toISOString(),
    playlistCount: data.playlists?.length || 0,
    totalTracks: data.playlists?.reduce((sum, pl) => sum + (pl.tracks?.length || 0), 0) || 0,
  }
  jobData.playlists = data.playlists || []
  jobData.errors = data.errors || []
  jobData.updatedAt = Date.now()

  fs.writeFileSync(jobPath, JSON.stringify(jobData, null, 2), 'utf8')
  return jobPath
}

function getResult(jobId) {
  const jobPath = path.join(LIBRARY_DIR, `${jobId}.json`)
  if (!fs.existsSync(jobPath)) return null
  try {
    const raw = fs.readFileSync(jobPath, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading result:', e)
    return null
  }
}

function getAllJobs() {
  ensureDirs()

  if (!fs.existsSync(LIBRARY_DIR)) {
    console.log('LIBRARY_DIR não existe:', LIBRARY_DIR)
    return []
  }

  try {
    const files = fs.readdirSync(LIBRARY_DIR).filter((f) => f.endsWith('.json'))

    if (files.length === 0) {
      console.log('No job files found in:', LIBRARY_DIR)
      return []
    }

    console.log(`Found ${files.length} JSON files in LIBRARY_DIR`)

    const jobs = []

    for (const filename of files) {
      try {
        const filePath = path.join(LIBRARY_DIR, filename)
        const raw = fs.readFileSync(filePath, 'utf8')
        const data = JSON.parse(raw)

        // Suporta ambas estruturas: antiga (só meta+playlists) e nova (com id/status/progress)
        if (data.id) {
          jobs.push({
            id: data.id,
            status: data.status || 'unknown',
            progress: data.progress || { completed: 0, total: 0 },
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
          })
          console.log(`[Job-New] ${data.id}: ${data.status}`)
        } else if (data.meta) {
          // Ficheiro antigo - extrai jobId do filename (sem .json)
          const jobId = filename.replace('.json', '')
          jobs.push({
            id: jobId,
            status: 'completed',
            progress: { completed: data.meta.totalTracks || 0, total: data.meta.totalTracks || 0 },
            createdAt: new Date(data.meta.syncedAt).getTime() || Date.now(),
            updatedAt: new Date(data.meta.syncedAt).getTime() || Date.now(),
          })
          console.log(`[Job-Old] ${jobId}: completed (${data.meta.totalTracks} tracks)`)
        } else {
          console.warn(`[Job-Unknown] ${filename}: no id or meta found`)
        }
      } catch (e) {
        console.error(`Error reading job file ${filename}:`, e.message)
      }
    }

    console.log(`getAllJobs returning: ${jobs.length} jobs`)
    return jobs
  } catch (e) {
    console.error('Error reading jobs directory:', e)
    return []
  }
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
