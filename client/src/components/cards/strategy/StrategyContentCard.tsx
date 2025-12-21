interface StrategyContentCardProps {
  content: string;
}

export default function StrategyContentCard({
  content,
}: StrategyContentCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6">
      <p className="text-white/60 text-sm font-medium mb-4">Strategy Details</p>
      <div className="bg-white/5 rounded border border-white/5 p-4 max-h-96 overflow-y-auto">
        <p className="text-white/80 text-sm font-mono whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
      <div className="mt-4 flex justify-between items-center text-xs text-white/40">
        <span>Strategy Code</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
}
