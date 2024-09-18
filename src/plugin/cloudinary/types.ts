export interface File {
  buffer: Buffer
  filename: string
  filesize: number
  mimeType: string
  tempFilePath?: string
}

export interface PluginOptions {
  /**
   * Example: 'tylle'
   */
  cloudName: string
  apiKey: string
  apiSecret: string
  uploadDir: string
}
