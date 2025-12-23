import {
  getLinkByUrl,
  getLinkIndexByUrl,
  generateTitleFromUrl,
} from "@/constants";

interface HeaderProps {
  url: string;
  name?: string;
  description?: string;
  number?: number;
  indexEnabled?: boolean;
}

const Header = ({
  url,
  name,
  description,
  number,
  indexEnabled = true,
}: HeaderProps) => {
  const linkConfig = getLinkByUrl(url);
  const linkIndex = getLinkIndexByUrl(url);

  const displayName = name ?? linkConfig?.name ?? linkConfig?.label ?? generateTitleFromUrl(url);
  const displayDescription = description ?? linkConfig?.description;
  const displayNumber = number ?? (linkIndex !== -1 ? linkIndex : undefined);
  const showIndex = indexEnabled && (linkConfig?.indexEnabled ?? true);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2">
        {showIndex && displayNumber !== undefined && (
          <p className="px-2 bg-neutral-800">
            {displayNumber.toString().padStart(2, "0")}
          </p>
        )}

        <p className="text-lg">{displayName}</p>
      </div>
      {displayDescription && (
        <p className="text-sm text-muted-foreground">{displayDescription}</p>
      )}
    </div>
  );
};

export default Header;
