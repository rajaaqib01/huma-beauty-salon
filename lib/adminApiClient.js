/** Max raw image size before base64 JSON overhead (~6mb API limit). */
export const MAX_ADMIN_IMAGE_BYTES = 3.5 * 1024 * 1024

export function validateAdminImageFile(file) {
  if (!file) return null
  if (!file.type.startsWith('image/')) {
    return 'Please choose an image file (JPG, PNG, WEBP, GIF).'
  }
  if (file.size > MAX_ADMIN_IMAGE_BYTES) {
    return 'Image must be smaller than 3.5MB. Try a smaller photo or paste an image link instead.'
  }
  return null
}

export async function readApiJson(res) {
  const text = await res.text()
  if (!text) {
    return {}
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(text.slice(0, 160) || `Request failed (${res.status})`)
  }
}
