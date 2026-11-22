import { constants, existsSync } from 'node:fs'
import { copyFile, mkdir, mkdtemp, readFile, unlink, rmdir } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createServer } from 'vite'

// Match the pipeline used to create the original 248 English MP3 files.
const modelId = 'onnx-community/Kokoro-82M-v1.0-ONNX'
const modelOptions = { dtype: 'q8', device: 'cpu' }
const voiceOptions = { voice: 'af_heart', speed: 0.94 }
const root = resolve('public/listening/english')
const toolRoot = resolve(process.env.TOEIC_KOKORO_DIR ?? 'node_modules/.toeic-npm/neural-audio')
const verifyOnly = process.argv.includes('--verify-reference')
const planOnly = process.argv.includes('--plan')
const shardArgument = process.argv.find(argument => argument.startsWith('--shard=')) ?? '--shard=1/1'
const shard = /^--shard=([1-9]\d*)\/([1-9]\d*)$/.exec(shardArgument)
if (!shard || Number(shard[1]) > Number(shard[2])) throw new Error('Use --shard=<number>/<total>, starting at 1.')
const [, shardNumber, shardCount] = shard.map(Number)
const referenceIds = ['basic-word-book', 'basic-word-bus-sentence', 'basic-listen-where-bag', 'ipa-long-i']
const vite = await createServer({ server: { middlewareMode: true, ws: false, watch: null } })
const entries = new Map()

try {
  const { originalLearningClips } = await vite.ssrLoadModule('/src/data/learningAudioCatalog.ts')
  const { curriculumClips } = await vite.ssrLoadModule('/src/data/curriculum/audio.ts')
  const { normalizeLearningText } = await vite.ssrLoadModule('/src/data/learningAudio.ts')
  for (const { id, text: raw } of [...originalLearningClips, ...curriculumClips()]) {
    const text = normalizeLearningText(raw)
    if (!text || !/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid clip: ${id}`)
    if (entries.has(id) && entries.get(id) !== text) throw new Error(`Conflicting text for ${id}`)
    entries.set(id, text)
  }
} finally {
  await vite.close()
}

const pathFor = id => join(root, `${id}.mp3`)
const jobs = [...entries].filter(([id], index) => index % shardCount === shardNumber - 1 &&
  (verifyOnly ? referenceIds.includes(id) : !existsSync(pathFor(id))))
if (planOnly) {
  console.log(`${entries.size} registered clips, ${jobs.length} ${verifyOnly ? 'for comparison' : 'to render'}.`)
  process.exit(0)
}
if (!jobs.length) {
  console.log('All registered MP3 files exist.')
  process.exit(0)
}

const moduleFile = file => pathToFileURL(join(toolRoot, 'node_modules', file)).href
const { KokoroTTS } = await import(moduleFile('kokoro-js/dist/kokoro.js'))
const { env } = await import(moduleFile('@huggingface/transformers/dist/transformers.node.mjs'))
env.cacheDir = join(toolRoot, 'cache')
env.localModelPath = env.cacheDir
env.allowRemoteModels = !existsSync(join(env.cacheDir, modelId, 'onnx', 'model_quantized.onnx'))
env.backends.onnx.logLevel = 'error'
const model = await KokoroTTS.from_pretrained(modelId, modelOptions)
const bundledFFmpeg = join(toolRoot, 'node_modules', '@ffmpeg-installer', 'win32-x64', 'ffmpeg.exe')
const ffmpeg = process.env.TOEIC_FFMPEG ?? (existsSync(bundledFFmpeg) ? bundledFFmpeg : 'ffmpeg')

await mkdir(root, { recursive: true })
const scratch = await mkdtemp(join(toolRoot, 'render-'))
const wavePath = join(scratch, 'clip.wav')
const mp3Path = join(scratch, 'clip.mp3')

try {
  let count = 0
  for (const [id, text] of jobs) {
    const audio = await model.generate(text, voiceOptions)
    await audio.save(wavePath)
    const result = spawnSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-i', wavePath,
      '-vn', '-ac', '1', '-b:a', '64k', mp3Path], { encoding: 'utf8' })
    if (result.status !== 0) throw new Error(result.error?.message ?? result.stderr)
    const destination = pathFor(id)
    if (verifyOnly) {
      const rendered = await readFile(mp3Path)
      const reference = await readFile(destination)
      if (!rendered.equals(reference)) throw new Error(`Reference audio differs: ${id}`)
      console.log(`Reference matches byte for byte: ${id}`)
    } else {
      await copyFile(mp3Path, destination, constants.COPYFILE_EXCL)
    }
    count++
    if (count % 25 === 0 || count === jobs.length) console.log(`${count}/${jobs.length} clips ${verifyOnly ? 'verified' : 'rendered'}.`)
  }
} finally {
  for (const file of [wavePath, mp3Path]) if (existsSync(file)) await unlink(file)
  await rmdir(scratch)
}
