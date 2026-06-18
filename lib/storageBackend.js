import { supabaseServer } from './supabaseServer'
import { isServerless } from './isServerless'
import { hasNetlifyBlobs } from './netlifyBlobsDb'
import { hasGithubStorage } from './githubDb'

export function getStorageBackend() {
  if (supabaseServer) return 'supabase'
  if (isServerless() && hasNetlifyBlobs()) return 'netlify-blobs'
  if (isServerless() && hasGithubStorage()) return 'github'
  return 'filesystem'
}

export function isProductionPersistentStorage() {
  return getStorageBackend() === 'supabase'
}
