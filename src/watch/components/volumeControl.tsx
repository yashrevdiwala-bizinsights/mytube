import { Volume1, Volume2, VolumeX } from "lucide-react";

import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  onToggle: () => void;
  onChange: (value: number) => void;
  value: number;
}

export const VolumeControl = ({
  value,
  onChange,
  onToggle,
}: VolumeControlProps) => {
  const isMuted = value === 0;
  const Icon = isMuted ? VolumeX : value > 50 ? Volume2 : Volume1;

  const handleChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="rounded-lg p-1.5 text-white hover:bg-white/10"
      >
        <Icon className="h-6 w-6" />
      </button>

      <Slider
        className="w-[8rem] cursor-pointer"
        onValueChange={handleChange}
        value={[value]}
        max={100}
        step={1}
      />
    </div>
  );
};
