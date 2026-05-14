import { useState } from 'react'
import './App.css'

function App() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { name: newHabit, completed: false }])
      setNewHabit('')
    }
  }

  const toggleHabit = (index) => {
    const updatedHabits = habits.map((habit, i) =>
      i === index ? { ...habit, completed: !habit.completed } : habit
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
        {habits.map((habit, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(index)}
            />
            <span className={habit.completed ? 'completed' : ''}>{habit.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
