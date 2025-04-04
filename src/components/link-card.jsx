import { useState } from "react"
import { Link } from "react-router-dom"
import { Copy, ExternalLink, QrCode, Trash } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteUrl } from "@/db/apiUrls"
import useFetch from "@/hooks/use-fetch"
import { Toast, } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const LinkCard = ({ url, fetchUrls }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { loading, fn: fnDelete } = useFetch(deleteUrl, url.id)

  // Handle URL deletion
  const handleDelete = async () => {
    try {
      await fnDelete()
      Toast,({
        title: "Success",
        description: "URL deleted successfully",
      })
      if (fetchUrls) fetchUrls()
    } catch (error) {
      Toast,({
        title: "Error",
        description: error.message || "Failed to delete URL",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // Copy short URL to clipboard
  const copyToClipboard = () => {
    const shortLink = url.custom_url || url.short_url
    const fullUrl = `https://yurl.in/${shortLink}`

    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        Toast,({
          title: "Copied!",
          description: "URL copied to clipboard",
        })
      })
      .catch(() => {
        Toast,({
          title: "Error",
          description: "Failed to copy URL",
          variant: "destructive",
        })
      })
  }

  // Format date
  const formattedDate = url.created_at ? format(new Date(url.created_at), "MMM d, yyyy") : ""

  // Get display URL
  const displayUrl = url.custom_url || url.short_url
  const shortUrl = `https://yurl.in/${displayUrl}`

  // Truncate long URLs
  const truncateUrl = (url, maxLength = 50) => {
    if (!url) return ""
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* QR Code Preview */}
          <div className="w-full md:w-32 h-32 bg-white flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
            <img src={url.qr || "/placeholder.svg"} alt="QR Code" className="h-24 w-24 object-contain" />
          </div>

          {/* URL Details */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <Link to={`/link/${url.id}`} className="text-xl font-bold hover:underline">
                {url.title}
              </Link>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>

            <div className="mb-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1"
              >
                {shortUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="text-gray-500 text-sm mb-4 break-all">{truncateUrl(url.original_url)}</div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex items-center">
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>

              <Button variant="outline" size="sm" asChild>
                <Link to={`/link/${url.id}`} className="flex items-center">
                  <QrCode className="h-3 w-3 mr-1" />
                  Details
                </Link>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center"
              >
                <Trash className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the URL "{url.title}" and all its statistics. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-red-500 hover:bg-red-600">
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default LinkCard

