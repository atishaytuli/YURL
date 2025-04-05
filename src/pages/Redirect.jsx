import { storeClicks } from "@/db/apiClicks"
import { getLongUrl } from "@/db/apiUrls"
import useFetch from "@/hooks/use-fetch"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle } from "lucide-react"

const RedirectLink = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [redirectUrl, setRedirectUrl] = useState(null)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(5)

  // Fetch the original URL
  const { loading, data, fn: fetchUrl } = useFetch(getLongUrl, id)

  // Record the click and get the redirect URL
  const { fn: recordClick } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  })

  // Fetch the URL when component mounts
  useEffect(() => {
    if (id) {
      fetchUrl().catch((err) => {
        setError(err.message || "URL not found")
      })
    }
  }, [id])

  // Record click and prepare for redirect when data is loaded
  useEffect(() => {
    if (!loading && data && data.original_url) {
      recordClick()
        .then((url) => {
          setRedirectUrl(url)
        })
        .catch((err) => {
          console.error("Error recording click:", err)
          // Still set the redirect URL even if click recording fails
          let url = data.original_url
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url
          }
          setRedirectUrl(url)
        })
    }
  }, [loading, data])

  // Countdown and redirect
  useEffect(() => {
    if (redirectUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = redirectUrl
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [redirectUrl])

  // Handle manual redirect
  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  // Handle going back to home
  const handleGoHome = () => {
    navigate("/")
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Link Not Found</h1>
        <p className="text-gray-600 mb-6 text-center text-sm sm:text-base max-w-md">
          The URL you're trying to access doesn't exist or has been removed.
        </p>
        <Button onClick={handleGoHome}>Go to Homepage</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <BarLoader width={"100%"} color="#36d7b7" className="mb-6" />

      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Redirecting you...</h1>

      {redirectUrl && (
        <>
          <p className="text-gray-600 mb-6 text-center text-sm sm:text-base max-w-md">
            You are being redirected to:
            <br />
            <span className="font-medium break-all">{redirectUrl}</span>
          </p>
          <p className="text-gray-600 mb-4 text-center">
            Redirecting in <span className="font-bold">{countdown}</span> seconds...
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button onClick={handleManualRedirect} className="flex items-center justify-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Go Now
            </Button>

            <Button variant="outline" onClick={handleGoHome}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default RedirectLink

