import { HeroParallax } from "@/components/ui/hero-parallax"
import { attachmentsBucket, db as dbName, questionCollection } from "@/models/name"
import { db } from "@/models/server/config"
import { Query } from "node-appwrite"
import HeroHeader from "./HeroHeader"
import slugify from "@/utils/slugify"
import { storage } from "@/models/client/config"

const Hero = async () => {
  const ques = await db.listDocuments(dbName, questionCollection, [Query.orderDesc('$createdAt'), Query.limit(15)])
  return <HeroParallax
    header={<HeroHeader />}
    products={
      ques.documents.map(q => ({
        title: q.title,
        link: `/ques/${q.$id}/${slugify(q.title)}`,
        thumbnail: storage.getFilePreview(attachmentsBucket, q.attachmentID).href
      }))
    }
  />
}

export default Hero