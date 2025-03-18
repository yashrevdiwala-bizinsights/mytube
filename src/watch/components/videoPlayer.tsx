import { useRef, useEffect } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"
import "videojs-hls-quality-selector"

type VideoJsPlayerWithHls = ReturnType<typeof videojs> & {}

interface VideoPlayerProps {
  options: {
    autoplay: boolean
    controls: boolean
    responsive: boolean
    fluid: boolean
    sources: {
      src: string | undefined
      type: string
    }[]
  }
}

export const VideoPlayer = ({ options }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<VideoJsPlayerWithHls>(null)

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js")

      videoElement.classList.add("vjs-big-play-centered")
      videoRef.current?.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready")

        // player.hlsQualitySelector({
        //   displayCurrentQuality: true,
        // })
      }))
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player style={{ width: "600px" }}>
      <div ref={videoRef} />
    </div>
  )
}

export default VideoPlayer
