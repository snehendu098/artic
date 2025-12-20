import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import Nav from "../core/Nav";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThirdwebProvider>
        <div className="w-screen h-full flex flex-col justify-center items-center">
          <Nav />
          <div className="w-full max-w-4xl">{children}</div>
        </div>
      </ThirdwebProvider>
    </ThemeProvider>
  );
};

export default CoreLayout;
