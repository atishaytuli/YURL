import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Filter, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateLink } from "@/components/create-links";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { UrlState } from "@/context";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    loading,
    error,
    data: urls,
    fn: fetchUrls,
  } = useFetch(getUrls, user?.id);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fetchClicks,
  } = useFetch(getClicksForUrls, urls?.map((url) => url.id) || []);

  // Fetch URLs when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchUrls();
    }
  }, [user?.id]);

  // Fetch clicks when URLs are loaded
  useEffect(() => {
    if (urls?.length > 0) {
      fetchClicks();
    }
  }, [urls]);

  // Filter URLs based on search query
  const filteredUrls =
    urls?.filter((url) =>
      url.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Handle refresh
  const handleRefresh = () => {
    fetchUrls().then(() => {
      if (urls?.length > 0) {
        fetchClicks();
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6">
      {/* Loading indicator */}
      {(loading || loadingClicks) && (
        <BarLoader width={"70%"} color="#36d7b7" />
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">
              {urls?.length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">
              {clicks?.length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header and create button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
          My Links
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || loadingClicks}
            className="flex items-center gap-1"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            New Link
          </Button>

          <CreateLink
            isOpen={isCreateDialogOpen}
            setIsOpen={setIsCreateDialogOpen}
            onSuccess={() => {
              fetchUrls();
              setIsCreateDialogOpen(false);
            }}
          />
        </div>
      </div>

      {/* Search filter */}
      <div className="relative mt-2">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Filter className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-gray-400" />
      </div>

      {/* Error message */}
      {error && (
        <Error
          message={typeof error === "object" ? error.message : String(error)}
        />
      )}

      {/* Empty state */}
      {!loading && filteredUrls.length === 0 && (
        <div className="text-center py-8 sm:py-10 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 mb-4">
            <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium mb-1">
            No links found
          </h3>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            {searchQuery
              ? "No links match your search query"
              : "Create your first shortened URL to get started"}
          </p>
          <Button
            variant="destructive"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create New Link
          </Button>
        </div>
      )}

      {/* Link cards */}
      <div className="grid grid-cols-1 gap-4 mt-2">
        {filteredUrls.map((url) => (
          <LinkCard key={url.id} url={url} fetchUrls={fetchUrls} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
