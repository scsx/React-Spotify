import { render } from '@testing-library/react'

import { TokenProvider, useToken } from '../../contexts/AuthContext'

describe('TokenProvider', () => {
  it('provides the token value to the context', () => {
    const TestComponent = () => {
      const token = useToken()
      return <div data-testid="token">{token}</div>
    }

    const { getByTestId } = render(
      <TokenProvider>
        <TestComponent />
      </TokenProvider>
    )

    const tokenElement = getByTestId('token')
    expect(tokenElement.textContent).toBe('') // Initial value of token state is an empty string
  })
})
