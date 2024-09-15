import { Route, Switch } from "wouter";
import Demo from "./pages/Demo";
import {TooltipProvider} from "~/components/ui/tooltip"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();
 
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <main className={`h-screen w-screen bg-background`}>
          <Switch>
            <Route path="/" component={Demo} />
            <Route path="/demo" component={Demo} />
            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
          </Switch>
        </main>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
