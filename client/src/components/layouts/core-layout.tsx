import { ThemeProvider } from "next-themes";
import { PrivyProvider } from "../providers/privy-provider";
import Nav from "../core/Nav";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="w-full h-full min-h-screen flex flex-col  items-center">
          <Nav />
          <div className="w-full max-w-5xl">{children}</div>
        </div>
      </ThemeProvider>
    </PrivyProvider>
  );
};

export default CoreLayout;
