import type { ReactNode } from 'react'

interface PrimaryButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function PrimaryButton({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: PrimaryButtonProps) {
  const variantClass =
    variant === 'secondary'
      ? 'border border-blue-200 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50'
      : 'bg-blue-600 text-white hover:bg-blue-700'

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 ${variantClass} ${className} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      {children}
    </button>
  )
}
