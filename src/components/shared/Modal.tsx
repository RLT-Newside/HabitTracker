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
      <div className="absolute inset-0 bg-black/80 animate-fade-in" />
      <div
        className="relative w-full max-w-[430px] max-h-[85dvh] bg-[#131315] rounded-t-[24px] overflow-y-auto overscroll-contain animate-sheet-up border-t border-white/[0.06]"
        style={{ paddingBottom: 'max(20px, var(--safe-bottom))' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04] sticky top-0 bg-[#131315]/98 backdrop-blur-sm z-10">
          <h2 className="font-heading text-[20px] tracking-wider text-white">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] active:scale-90 active:bg-white/[0.08] transition-all">
            <X size={16} className="text-white/50" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
