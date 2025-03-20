import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface VideoFormData {
  title: string;
}

const UploadPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formdata, setFormdata] = useState<VideoFormData>({ title: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const data = { title: formdata.title, video: videoFile };

    api
      .postForm("/video/upload", data)
      .then((res) => {
        if (res.data.flag === 1) {
          toast.success(res.data.message);
          setVideoFile(null);
          setFormdata({ title: "" });

          setLoading(false);
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div
          className={cn(
            loading && "pointer-events-none",
            "flex flex-col items-center justify-center min-h-screen p-4 w-full"
          )}
        >
          {loading && (
            <div className="absolute bg-black opacity-60 inset-0 z-10 flex flex-col gap-y-4 items-center justify-center">
              <Loader2 className="text-white w-16 h-16 animate-spin" />

              <p className="font-semibold text-white">
                Your video is being uploaded. Please wait...
              </p>
            </div>
          )}

          <Card className="w-full max-w-lg bg-gray-800 shadow-lg border-none">
            <CardContent>
              <h1 className="text-2xl font-bold mb-6 text-muted-foreground text-center">
                Upload Video
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 text-white">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Video Title"
                      value={formdata?.title}
                      onChange={(e) =>
                        setFormdata({
                          ...formdata,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="bg-gray-700 text-white"
                    />
                  </div>

                  {videoFile ? (
                    <div className="flex flex-col gap-2 mt-6">
                      <div className="flex justify-between items-center">
                        <p className="">{videoFile.name}</p>

                        <X
                          className="text-rose-500 w-5 h-5 cursor-pointer"
                          onClick={() => setVideoFile(null)}
                        />
                      </div>
                      <video
                        src={URL.createObjectURL(videoFile)}
                        controls
                        disablePictureInPicture
                        controlsList="nodownload"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-6">
                      <Label htmlFor="video">Select Video File</Label>
                      <Input
                        type="file"
                        accept="video/*"
                        id="video"
                        onChange={handleFileChange}
                        className="bg-gray-700 text-white"
                      />
                    </div>
                  )}
                </div>
                <Button
                  variant="secondary"
                  type="submit"
                  className="w-full mt-4"
                >
                  Upload
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
