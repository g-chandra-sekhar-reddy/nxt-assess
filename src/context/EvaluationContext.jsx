import React, {useState, createContext} from 'react'

const EvaluationContext = createContext({
  score: 0,
  timeTakenInSeconds: 0,
  isTimeUp: false,
  setScore: () => {},
  setTimeTakenInSeconds: () => {},
  setIsTimeUp: () => {},
  resetEvaluation: () => {},
})

export const EvaluationProvider = ({children}) => {
  const [score, setScore] = useState(0)
  const [timeTakenInSeconds, setTimeTakenInSeconds] = useState(0)
  const [isTimeUp, setIsTimeUp] = useState(false)

  const resetEvaluation = () => {
    setScore(0)
    setTimeTakenInSeconds(0)
    setIsTimeUp(false)
  }

  return (
    <EvaluationContext.Provider
      value={{
        score,
        timeTakenInSeconds,
        isTimeUp,
        setScore,
        setTimeTakenInSeconds,
        setIsTimeUp,
        resetEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}

export default EvaluationContext
