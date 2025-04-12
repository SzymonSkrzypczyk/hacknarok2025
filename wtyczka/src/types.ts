interface ScrappedData {
  app: string

  /** Fullname */
  accountName: string

  /** Post's publish date */
  date: string

  content: string

  link: string

  stats: {
    likesCount: number
    viewsCount: number
    commentsCount: number
  }
}
