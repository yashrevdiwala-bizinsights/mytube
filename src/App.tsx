import { useEffect, useState } from "react"
import { Link } from "react-router"

import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "./components/navbar"
import api from "./lib/api"

interface Video {
  id: number
  videoTitle: string
  videoPath: string
}

const App = () => {
  const [videos, setVideos] = useState<Video[]>()

  useEffect(() => {
    api.get("/video").then((res) => {
      setVideos(res.data.videos)
    })
  }, [])

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos?.map((video, i) => (
            <Link to={`/watch?v=${video.id}`} key={i}>
              <Card className="bg-gray-800 text-white rounded-lg overflow-hidden border-0">
                <CardContent>
                  <div className="h-40 bg-gray-600 rounded-md">
                    <img
                      src="/thumb.jpg"
                      alt={video.videoTitle}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">
                      {video.videoTitle}
                    </h2>
                    <p className="text-sm text-gray-400">Channel Name</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </main>
      </div>
    </div>
  )
}

export default App

