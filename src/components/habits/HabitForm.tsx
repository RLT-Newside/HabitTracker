import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Habit, Goal, FrequencyType, HABIT_COLORS, FREQUENCY_LABELS } from '../../types'
import { Modal } from '../shared/Modal'
import { Trash2 } from 'lucide-react'

interface HabitFormProps {
  open: boolean
  onClose: () => void
  onSave: (habit: Habit) => void
  onDelete?: (id: string) => void
  editHabit?: Habit | null
}

const FREQUENCIES: FrequencyType[] = ['daily', 'weekly', 'monthly', 'yearly']

export function HabitForm({ open, onClose, onSave, onDelete, editHabit }: HabitFormProps) {
  const [name, setName] = useState(editHabit?.name || '')
  const [description, setDescription] = useState(editHabit?.description || '')
  const [color, setColor] = useState(editHabit?.color || HABIT_COLORS[0])
  const [goals, setGoals] = useState<Goal[]>(
    editHabit?.goals || [{ id: uuid(), frequency: 'daily', targetCount: 1 }]
  )

  function handleSave() {
    if (!name.trim()) return
    onSave({
      id: editHabit?.id || uuid(),
      name: name.trim(),
      description: description.trim(),
      icon: editHabit?.icon || 'check',
      color,
      sortOrder: editHabit?.sortOrder ?? 0,
      archived: editHabit?.archived ?? false,
      createdAt: editHabit?.createdAt || new Date().toISOString(),
      goals,
    })
    onClose()
  }

  const usedFreqs = new Set(goals.map(g => g.frequency))

  function addGoal() {
    const available = FREQUENCIES.filter(f => !usedFreqs.has(f))
    if (available.length === 0) return
    setGoals([...goals, { id: uuid(), frequency: available[0], targetCount: 1 }])
  }

  function updateGoal(index: number, field: keyof Goal, value: string | number) {
    const updated = [...goals]
    updated[index] = { ...updated[index], [field]: value }
    setGoals(updated)
  }

  function removeGoal(index: number) {
    if (goals.length <= 1) return
    setGoals(goals.filter((_, i) => i !== index))
  }

  return (
    <Modal open={open} onClose={onClose} title={editHabit ? 'EDIT HABIT' : 'NEW HABIT'}>
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Read 30 minutes"
            className="w-full mt-2 px-4 py-3.5 bg-white/[0.03] rounded-xl text-[15px] text-white placeholder:text-white/12 outline-none border border-white/[0.04] focus:border-[var(--color-brand)]/40 transition-all"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Why this habit matters"
            rows={2}
            className="w-full mt-2 px-4 py-3 bg-white/[0.03] rounded-xl text-[14px] text-white placeholder:text-white/12 outline-none border border-white/[0.04] focus:border-[var(--color-brand)]/40 resize-none transition-all"
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Color</label>
          <div className="flex flex-wrap gap-3 mt-3">
            {HABIT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-xl transition-all duration-200 ${
                  color === c
                    ? 'scale-[1.3] ring-[2.5px] ring-white/80 ring-offset-[3px] ring-offset-[#131315]'
                    : 'opacity-50 hover:opacity-80 hover:scale-110'
                }`}
                style={{ backgroundColor: c, boxShadow: color === c ? `0 4px 20px ${c}50` : undefined }}
              />
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Goals</label>
          <div className="space-y-3 mt-3">
            {goals.map((goal, i) => (
              <div key={goal.id} className="card p-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {FREQUENCIES.filter(f => f === goal.frequency || !usedFreqs.has(f)).map(freq => (
                    <button
                      key={freq}
                      onClick={() => updateGoal(i, 'frequency', freq)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                        goal.frequency === freq
                          ? 'bg-[var(--color-brand)] text-white shadow-[0_4px_12px_rgba(var(--color-brand-rgb),0.3)]'
                          : 'bg-white/[0.03] text-white/25 hover:text-white/40 border border-white/[0.04]'
                      }`}
                    >
                      {FREQUENCY_LABELS[freq]}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={goal.targetCount}
                    onChange={e => updateGoal(i, 'targetCount', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-[64px] px-3 py-2 bg-white/[0.04] rounded-lg text-center text-white font-black outline-none border border-white/[0.04] focus:border-[var(--color-brand)]/40"
                  />
                  <span className="text-[11px] text-white/20 font-medium">times per {goal.frequency.replace('ly', '')}</span>
                  {goals.length > 1 && (
                    <button onClick={() => removeGoal(i)} className="ml-auto text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-wider">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            {usedFreqs.size < 4 && (
              <button onClick={addGoal} className="w-full py-3 rounded-xl border border-dashed border-white/[0.06] text-[11px] font-bold text-[var(--color-brand)]/60 hover:text-[var(--color-brand)] hover:border-[var(--color-brand)]/30 transition-all uppercase tracking-[0.1em]">
                + Add Goal
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full py-4 bg-[var(--color-brand)] text-white rounded-2xl font-bold text-sm uppercase tracking-[0.15em] disabled:opacity-15 active:scale-[0.97] transition-all shadow-[0_8px_30px_rgba(var(--color-brand-rgb),0.25)]"
          >
            {editHabit ? 'Save Changes' : 'Create Habit'}
          </button>

          {editHabit && onDelete && (
            <button
              onClick={() => { onDelete(editHabit.id); onClose() }}
              className="w-full py-3 flex items-center justify-center gap-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all text-[12px] font-bold uppercase tracking-wider"
            >
              <Trash2 size={14} />
              Delete Habit
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
