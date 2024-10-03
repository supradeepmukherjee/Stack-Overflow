import { answerCollection, db as dbName } from "@/models/name"
import { db, users } from "@/models/server/config"
import { UserPrefs } from "@/store/auth"
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"

export async function POST(req: NextRequest) {
    try {
        const { quesID, ans, authorID } = await req.json()
        const res = await db.createDocument(
            dbName,
            answerCollection,
            ID.unique(),
            {
                content: ans,
                authorID,
                quesID
            }
        )
        const { reputation } = await users.getPrefs<UserPrefs>(authorID)
        await users.updatePrefs(authorID, { reputation: reputation + 1 })
        return NextResponse.json(res, { status: 201 })
    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ err: err?.msg || 'Error creating answer' }, { status: err?.msg | err?.code || 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { ansID } = await req.json()
        const ans = await db.getDocument(dbName, answerCollection, ansID)
        const res = await db.deleteDocument(dbName, answerCollection, ansID)
        const { reputation } = await users.getPrefs<UserPrefs>(ans.authorID)
        await users.updatePrefs(ans.authorID, { reputation: reputation - 1 })
        return NextResponse.json({ data: res }, { status: 200 })
    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ err: err?.msg || 'Error deleting answer' }, { status: err?.msg | err?.code || 500 })
    }
}