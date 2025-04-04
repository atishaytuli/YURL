import { useEffect, useState } from "react"
import { BarLoader } from "react-spinners"
import { Filter, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreateLink } from "@/components/create-links"
import LinkCard from "@/components/link-card"
import Error from "@/components/error"
import { Button } from "@/components/ui/button"

import useFetch from "@/hooks/use-fetch"

import { getUrls } from "@/db/apiUrls"
import { getClicksForUrls } from "@/db/apiClicks"
import { UrlState } from "@/context"

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = UrlState()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { loading, error, data: urls, fn: fetchUrls } = useFetch(getUrls, user?.id)

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fetchClicks,
  } = useFetch(getClicksForUrls, urls?.map((url) => url.id) || [])

  // Fetch URLs when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchUrls()
    }
  }, [user?.id])

  // Fetch clicks when URLs are loaded
  useEffect(() => {
    if (urls?.length > 0) {
      fetchClicks()
    }
  }, [urls])

  // Filter URLs based on search query
  const filteredUrls = urls?.filter((url) => url.title.toLowerCase().includes(searchQuery.toLowerCase())) || []

  // Handle refresh
  const handleRefresh = () => {
    fetchUrls().then(() => {
      if (urls?.length > 0) {
        fetchClicks()
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Loading indicator */}
      {(loading || loadingClicks) && <BarLoader width={"100%"} color="#36d7b7" />}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{urls?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clicks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Header and create button */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading || loadingClicks}>
            Refresh
          </Button>
          <CreateLink isOpen={isCreateDialogOpen} setIsOpen={setIsCreateDialogOpen} onSuccess={fetchUrls} />
        </div>
      </div>

      {/* Search filter */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Filter className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
      </div>

      {/* Error message */}
      {error && <Error message={typeof error === "object" ? error.message : String(error)} />}

      {/* Empty state */}
      {!loading && filteredUrls.length === 0 && (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-1">No links found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "No links match your search query" : "Create your first shortened URL to get started"}
          </p>
          <Button variant="destructive" onClick={() => setIsCreateDialogOpen(true)}>
            Create New Link
          </Button>
        </div>
      )}

      {/* Link cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUrls.map((url) => (
          <LinkCard key={url.id} url={url} fetchUrls={fetchUrls} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard

