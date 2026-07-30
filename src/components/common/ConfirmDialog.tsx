import { useEffect, useRef } from 'react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white backdrop:bg-black/60"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded bg-zinc-800 px-4 py-1.5 text-sm hover:bg-zinc-700"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className={`rounded px-4 py-1.5 text-sm text-white ${
            variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
