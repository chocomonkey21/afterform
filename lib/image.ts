/** Client-side checks and loading for uploaded screenshots. Nothing here leaves the browser. */

export const MAX_BYTES = 10 * 1024 * 1024
export const MIN_WIDTH = 320
export const ACCEPT = ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"])
const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"])

export type UploadError = { title: string; detail: string }

export type LoadedImage = {
  url: string
  name: string
  width: number
  height: number
  bytes: number
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "")} MB`
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase()
}

function describeKind(file: File): string {
  const ext = extensionOf(file.name)
  if (ext) return ext.toUpperCase()
  if (file.type) return file.type.replace(/^\w+\//, "").toUpperCase()
  return "unknown"
}

/** Cheap checks that don't need decoding. Returns null when the file looks acceptable. */
export function validateFile(file: File): UploadError | null {
  const typeOk = ALLOWED_TYPES.has(file.type)
  // Some systems report an empty MIME type, so fall back to the extension.
  const extOk = ALLOWED_EXTENSIONS.has(extensionOf(file.name))
  if (!typeOk && !(file.type === "" && extOk)) {
    return {
      title: "That file type isn’t supported",
      detail: `“${file.name}” looks like a ${describeKind(file)} file. Use a PNG, JPG or WEBP screenshot.`,
    }
  }
  if (file.size === 0) {
    return { title: "That file is empty", detail: `“${file.name}” has no data. Try exporting the screenshot again.` }
  }
  if (file.size > MAX_BYTES) {
    return {
      title: "That screenshot is too large",
      detail: `“${file.name}” is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_BYTES)} — try exporting at 1× or as a JPG.`,
    }
  }
  return null
}

/** Decodes the file to confirm it's a real image and to read its dimensions. */
export function loadImage(file: File): Promise<LoadedImage | UploadError> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth < MIN_WIDTH) {
        URL.revokeObjectURL(url)
        resolve({
          title: "That screenshot is too small",
          detail: `“${file.name}” is ${img.naturalWidth}px wide. Use one at least ${MIN_WIDTH}px wide so there’s enough to explore.`,
        })
        return
      }
      resolve({ url, name: file.name, width: img.naturalWidth, height: img.naturalHeight, bytes: file.size })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        title: "We couldn’t read that image",
        detail: `“${file.name}” may be corrupted or not a real image. Try exporting it again.`,
      })
    }
    img.src = url
  })
}

export function isUploadError(value: LoadedImage | UploadError): value is UploadError {
  return "title" in value
}
