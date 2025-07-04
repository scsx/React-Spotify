import { BrowserRouter } from 'react-router-dom'

import { render } from '@testing-library/react'

import App from '../App'
import { TokenProvider } from '../contexts/AuthContext'

test('renders the app without errors', () => {
  render(
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  )
})
