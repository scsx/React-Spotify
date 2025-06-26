import { CSSProperties, ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

type TextProps = {
  children: ReactNode
  variant?: 'h1' | 'h3' | 'h4' | 'h6' | 'paragraph'
  color?: 'foreground' | 'muted' | 'primary' | 'gray'
  as?: 'p' | 'small' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
  style?: CSSProperties
}

const textStyles = tv({
  base: 'text-foreground',
  variants: {
    variant: {
      h1: 'text-3xl md:text-6xl font-semibold mb-6 tracking-wide',
      h2: '',
      h3: '',
      h4: 'text-xl font-medium leading-none',
      h5: '',
      h6: '',
      paragraph: 'text-sm leading-normal',
      small: '',
    },
    color: {
      foreground: 'text-foreground',
      muted: 'text-muted-foreground', // TODO: keep?
      primary: 'text-primary',
      gray: 'text-gray-500',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
    color: 'foreground',
  },
})

export default function Text({ children, variant, color, as = 'p', className, style }: TextProps) {
  const Component = as
  const combinedClasses = twMerge(textStyles({ variant, color }) + ' ' + className)

  return (
    <Component className={combinedClasses} style={style}>
      {children}
    </Component>
  )
}
