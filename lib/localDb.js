import { promises as fs } from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

async function ensureDataDir(){
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (e) {
    // ignore
  }
}

async function readFile(name){
  await ensureDataDir()
  const file = path.join(dataDir, `${name}.json`)
  try {
    const txt = await fs.readFile(file, 'utf8')
    return JSON.parse(txt)
  } catch (e) {
    return []
  }
}

async function writeFile(name, data){
  await ensureDataDir()
  const file = path.join(dataDir, `${name}.json`)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8')
}

function genId(){
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`
}

export async function list(name){
  return await readFile(name)
}

export async function insert(name, item){
  const arr = await readFile(name)
  const obj = { id: item.id || genId(), ...item }
  arr.unshift(obj)
  await writeFile(name, arr)
  return obj
}

export async function update(name, id, patch){
  const arr = await readFile(name)
  const idx = arr.findIndex(x => String(x.id) === String(id))
  if(idx === -1) return null
  arr[idx] = { ...arr[idx], ...patch }
  await writeFile(name, arr)
  return arr[idx]
}

export async function remove(name, id){
  const arr = await readFile(name)
  const idx = arr.findIndex(x => String(x.id) === String(id))
  if(idx === -1) return false
  arr.splice(idx,1)
  await writeFile(name, arr)
  return true
}

export default { list, insert, update, remove }
