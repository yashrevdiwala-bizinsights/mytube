import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Fullscreen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { VolumeControl } from "./volumeControl";
import { PlayerControl } from "./playerControl";

interface VideoPlayerProps {
  src: string;
}

export interface VideoPlayerDuration {
  currentDuration: number;
  totalDuration: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean | "ended">(false);
  const [duration, setDuration] = useState<VideoPlayerDuration>({
    currentDuration: 0,
    totalDuration: 0,
  });
  const [volume, setVolume] = useState(0);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const [qualities, setQualities] = useState<number[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number>(-1);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const setupHls = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (Hls.isSupported()) {
        const hls = new Hls({
          startLevel: -1,
          capLevelToPlayerSize: true,
          testBandwidth: true,

          abrEwmaFastLive: 5.0,
          abrEwmaSlowLive: 9.0,
          abrBandWidthFactor: 0.8,
          abrBandWidthUpFactor: 0.7,
          maxStarvationDelay: 4,
        });

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
          const availableQualities = hls.levels
            .map((level) => level.height)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort((a, b) => b - a);
          setQualities(availableQualities);
          setSelectedQuality(-1);

          // Start the video
          video.play();

          setIsPlaying(!video.paused);
        });

        hls.on(Hls.Events.LEVEL_LOADED, (_event, data) => {
          setDuration({
            currentDuration: video.currentTime,
            totalDuration: data.details.totalduration,
          });
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // For browsers that support HLS natively (like Safari)
        video.src = src;
      }
    };

    const handleTimeUpdate = () => {
      setDuration({
        currentDuration: video.currentTime,
        totalDuration: video.duration,
      });
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Wait until the Plyr instance is ready
    if (videoRef.current) {
      setupHls();
    } else {
      const interval = setInterval(() => {
        if (videoRef.current) {
          setupHls();
          clearInterval(interval);
        }
      }, 100);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        clearInterval(interval);
      };
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  const handleQualitySelect = (quality: number) => {
    if (!hlsRef.current) return;

    if (quality === -1) {
      hlsRef.current.currentLevel = -1;
    } else {
      const levelIndex = hlsRef.current.levels.findIndex(
        (level) => level.height === quality
      );
      hlsRef.current.currentLevel = levelIndex;
    }

    setSelectedQuality(quality);
  };

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }

    setIsPlaying(!video.paused);
  };

  const handleDurationChange = (value: number[]) => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = value[0];

    setDuration({
      currentDuration: value[0],
      totalDuration: video.duration,
    });
  };

  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef?.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  const toggleMute = () => {
    const isMuted = volume === 0;

    setVolume(isMuted ? 100 : 0);

    if (videoRef?.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 1 : 0;
    }
  };

  useEffect(() => {
    onVolumeChange(100);
  }, []);

  const toggleFullscreen = () => {
    const video = videoRef.current;

    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const handleControlsVisibility = () => {
    setControlsVisible(true);

    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }

    hideControlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        onMouseMove={handleControlsVisibility}
        onMouseOut={() => setControlsVisible(false)}
      >
        <video
          autoPlay
          className={cn(
            controlsVisible ? "cursor-auto" : "cursor-none",
            "rounded-md h-[500px]"
          )}
          ref={videoRef}
          onEnded={(e) => e.currentTarget.ended && setIsPlaying("ended")}
        />

        <div className="absolute rounded-b-md bottom-0 left-0 p-2 bg-gradient-to-br bg-black/50 bg-opacity-50 w-full text-white">
          <div className="flex items-center justify-between">
            <VolumeControl
              onToggle={toggleMute}
              onChange={onVolumeChange}
              value={volume}
            />

            <PlayerControl
              isPlaying={isPlaying}
              duration={duration}
              togglePlay={togglePlay}
              handleDurationChange={handleDurationChange}
            />

            <div className="flex items-center gap-2">
              <Select
                onValueChange={(e) => handleQualitySelect(Number(e))}
                value={selectedQuality.toString()}
              >
                <SelectTrigger className="w-[180px] text-white outline-0 border-none ring-0 cursor-pointer">
                  <SelectValue placeholder="Quality" />
                </SelectTrigger>

                <SelectContent
                  className="bg-[#101727] border-none font-semibold text-white"
                  onMouseOver={() => setControlsVisible(true)}
                  position="popper"
                  side="top"
                  align="end"
                  sideOffset={5}
                >
                  <SelectGroup>
                    <SelectLabel className="text-white">Quality</SelectLabel>
                    <SelectItem className="cursor-pointer" value={"-1"}>
                      Auto
                    </SelectItem>
                    {qualities.map((quality) => (
                      <SelectItem
                        key={quality}
                        className="cursor-pointer"
                        value={quality.toString()}
                      >
                        {quality}p
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                className="h-7 w-7 transition-all duration-300"
                onClick={toggleFullscreen}
              >
                <Fullscreen />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
