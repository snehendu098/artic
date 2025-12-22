import { IconMenu2 } from "@tabler/icons-react";

const Nav = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  return (
    <div className="w-full flex items-center justify-between border-b h-[55px] bg-background px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1 bg-neutral-800 hover:bg-primary/60 border transition-colors duration-300"
          aria-label="Toggle sidebar"
        >
          <IconMenu2 className="w-5 h-5 text-white/60 hover:text-white transition-colors duration-300" />
        </button>
        <div className="text-muted-foreground">
          // <span className="text-white text-sm uppercase">dashboard</span>
        </div>
      </div>
    </div>
  );
};

export default Nav;
