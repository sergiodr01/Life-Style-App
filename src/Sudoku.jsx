import { useState, useEffect } from 'react'
import './Sudoku.css'

function Sudoku() {
  const [sudoku, setSudoku] = useState(null)
  const [solution, setSolution] = useState(null)
  const [board, setBoard] = useState(null)
  const [streak, setStreak] = useState(0)
  const [lastCompletedDate, setLastCompletedDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Cargar streak al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('sudokuStreak')
    if (saved) {
      const data = JSON.parse(saved)
      setStreak(data.streak)
      setLastCompletedDate(data.lastDate)
    }
    fetchSudoku()
  }, [])

  // Traer sudoku de la API o usar uno de prueba
  const fetchSudoku = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    
    // Sudoku de prueba (funciona localmente sin API)
    const testSudoku = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
    
    const testSolution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]
    
    try {
      // Intentar obtener de la API
      const response = await fetch('https://sudoku-api.herokuapp.com/api/dosuku')
      const data = await response.json()

      console.log('Respuesta de la API:', data)

      if (data.newboard && data.newboard.value && data.newboard.solution) {
        setSudoku(data.newboard.value)
        setSolution(data.newboard.solution)
        setBoard(JSON.parse(JSON.stringify(data.newboard.value)))
        setError('')
      } else {
        // Si la API falla, usar sudoku de prueba
        console.log('API no respondió correctamente, usando sudoku de prueba')
        setSudoku(testSudoku)
        setSolution(testSolution)
        setBoard(JSON.parse(JSON.stringify(testSudoku)))
      }
    } catch (error) {
      // Si hay error de conexión, usar sudoku de prueba
      console.log('Error en API, usando sudoku de prueba:', error)
      setSudoku(testSudoku)
      setSolution(testSolution)
      setBoard(JSON.parse(JSON.stringify(testSudoku)))
    }
    
    setLoading(false)
  }

  // Cambiar valor en una celda
  const handleCellChange = (row, col, value) => {
    if (board) {
      const newBoard = JSON.parse(JSON.stringify(board))
      newBoard[row][col] = value === '' ? 0 : parseInt(value)
      setBoard(newBoard)
    }
  }

  // Verificar si el sudoku está correcto
  const checkSolution = () => {
    if (!board || !solution) return

    // Comparar con la solución
    let isCorrect = true
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== solution[i][j]) {
          isCorrect = false
          break
        }
      }
      if (!isCorrect) break
    }

    if (isCorrect) {
      // Actualizar racha
      const today = new Date().toDateString()
      let newStreak = streak
      if (lastCompletedDate && lastCompletedDate !== today) {
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
        if (lastCompletedDate === yesterday) {
          newStreak += 1
        } else {
          newStreak = 1
        }
      } else if (!lastCompletedDate) {
        newStreak = 1
      }

      setStreak(newStreak)
      setLastCompletedDate(today)
      localStorage.setItem('sudokuStreak', JSON.stringify({ streak: newStreak, lastDate: today }))
      setMessage(`¡Correcto! 🎉 Racha: ${newStreak} día${newStreak > 1 ? 's' : ''}`)
    } else {
      setMessage('❌ Aún hay errores. Sigue intentando.')
    }
  }

  // Nuevo sudoku
  const handleNewSudoku = () => {
    setBoard(null)
    setMessage('')
    fetchSudoku()
  }

  return (
    <div className="sudoku-container">
      <h2>Sudoku del Día</h2>
      <p className="streak">🔥 Racha: {streak} día{streak !== 1 ? 's' : ''}</p>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Cargando sudoku...</p>
      ) : board ? (
        <div>
          <div className="sudoku-board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="sudoku-row">
                {row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="number"
                    min="0"
                    max="9"
                    className={`sudoku-cell ${sudoku[rowIndex][colIndex] !== 0 ? 'filled' : ''}`}
                    value={cell === 0 ? '' : cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    disabled={sudoku[rowIndex][colIndex] !== 0}
                  />
                ))}
              </div>
            ))}
          </div>

          {message && <p className={`message ${message.includes('Correcto') ? 'success' : 'error'}`}>{message}</p>}

          <div className="sudoku-buttons">
            <button onClick={checkSolution}>Verificar Sudoku</button>
            <button onClick={handleNewSudoku}>Nuevo Sudoku</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Sudoku
