interface ScrappedXPost {
  app: string

  /** Fullname */
  author: string

  /** Post's publish date */
  date: string

  content: string

  link: string

  avatarURL: string

  stats: {
    likesCount: number
    viewsCount: number
    commentsCount: number
  }
}

interface APIRequest {
  expectedContent: string[]
  scrappedDataBatch: ScrappedXPost[]
}
