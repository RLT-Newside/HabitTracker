import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Habit, Goal, FrequencyType, HABIT_COLORS, FREQUENCY_LABELS } from '../../types'
import { Modal } from '../shared/Modal'

interface HabitFormProps {
  open: boolean
  onClose: () => void
  onSave: (habit: Habit) => void
  editHabit?: Habit | null
}

const FREQUENCIES: FrequencyType[] = ['daily', 'weekly', 'monthly', 'yearly']

export function HabitForm({ open, onClose, onSave, editHabit }: HabitFormProps) {
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
        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Read 30 minutes"
            className="w-full mt-2 px-4 py-3 bg-white/[0.04] rounded-xl text-[15px] text-white placeholder:text-white/15 outline-none border border-white/[0.04] focus:border-brand/50 transition-colors"
            autoFocus
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Why this habit matters"
            rows={2}
            className="w-full mt-2 px-4 py-3 bg-white/[0.04] rounded-xl text-[15px] text-white placeholder:text-white/15 outline-none border border-white/[0.04] focus:border-brand/50 resize-none transition-colors"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Color</label>
          <div className="flex flex-wrap gap-2.5 mt-3">
            {HABIT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-xl transition-all duration-200 ${
                  color === c ? 'scale-125 ring-2 ring-white/80 ring-offset-2 ring-offset-[#141414]' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Goals</label>
          <div className="space-y-3 mt-3">
            {goals.map((goal, i) => (
              <div key={goal.id} className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.04] space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {FREQUENCIES.filter(f => f === goal.frequency || !usedFreqs.has(f)).map(freq => (
                    <button
                      key={freq}
                      onClick={() => updateGoal(i, 'frequency', freq)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                        goal.frequency === freq
                          ? 'bg-brand text-white shadow-md shadow-brand/20'
                          : 'bg-white/[0.04] text-white/30 hover:text-white/50'
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
                    className="w-16 px-3 py-2 bg-white/[0.06] rounded-lg text-center text-white font-bold outline-none border border-white/[0.04] focus:border-brand/50"
                  />
                  <span className="text-xs text-white/25 font-medium">times per {goal.frequency.replace('ly', '')}</span>
                  {goals.length > 1 && (
                    <button onClick={() => removeGoal(i)} className="ml-auto text-[10px] font-semibold text-red-400/60 hover:text-red-400 uppercase tracking-wider">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            {usedFreqs.size < 4 && (
              <button onClick={addGoal} className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.08] text-xs font-semibold text-brand/70 hover:text-brand hover:border-brand/30 transition-all">
                + Add Goal
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3.5 bg-brand text-white rounded-2xl font-bold text-sm uppercase tracking-wider disabled:opacity-20 active:scale-[0.97] transition-all shadow-lg shadow-brand/20"
        >
          {editHabit ? 'Save Changes' : 'Create Habit'}
        </button>
      </div>
    </Modal>
  )
}
