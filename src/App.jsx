import { useState, useEffect } from 'react'
import './App.css'
import Sudoku from './Sudoku'

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits')
    return saved ? JSON.parse(saved) : []
  })
  const [newHabit, setNewHabit] = useState('')

  // Guardar hábitos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabit,
          completed: false
        }
      ])
      setNewHabit('')
    }
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const toggleHabit = (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id
        ? { ...habit, completed: !habit.completed }
        : habit
    )
    setHabits(updatedHabits)
  }

  return (
    <div className="app">
      <h1>Mi App de Hábitos</h1>

      <div className="add-habit">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Nuevo hábito"
        />
        <button onClick={addHabit}>Agregar</button>
      </div>

      <ul className="habits-list">
        {habits.map((habit) => (
          <li key={habit.id}>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(habit.id)}
            />

            <span className={habit.completed ? 'completed' : ''}>
              {habit.name}
            </span>

            <button onClick={() => deleteHabit(habit.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <Sudoku />
    </div>
  )
}

export default App