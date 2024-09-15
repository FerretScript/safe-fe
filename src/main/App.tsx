import { ThemeProvider } from "~/components/theme-provider";

export default function App() {
  return (
    <ThemeProvider>
      <main className="flex h-screen w-screen items-center justify-center bg-background"></main>
    </ThemeProvider>
  );
}
