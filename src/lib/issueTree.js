export function buildIssueTree(articles) {
  const years = new Map()

  for (const article of articles) {
    const yearKey = String(article.issue?.year ?? '未分類年份')
    const quarterKey = article.issue?.quarter ?? '未分類季度'
    const year = years.get(yearKey) ?? { label: yearKey, quarters: new Map() }
    const quarter = year.quarters.get(quarterKey) ?? {
      label: quarterKey,
      categories: new Map(),
    }
    const categories = article.categories?.length
      ? article.categories
      : [{ slug: 'uncategorized', title: '未分類' }]

    for (const category of categories) {
      const categoryEntry = quarter.categories.get(category.slug) ?? {
        label: category.title,
        articles: [],
      }
      categoryEntry.articles.push(article)
      quarter.categories.set(category.slug, categoryEntry)
    }

    year.quarters.set(quarterKey, quarter)
    years.set(yearKey, year)
  }

  return [...years.values()].map((year) => ({
    ...year,
    quarters: [...year.quarters.values()].map((quarter) => ({
      ...quarter,
      categories: [...quarter.categories.values()],
    })),
  }))
}
