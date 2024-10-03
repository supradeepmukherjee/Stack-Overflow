const slugify = (t: string) =>
    String(t)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/[^\w\-]+/g, '') // remove non word characters
        .replace(/\-\-+/g, '-') // replace multiple - with single -

export default slugify