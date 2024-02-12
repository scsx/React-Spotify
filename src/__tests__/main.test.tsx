import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TokenProvider } from '../contexts/TokenContext'
import App from '../App'

test('renders the app without errors', () => {
  render(
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  )
})