import { useRef, useEffect, useState } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"
import "videojs-hls-quality-selector"

type VideoJsPlayerWithHls = ReturnType<typeof videojs>

interface VhsTech {
  vhs?: {
    representations: () => Representation[]
  }
}

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

interface Representation {
  height: number
  enabled: (flag: boolean) => void
}

interface QualityOption {
  label: string
  value: number | "auto"
}

export const VideoPlayer = ({ options }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<VideoJsPlayerWithHls>(null)
  const [qualities, setQualities] = useState<QualityOption[]>([])

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js")

      videoElement.classList.add("vjs-big-play-centered")
      videoRef.current?.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready")

        player.on("loadedmetadata", () => {
          // Cast the tech instance to our VhsTech interface
          const tech = player.tech(true) as unknown as VhsTech
          const reps: Representation[] =
            (tech.vhs && tech.vhs.representations()) || []
          if (reps.length > 0) {
            // Map each representation to a quality option using the height as identifier
            const qualityOptions: QualityOption[] = reps.map((rep) => ({
              label: `${rep.height}p`,
              value: rep.height,
            }))
            // Remove duplicates and add an "Auto" option
            const uniqueQualities = Array.from(
              new Map(qualityOptions.map((item) => [item.value, item])).values()
            )
            uniqueQualities.sort((a, b) =>
              typeof a.value === "number" && typeof b.value === "number"
                ? b.value - a.value
                : 0
            )
            uniqueQualities.unshift({ label: "Auto", value: "auto" })
            setQualities(uniqueQualities)
          }
        })
      }))
    } else {
      const player = playerRef.current

      player.autoplay(options.autoplay)
      player.src(options.sources)
    }
  }, [options, videoRef])

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    const player = playerRef.current
    if (!player) return

    // Cast the tech instance to our VhsTech interface
    const tech = player.tech(true) as unknown as VhsTech
    const reps: Representation[] =
      (tech.vhs && tech.vhs.representations()) || []

    if (selected === "auto") {
      // Enable all representations for adaptive bitrate switching
      reps.forEach((rep) => rep.enabled(true))
    } else {
      const quality = parseInt(selected, 10)
      // Disable representations that do not match the selected quality
      reps.forEach((rep) => {
        rep.enabled(rep.height === quality)
      })
    }
  }

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
    <div>
      <div data-vjs-player style={{ width: "600px" }}>
        <div ref={videoRef} />
      </div>
      {qualities.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="qualitySelector">Quality: </label>
          <select id="qualitySelector" onChange={handleQualityChange}>
            {qualities.map((quality, idx) => (
              <option key={idx} value={quality.value}>
                {quality.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
