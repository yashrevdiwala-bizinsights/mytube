import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LucideIcon, Pause, Play, RotateCcw } from "lucide-react";
import { VideoPlayerDuration } from "./videoPlayer";

interface PlayerControlProps {
  isPlaying: boolean | "ended";
  duration: VideoPlayerDuration;
  togglePlay: () => void;
  handleDurationChange: (value: number[]) => void;
}

export const PlayerControl = ({
  isPlaying,
  duration,
  togglePlay,
  handleDurationChange,
}: PlayerControlProps) => {
  const Icon: LucideIcon =
    isPlaying === "ended" ? RotateCcw : isPlaying ? Pause : Play;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className="h-7 w-7 transition-all duration-300"
        onClick={togglePlay}
      >
        <Icon />
      </Button>

      <Slider
        className="w-[16rem] cursor-pointer"
        onValueChange={handleDurationChange}
        value={[duration.currentDuration]}
        max={duration.totalDuration}
        step={1}
      />
    </div>
  );
};
