'use client'

import Editor from "@uiw/react-md-editor"
import dynamic from "next/dynamic"

const RTE = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), { ssr: false })

export const MDPreview = Editor.Markdown
export default RTE