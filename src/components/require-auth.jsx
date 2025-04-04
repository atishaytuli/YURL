import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { UrlState } from "@/context"
import { BarLoader } from "react-spinners"

function RequireAuth({ children }) {
  const navigate = useNavigate()
  const { loading, isAuthenticated } = UrlState()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth")
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BarLoader width={"100%"} color="#36d7b7" />
        <p className="mt-4 text-gray-500">Checking authentication...</p>
      </div>
    )
  }
  return isAuthenticated ? children : null
}

export default RequireAuth

