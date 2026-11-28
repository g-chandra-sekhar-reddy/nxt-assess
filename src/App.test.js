import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {StrictMode} from 'react'
import {BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import App from './App'

const questionsResponse = {
  total: 1,
  questions: [
    {
      id: 'q1',
      options_type: 'DEFAULT',
      question_text: 'React JS is developed by?',
      options: [
        {id: 'o1', text: 'Facebook', is_correct: 'true'},
        {id: 'o2', text: 'Twitter', is_correct: 'false'},
      ],
    },
  ],
}

const successfulResponse = () => ({
  ok: true,
  json: () => Promise.resolve(questionsResponse),
})

const renderAssessment = () => {
  window.history.replaceState({}, '', '/assessment')
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
}

const renderAppAtPath = (path, history) => {
  window.history.replaceState({}, '', path)
  return render(
    <BrowserRouter>
      <App history={history} />
    </BrowserRouter>,
  )
}

describe('Assessment route', () => {
  let jwtToken

  beforeEach(() => {
    jwtToken = 'fake-token'
    vi.spyOn(Cookies, 'get').mockImplementation(() => jwtToken)
    vi.spyOn(Cookies, 'remove').mockImplementation(() => {
      jwtToken = undefined
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('renders questions after the request succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))

    renderAssessment()

    expect(
      await screen.findByText('React JS is developed by?'),
    ).toBeInTheDocument()
    expect(screen.getByAltText('website logo')).toBeInTheDocument()
  })

  it('can mount directly when no Router is provided by the caller', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))
    window.history.replaceState({}, '', '/assessment')

    render(<App />)

    expect(
      await screen.findByText('React JS is developed by?'),
    ).toBeInTheDocument()
  })

  it('shows the failure view and retries the questions request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ok: false})
      .mockResolvedValueOnce(successfulResponse())
    vi.stubGlobal('fetch', fetchMock)

    renderAssessment()

    expect(
      await screen.findByRole('heading', {name: 'Oops! Something Went Wrong'}),
    ).toBeInTheDocument()
    expect(screen.getByAltText('failure view')).toBeInTheDocument()
    expect(screen.getByText('We are having some trouble')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: 'Retry'}))

    expect(
      await screen.findByText('React JS is developed by?'),
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://apis.ccbp.in/assess/questions',
      expect.objectContaining({method: 'GET'}),
    )
  })

  it('counts down and navigates to the time-up results when time expires', async () => {
    vi.useFakeTimers({toFake: ['setInterval', 'clearInterval', 'Date']})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))

    renderAssessment()

    expect(await screen.findByText('00:10:00')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('00:09:59')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(599000)
    })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {name: 'Time is up!'}),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByText('You did not complete the assessment within the time'),
    ).toBeInTheDocument()
    expect(screen.getByAltText('time up')).toBeInTheDocument()
  })

  it.each(['/assessment', '/', '/results'])(
    'logs out from %s using history.replace and shows Login',
    async path => {
      const history = {replace: vi.fn()}
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))

      renderAppAtPath(path, history)

      fireEvent.click(await screen.findByRole('button', {name: 'Logout'}))

      expect(Cookies.remove).toHaveBeenCalledWith('jwt_token')
      expect(history.replace).toHaveBeenCalledWith('/login')
      expect(
        await screen.findByRole('button', {name: 'Login'}),
      ).toBeInTheDocument()
    },
  )

  it('shows the initial timer and a decreasing HH:MM:SS value', async () => {
    vi.useFakeTimers({toFake: ['setInterval', 'clearInterval', 'Date']})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))

    renderAssessment()

    expect(await screen.findByText('00:10:00')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('00:09:59')).toBeInTheDocument()
  })

  it('counts down when only interval timers are mocked', async () => {
    vi.useFakeTimers({toFake: ['setInterval', 'clearInterval']})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))

    renderAssessment()

    expect(await screen.findByText('00:10:00')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('00:09:59')).toBeInTheDocument()
  })

  it('decrements one second for each timer callback', async () => {
    let timerCallback
    vi.spyOn(globalThis, 'setInterval').mockImplementation(
      (callback, delay) => {
        if (delay === 1000) {
          timerCallback = callback
        }
        return 1
      },
    )
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))

    renderAssessment()

    expect(await screen.findByText('00:10:00')).toBeInTheDocument()
    act(() => {
      timerCallback()
    })
    expect(screen.getByText('00:09:59')).toBeInTheDocument()
  })

  it('starts the countdown after the questions request succeeds', async () => {
    vi.useFakeTimers({toFake: ['setInterval', 'clearInterval']})
    let resolveFetch
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise(resolve => {
            resolveFetch = resolve
          }),
      ),
    )
    renderAssessment()

    await act(async () => {
      resolveFetch(successfulResponse())
    })

    expect(
      await screen.findByText('React JS is developed by?'),
    ).toBeInTheDocument()
    expect(screen.getByText('00:10:00')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('00:09:59')).toBeInTheDocument()
  })

  it('keeps the countdown running when rendered in StrictMode', async () => {
    vi.useFakeTimers({toFake: ['setInterval', 'clearInterval', 'Date']})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successfulResponse()))
    window.history.replaceState({}, '', '/assessment')

    render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    )

    expect(
      await screen.findByText('React JS is developed by?'),
    ).toBeInTheDocument()
    expect(screen.getByText('00:10:00')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('00:09:59')).toBeInTheDocument()
  })
})
