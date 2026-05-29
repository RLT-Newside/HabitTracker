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
    <Modal open={open} onClose={onClose} title={editHabit ? 'Edit Habit' : 'New Habit'}>
      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Read 30 minutes"
            className="w-full mt-1.5 px-3.5 py-2.5 bg-white/5 rounded-xl text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Why this habit matters"
            rows={2}
            className="w-full mt-1.5 px-3.5 py-2.5 bg-white/5 rounded-xl text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[var(--color-brand)] resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Color</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {HABIT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Goals</label>
          <div className="space-y-3 mt-2">
            {goals.map((goal, i) => (
              <div key={goal.id} className="p-3 bg-white/5 rounded-xl space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {FREQUENCIES.filter(f => f === goal.frequency || !usedFreqs.has(f)).map(freq => (
                    <button
                      key={freq}
                      onClick={() => updateGoal(i, 'frequency', freq)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        goal.frequency === freq
                          ? 'bg-[var(--color-brand)] text-white'
                          : 'bg-white/5 text-white/40 hover:text-white/60'
                      }`}
                    >
                      {FREQUENCY_LABELS[freq]}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={goal.targetCount}
                    onChange={e => updateGoal(i, 'targetCount', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1.5 bg-white/8 rounded-lg text-center text-white font-semibold outline-none"
                  />
                  <span className="text-sm text-white/40">times / {goal.frequency.replace('ly', '')}</span>
                  {goals.length > 1 && (
                    <button onClick={() => removeGoal(i)} className="ml-auto text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
              </div>
            ))}
            {usedFreqs.size < 4 && (
              <button onClick={addGoal} className="text-sm text-[var(--color-brand)] font-medium hover:underline">+ Add Goal</button>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-3 bg-[var(--color-brand)] text-white rounded-xl font-semibold disabled:opacity-30 active:scale-[0.98] transition"
        >
          {editHabit ? 'Save Changes' : 'Create Habit'}
        </button>
      </div>
    </Modal>
  )
}
