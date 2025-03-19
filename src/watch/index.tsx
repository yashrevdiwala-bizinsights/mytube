import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { Navbar } from "@/components/navbar"
import api from "@/lib/api"
import { VideoPlayer } from "./components/videoPlayer"

interface VideoData {
  video: { id: number; videoTitle: string; videoPath: string }
}

const fetchVideo = async (id: string | null) => {
  if (!id) return

  const res = await api.get(`/video/get/${id}`)
  return res.data
}

const WatchVideo = () => {
  const [searchParams] = useSearchParams()
  const params = searchParams.get("v")

  const {
    data: videoData,
    isLoading,
    error,
  } = useQuery<VideoData>({
    queryKey: ["video", params],
    queryFn: () => fetchVideo(params),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // const options = {
  //   autoplay: true,
  //   controls: true,
  //   responsive: true,
  //   fluid: true,
  //   sources: [
  //     {
  //       src: `${import.meta.env.VITE_API_URL}/${videoData?.video.videoPath}`,
  //       type: "application/x-mpegURL",
  //     },
  //   ],
  // }

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold mb-4 text-muted">
            Watch Video
          </h1>
          <VideoPlayer
            src={`${import.meta.env.VITE_API_URL}/${
              videoData?.video.videoPath
            }`}
          />
        </div>
      </div>
    </div>
  )
}
export default WatchVideo
