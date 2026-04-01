import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#020202]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
        </div>
        <div className="space-y-2 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 animate-pulse">
                Initializing Neural Link
            </p>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
