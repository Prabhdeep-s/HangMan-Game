import { useState } from 'react'
import './App.css'
import {languages} from './languages'
import { clsx } from 'clsx';
import { getFarewellText, getRandomWord } from './utils'
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const wrongGuesscCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameLost = (wrongGuesscCount >= (languages.length - 1))
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameOver = isGameWon || isGameLost

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
        isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
        <span key={index} className={letterClassName}>
            {shouldRevealLetter ? letter.toUpperCase() : ""}
        </span>
    )
  })

  const languageElements = languages.map((lang,index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (<span key={lang.name} className={`chip ${index<wrongGuesscCount?"lost":""}`} style={styles}>{lang.name}</span>)
  })

  function addGuessedLetter(letter) {
    setGuessedLetters(prev => prev.includes(letter) ? prev : [...prev, letter])
  }

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (<button className={className} key={letter} disabled={isGameOver} 
      aria-disabled={guessedLetters.includes(letter)} aria-label={`Letter ${letter}`}
      onClick={()=>addGuessedLetter(letter)}>{letter.toUpperCase()}</button>)
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameWon && !isGameLost && wrongGuesscCount!=0
  })

  const farewellText = wrongGuesscCount != 0? getFarewellText(languages[wrongGuesscCount-1].name): null

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  return (
    <main>
      {
        isGameWon && <Confetti recycle={false} numberOfPieces={1000}></Confetti>
      }
      <header>
        <h1>Assembly Hangman</h1>
        <p>Guess the word within 8 attempts to keep the 
         programming world safe from Assembly!</p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
          {isGameOver ? (
              isGameWon ? (
                  <>
                      <h2>You win!</h2>
                      <p>Well done! 🎉</p>
                  </>
              ) : (
                  <>
                      <h2>Game over!</h2>
                      <p>You lose! Better start learning Assembly 😭</p>
                  </>
              )
          ) : (
                  <p className='farewell-message'>{farewellText}</p>
              )
          }
      </section>
      <section className='language-chips'>
          {languageElements}
      </section>
      <section className='word'>
        {letterElements}
      </section>
      <section className='keyboard'>
        {keyboardElements}
      </section>
      <section 
          className="sr-only" 
          aria-live="polite" 
          role="status" >
          <p>Current word: {currentWord.split("").map(letter => 
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>
      </section>
      {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
    </main>
  )
}
