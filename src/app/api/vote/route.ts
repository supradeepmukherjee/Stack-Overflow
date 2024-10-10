import { answerCollection, db as dbName, questionCollection, voteCollection } from "@/models/name"
import { db, users } from "@/models/server/config"
import { UserPrefs } from "@/store/auth"
import { NextRequest, NextResponse } from "next/server"
import { ID, Query } from "node-appwrite"

export async function POST(req: NextRequest) {
    try {
        const { votedByID, voteStatus, type, typeID } = await req.json()
        const res = await db.listDocuments(dbName, voteCollection, [Query.equal('type', type), Query.equal('typeID', typeID), Query.equal('votedByID', votedByID),])
        if (res.documents.length > 0) {
            await db.deleteDocument(dbName, voteCollection, res.documents[0].$id)
            const quesOrAns = await db.getDocument(dbName, type === 'question' ? questionCollection : answerCollection, typeID)
            const authorPrefs = await users.getPrefs<UserPrefs>(quesOrAns.authorID)
            await users.updatePrefs<UserPrefs>(quesOrAns.authorID, { reputation: res.documents[0].voteStatus === 'upVoted' ? authorPrefs.reputation - 1 : authorPrefs.reputation + 1 })
        }
        if (res.documents[0]?.voteStatus !== voteStatus) { // means prev vote doesn't exist/vote status changes
            const quesOrAns = await db.getDocument(dbName, type === 'question' ? questionCollection : answerCollection, typeID)
            const doc = await db.createDocument(dbName, voteCollection, ID.unique(), { votedByID, voteStatus, type, typeID })
            const authorPrefs = await users.getPrefs<UserPrefs>(quesOrAns.authorID)
            if (res.documents[0]) await users.updatePrefs<UserPrefs>(quesOrAns.authorID, { reputation: res.documents[0].voteStatus === 'upVoted' ? authorPrefs.reputation - 1 : authorPrefs.reputation + 1 })
            else await users.updatePrefs<UserPrefs>(quesOrAns.authorID, { reputation: voteStatus === 'upVoted' ? authorPrefs.reputation - 1 : authorPrefs.reputation + 1 })
            const [upVotes, downVotes] = await Promise.all([
                db.listDocuments(dbName, voteCollection, [Query.equal('type', type), Query.equal('typeID', typeID), Query.equal('voteStatus', 'upVoted'), Query.equal('votedByID', votedByID), Query.limit(1)]),
                db.listDocuments(dbName, voteCollection, [Query.equal('type', type), Query.equal('typeID', typeID), Query.equal('voteStatus', 'downVoted'), Query.equal('votedByID', votedByID), Query.limit(1)]),
            ])
            return NextResponse.json(
                {
                    data: {
                        document: doc,
                        voteResult: upVotes.total - downVotes.total
                    },
                    msg: res.documents[0] ? 'Vote Updated' : 'Voted'
                },
                { status: 201 }
            )
        }
        const [upVotes, downVotes] = await Promise.all([
            db.listDocuments(dbName, voteCollection, [Query.equal('type', type), Query.equal('typeID', typeID), Query.equal('voteStatus', 'upVoted'), Query.equal('votedByID', votedByID), Query.limit(1)]),
            db.listDocuments(dbName, voteCollection, [Query.equal('type', type), Query.equal('typeID', typeID), Query.equal('voteStatus', 'downVoted'), Query.equal('votedByID', votedByID), Query.limit(1)]),
        ])
        return NextResponse.json(
            {
                data: {
                    document: null,
                    voteResult: upVotes.total - downVotes.total
                },
                msg: 'Vote Withdrawn'
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.log(err)
        return NextResponse.json(
            { err: err?.msg || 'Error in voting' },
            { status: err?.status | err?.code || 500 }
        )
    }
}