"use client"

import { useState } from "react"
import { formatRelative } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Pencil, Check, X } from "lucide-react"
import { useSession } from "next-auth/react"

interface Note {
  id: string
  content: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
}

interface NotesPanelProps {
  leadId: string
  initialNotes: Note[]
}

export function NotesPanel({ leadId, initialNotes }: NotesPanelProps) {
  const { data: session } = useSession()
  const [notes, setNotes] = useState(initialNotes)
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  async function addNote() {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, leadId }),
      })
      if (!res.ok) throw new Error("Failed")
      const note = await res.json()
      setNotes((n) => [note, ...n])
      setContent("")
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" })
    setNotes((n) => n.filter((note) => note.id !== id))
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    })
    if (!res.ok) return
    const updated = await res.json()
    setNotes((n) => n.map((note) => (note.id === id ? updated : note)))
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <Button size="sm" onClick={addNote} loading={submitting} disabled={!content.trim()}>
          Add Note
        </Button>
      </div>

      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No notes yet.</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                  {note.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-xs font-medium text-gray-700">{note.user.name ?? "Unknown"}</span>
                <span className="text-xs text-gray-400">{formatRelative(note.createdAt)}</span>
              </div>
              {(session?.user?.id === note.user.id || session?.user?.role === "ADMIN") && (
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingId(note.id); setEditContent(note.content) }}
                    className="rounded p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="rounded p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            {editingId === note.id ? (
              <div className="mt-2 space-y-2">
                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(note.id)} className="text-green-600 hover:text-green-700">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
