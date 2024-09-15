import { ThemeProvider } from "~/components/theme-provider";

export default function App() {
  return (
    <ThemeProvider>
      <main className="w-screen h-screen bg-background flex justify-center items-center"></main>
    </ThemeProvider>
  );
}
