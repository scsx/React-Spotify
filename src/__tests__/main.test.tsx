import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import App from '../App'
import { TokenProvider } from '../contexts/TokenContext'

test('renders the app element', () => {
  const { getByTestId } = render(
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  )

  const appElement = getByTestId('app')
  expect(appElement).toBeInTheDocument()
})
