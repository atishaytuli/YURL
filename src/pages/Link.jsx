import DeviceStats from "@/components/device-stats"
import Location from "@/components/location"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UrlState } from "@/context"
import { getClicksForUrl } from "@/db/apiClicks"
import { deleteUrl, getUrl } from "@/db/apiUrls"
import useFetch from "@/hooks/use-fetch"
import { Copy, Download, LinkIcon, Trash } from "lucide-react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BarLoader, BeatLoader } from "react-spinners"

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr
    const fileName = url?.title

    const anchor = document.createElement("a")
    anchor.href = imageUrl
    anchor.download = fileName

    document.body.appendChild(anchor)

    anchor.click()
    document.body.removeChild(anchor)
  }

  const navigate = useNavigate()
  const { user } = UrlState()
  const { id } = useParams()
  const { loading, data: url, fn, error } = useFetch(getUrl, { id, user_id: user?.id })

  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id)

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id)

  useEffect(() => {
    fn()
  }, [])

  useEffect(() => {
    if (!error && loading === false) fnStats()
  }, [loading, error])

  if (error) {
    navigate("/dashboard")
  }

  let link = ""
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url
  }

  return (
    <div className="p-4 sm:p-6">
      {(loading || loadingStats) && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Link details section */}
        <div className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-8 lg:w-2/5">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold hover:underline cursor-pointer line-clamp-2">
            {url?.title}
          </h1>

          <a
            href={`https://yurl.in/${link}`}
            target="_blank"
            className="text-xl sm:text-2xl lg:text-3xl text-blue-400 font-bold hover:underline cursor-pointer break-all"
            rel="noreferrer"
          >
            https://yurl.in/{link}
          </a>

          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer text-sm sm:text-base break-all"
            rel="noreferrer"
          >
            <LinkIcon className="flex-shrink-0 h-4 w-4" />
            <span className="line-clamp-2">{url?.original_url}</span>
          </a>

          <span className="flex items-end font-extralight text-xs sm:text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(`https://yurl.in/${link}`)}
              className="h-9 px-2 sm:h-10 sm:px-3"
            >
              <Copy className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Copy</span>
            </Button>

            <Button variant="ghost" onClick={downloadImage} className="h-9 px-2 sm:h-10 sm:px-3">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Download QR</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard")
                })
              }
              disabled={loadingDelete}
              className="h-9 px-2 sm:h-10 sm:px-3"
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <>
                  <Trash className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </>
              )}
            </Button>
          </div>

          <div className="w-full max-w-xs mx-auto lg:mx-0">
            <img
              src={url?.qr || "/placeholder.svg"}
              className="w-full ring ring-blue-500 p-1 object-contain rounded-md"
              alt="qr code"
            />
          </div>
        </div>

        {/* Stats section */}
        <Card className="lg:w-3/5 mt-6 lg:mt-0">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>

          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-2xl font-semibold">{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle className="text-lg sm:text-xl">Location Data</CardTitle>
              <Location stats={stats} />

              <CardTitle className="text-lg sm:text-xl">Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                {loadingStats === false ? "No Statistics yet" : "Loading Statistics.."}
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

export default LinkPage

