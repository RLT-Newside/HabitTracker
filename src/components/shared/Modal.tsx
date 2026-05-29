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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-[430px] max-h-[88vh] bg-[#131315] rounded-t-[28px] overflow-y-auto animate-sheet-up border-t border-white/[0.06] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.04] sticky top-0 bg-[#131315]/98 backdrop-blur-md z-10">
          <h2 className="font-heading text-[22px] tracking-wider text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-90 transition-all">
            <X size={16} className="text-white/50" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
