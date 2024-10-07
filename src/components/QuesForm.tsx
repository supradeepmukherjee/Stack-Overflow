'use client'

import { db, storage } from "@/models/client/config"
import { attachmentsBucket, db as dbName, questionCollection } from "@/models/name"
import { useAuthStore } from "@/store/auth"
import { ID, Models } from "appwrite"
import { useRouter } from "next/router"
import { FormEvent, ReactNode, useState } from "react"
import { Confetti } from "./ui/confetti"
import slugify from "@/utils/slugify"
import { cn } from "@/lib/utils"
import Meteors from "./ui/meteors"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import RTE from "./RTE"
import { IconX } from "@tabler/icons-react"

const QuesForm = ({ ques }: { ques?: Models.Document }) => {
  const { user } = useAuthStore()
  const router = useRouter()
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  //
  const [formData, setFormData] = useState({
    title: ques?.title || '',
    content: ques?.title || '',
    authorID: user?.$id,
    tags: ques?.tags || [],
    attachment: null as File | null
  })
  const loadConfetti = (t = 3000) => {
    const end = Date.now() + t
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
    const confettiOptions = {
      colors: ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"],
      particleCount: 2,
      spread: 55,
      startVelocity: 60,
    }
    const frame = () => {
      if (Date.now() > end) return
      Confetti({
        ...confettiOptions,
        angle: 60,
        origin: {
          x: 0,
          y: .5
        },
      })
      Confetti({
        ...confettiOptions,
        angle: 120,
        origin: {
          x: 1,
          y: .5
        },
      })
      requestAnimationFrame(frame)
    }
    frame()
  }
  const create = async () => {
    if (!formData.attachment) throw new Error('Please upload an image')
    const storageRes = await storage.createFile(attachmentsBucket, ID.unique(), formData.attachment)
    const res = await db.createDocument(
      dbName,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorID: formData.authorID,
        tags: Array.from(formData.tags),
        attachmentID: storageRes.$id
      }
    )
    loadConfetti()
    return res
  }
  const update = async () => {
    if (!ques) throw new Error('Please provide a question')
    const attachmentID = await (async () => {
      if (!formData.attachment) return ques.attachmentID
      await storage.deleteFile(attachmentsBucket, ques.attachmentID)
      const file = await storage.createFile(attachmentsBucket, ID.unique(), formData.attachment)
      return file.$id
    })()
    const res = await db.updateDocument(
      dbName,
      questionCollection,
      ques.$id,
      {
        title: formData.title,
        content: formData.content,
        authorID: formData.authorID,
        tags: Array.from(formData.tags),
        attachmentID
      }
    )
    return res
  }
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // no need of checking for attachment as it's optional in updating
    if (!formData.title || !formData.content || !formData.authorID) return setError('Please fill out all the fields')
    setLoading(true)
    setError('')
    try {
      const res = ques ? await update() : await create()
      router.push(`/ques/${res.$id}/${slugify(formData.title)}`)
    } catch (err: any) {
      setError(err.msg)
    } finally {
      setLoading(false)
    }
  }
  return (
    <form className="space-y-4" onSubmit={submitHandler}>
      {error &&
        <LabelInputContainer>
          <div className="text-center">
            <span className="text-red-500">
              {error}
            </span>
          </div>
        </LabelInputContainer>
      }
      <LabelInputContainer>
        <Label htmlFor="title">
          Title
          <br />
          <small>
            Be specific & imagine you&apos;re asking a question to another person
          </small>
        </Label>
        <Input id='title' name='title' placeholder="eg. Is there any JS function for converting a multi-dimensional array to 1D array?" type='text' value={formData.title} onChange={e => setFormData(d => ({ ...d, title: e.target.value }))} />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="content">
          Details of your problem
          <br />
          <small>
            Introduce the problem and expand on what you put in the title. Minimum 20
            characters
          </small>
        </Label>
        <RTE value={formData.content} onChange={value => setFormData(d => ({ ...d, content: value || '' }))} />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="img">
          Image
          <br />
          <small>
            Add image to make it more clear & easier to understand
          </small>
        </Label>
        <Input
          id='img'
          name='img'
          accept="image/*"
          // placeholder="eg. Is there any JS function for converting a multi-dimensional array to 1D array?"
          type='file'
          onChange={e => {
            const files = e.target.files
            if (!files || files.length === 0) return
            setFormData(d => ({ ...d, attachment: files[0] }))
          }} />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="tag">
          Tags
          <br />
          <small>
            Add tags to describe what your question is about. Start typing to see
            suggestions
          </small>
        </Label>
        <div className="flex w-full gap-4">
          <div className="w-full">
            <Input id='tag' name='tag' placeholder="eg. javascript python c++" type="text" value={tag} onChange={e => setTag(e.target.value)} />
          </div>
          <button
            className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:shadow-2xl hover:shadow-white/[0.1]"
            type="button"
            onClick={() => {
              if (tag.length === 0) return
              setFormData(d => ({ ...d, tags: new Set([...Array.from(d.tags), tag]) }))
              setTag(() => '')
            }}
          >
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
            <span className="relative z-20">
              Add
            </span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                  <span>
                    {tag}
                  </span>
                  <button type="button" onClick={() => setFormData(d => ({ ...d, tags: new Set(Array.from(d.tags).filter(t => t !== tag)) }))}>
                    <IconX size={12} />
                  </button>
                </div>
                {/*  */}
                <span className="absolute bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent transition-opacity duration-500 group-hover:opacity-40" />
              </div>
            </div>
          ))}
        </div>
      </LabelInputContainer>
      {/*  */}
      <button disabled={loading} type={'submit'} className='inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
        {ques ? 'Update' : 'Publish'}
      </button>
    </form>
  )
}

const LabelInputContainer = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={cn('relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4', className)}>
    <Meteors number={30} />
    {children}
  </div>
)

export default QuesForm