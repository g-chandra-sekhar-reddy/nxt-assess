import {useState, useEffect, useContext, useRef, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'
import Question from '../Question'
import AssessmentConfiguration from '../AssessmentConfiguration'
import EvaluationContext from '../../context/EvaluationContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
// 
// ghp_OMGwdIdiH0hyRsm2jhm1yG91rHBTiD10eJzK
const TOTAL_TIME_IN_SECONDS = 600 // 10 minutes

const Assessment = ({history, onLogout}) => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [questionsList, setQuestionsList] = useState([])
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_IN_SECONDS)

  const {setScore, setTimeTakenInSeconds, setIsTimeUp} =
    useContext(EvaluationContext)

  const navigate = useNavigate()
  const timerIdRef = useRef(null)
  const isSubmittedRef = useRef(false)
  const questionsListRef = useRef([])
  const userAnswersRef = useRef({})
  const timeRemainingRef = useRef(TOTAL_TIME_IN_SECONDS)

  questionsListRef.current = questionsList
  userAnswersRef.current = userAnswers

  const calculateScore = useCallback(() => {
    let score = 0
    const questions = questionsListRef.current
    const answers = userAnswersRef.current

    questions.forEach(question => {
      const selectedOptionId = answers[question.id]
      if (selectedOptionId) {
        const option = question.options.find(opt => opt.id === selectedOptionId)
        if (option && String(option.is_correct).toLowerCase() === 'true') {
          score += 1
        }
      }
    })
    return score
  }, [])

  const submitAssessment = useCallback(
    (isTimeExpired = false) => {
      if (isSubmittedRef.current) return
      isSubmittedRef.current = true

      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
        timerIdRef.current = null
      }

      const finalScore = calculateScore()
      const timeSpent = TOTAL_TIME_IN_SECONDS - timeRemainingRef.current

      setScore(finalScore)
      setTimeTakenInSeconds(timeSpent)
      setIsTimeUp(isTimeExpired)

      navigate('/results', {replace: true})
    },
    [calculateScore, navigate, setScore, setTimeTakenInSeconds, setIsTimeUp],
  )

  const startTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current)
    }

    timerIdRef.current = setInterval(() => {
      const nextTimeRemaining = Math.max(timeRemainingRef.current - 1, 0)
      timeRemainingRef.current = nextTimeRemaining
      setTimeRemaining(nextTimeRemaining)

      if (nextTimeRemaining === 0) {
        clearInterval(timerIdRef.current)
        timerIdRef.current = null
        submitAssessment(true)
      }
    }, 1000)
  }, [submitAssessment])

  const getQuestions = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const timerStartedAt = Date.now()
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok === true) {
        const data = await response.json()
        setQuestionsList(data.questions)
        setTotalQuestions(data.total)
        setCurrentQuestionIndex(0)
        setUserAnswers({})
        const elapsedSeconds = Math.floor((Date.now() - timerStartedAt) / 1000)
        const initialTimeRemaining = Math.max(
          TOTAL_TIME_IN_SECONDS - elapsedSeconds,
          0,
        )
        setTimeRemaining(initialTimeRemaining)
        timeRemainingRef.current = initialTimeRemaining
        isSubmittedRef.current = false
        setApiStatus(apiStatusConstants.success)
        startTimer()
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch {
      setApiStatus(apiStatusConstants.failure)
    }
  }, [startTimer])

  useEffect(() => {
    getQuestions()

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
    }
  }, [getQuestions])

  // Automatically select the first option for SINGLE_SELECT questions if not already answered
  useEffect(() => {
    if (
      apiStatus === apiStatusConstants.success &&
      questionsList.length > 0 &&
      currentQuestionIndex < questionsList.length
    ) {
      const currentQuestion = questionsList[currentQuestionIndex]
      const normalizedType = (currentQuestion.options_type || '')
        .replace('_', ' ')
        .toUpperCase()

      if (normalizedType === 'SINGLE SELECT') {
        setUserAnswers(prevAnswers => {
          if (prevAnswers[currentQuestion.id] === undefined) {
            const firstOptionId =
              currentQuestion.options.length > 0
                ? currentQuestion.options[0].id
                : undefined

            if (firstOptionId) {
              return {
                ...prevAnswers,
                [currentQuestion.id]: firstOptionId,
              }
            }
          }
          return prevAnswers
        })
      }
    }
  }, [apiStatus, currentQuestionIndex, questionsList])

  const onSelectOption = optionId => {
    const currentQuestion = questionsList[currentQuestionIndex]
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }))
  }

  const onNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const onSelectQuestionNumber = index => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
    }
  }

  const answeredCount = Object.keys(userAnswers).length
  const unansweredCount = totalQuestions - answeredCount

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader-spinner" role="status" aria-label="Loading" />
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">We are having some trouble</p>
      <button
        type="button"
        className="retry-button"
        onClick={() => getQuestions()}
      >
        Retry
      </button>
    </div>
  )

  const renderSuccessView = () => {
    if (questionsList.length === 0) return null

    const currentQuestion = questionsList[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1
    const selectedOptionId = userAnswers[currentQuestion.id]

    return (
      <div className="assessment-content-container">
        <Question
          questionDetails={currentQuestion}
          isLastQuestion={isLastQuestion}
          selectedOptionId={selectedOptionId}
          onSelectOption={onSelectOption}
          onNextQuestion={onNextQuestion}
        />
        <AssessmentConfiguration
          timeRemaining={timeRemaining}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          unansweredCount={unansweredCount}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          questionsList={questionsList}
          onSelectQuestion={onSelectQuestionNumber}
          onSubmitAssessment={() => submitAssessment(false)}
        />
      </div>
    )
  }

  const renderAssessmentView = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.success:
        return renderSuccessView()
      default:
        return null
    }
  }

  return (
    <>
      <Header history={history} onLogout={onLogout} />
      <div className="assessment-main-container">{renderAssessmentView()}</div>
    </>
  )
}

export default Assessment
