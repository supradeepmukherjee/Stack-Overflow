import { db as dbName, questionCollection } from "@/models/name"
import { db } from "@/models/server/config"
import EditQues from "./EditQues"

const Edit = async (
  { params }:
    {
      params: {
        quesID: string
        quesName: string
      }
    }
) => {
  const ques = await db.getDocument(dbName, questionCollection, params.quesID)
  return <EditQues ques={ques} />
}

export default Edit