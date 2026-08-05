import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="text-7xl font-semibold text-blue-700">404</div>
      <h1 className="mt-4 text-3xl font-semibold text-slate-950">Page not found</h1>
      <p className="mt-3 max-w-xl text-slate-600">The page you’re looking for may have moved or no longer exists. Return to the home page to continue exploring our AI programs and consulting services.</p>
      <Link to="/" className="mt-8 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Go Back Home</Link>
    </div>
  )
}
