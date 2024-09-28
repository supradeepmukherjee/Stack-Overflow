const env = {
    appwrite: {
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
        id: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
        key: String(process.env.APPWRITE_KEY)
    }
}

export default env