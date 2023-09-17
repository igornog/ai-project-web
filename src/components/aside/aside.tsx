import { Button } from "../ui/button";
import { Wand2 } from "lucide-react"
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { VideoInputForm } from "../video-input-form";

export function Aside() {
  return (
    <aside className="w-80 space-y-4">
      <VideoInputForm />
      <Separator />
      <form className="space-y-6">
        <div className="space-y-1">
          <Label>Prompt</Label>
          <Select defaultValue="description">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='description'>Youtube Description</SelectItem>
              <SelectItem value='title'>Youtube Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Model</Label>
          <Select disabled defaultValue="gpt3.5">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='gpt3.5'>GPT 3.5-turbo 16k</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground italic block">You will be able to custom this option soon..</span>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Temperature</Label>
          <Slider
            defaultValue={[0.5]}
            className="cursor-pointer"
            min={0}
            max={1}
            step={0.1}
          />
          <span className="text-xs text-muted-foreground italic block">Higher values results in more creativity, but possible errors..</span>
        </div>

        <Separator />

        <Button type="submit" className="w-full">
          Generate
          <Wand2 className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </aside>
  );
}