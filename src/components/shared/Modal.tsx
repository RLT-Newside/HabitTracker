import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-[430px] max-h-[85vh] bg-[#141414] rounded-t-3xl overflow-y-auto animate-slide-up border-t border-white/[0.06]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04] sticky top-0 bg-[#141414]/95 backdrop-blur-md z-10">
          <h2 className="font-heading text-xl tracking-wide text-white/90">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 transition-all">
            <X size={16} className="text-white/40" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
