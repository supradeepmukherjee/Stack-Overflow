import { Permission } from "node-appwrite"
import { attachmentsBucket } from "../name"
import { storage } from "./config"

const getOrCreateStorage = async () => {
    try {
        await storage.getBucket(attachmentsBucket)
        console.log('Storage connected')
    } catch (err) {
        try {
            await storage.createBucket(
                attachmentsBucket,
                attachmentsBucket,
                [
                    Permission.read('any'),
                    Permission.create('users'),
                    Permission.read('users'),
                    Permission.update('users'),
                    Permission.delete('users'),
                ],
                false,
                undefined,
                undefined,
                ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic']
            )
            console.log('Storage Created & Connected')
        } catch (err) {
            console.log('Storage Creation Error', err)
        }
    }
}

export default getOrCreateStorage