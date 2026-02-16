import React from 'react'
import Board from '../components/Board'

const Home = () => {
  return (
    <div>
        <Board lastMove={null} player="white" fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
    </div>
  )
}

export default Home