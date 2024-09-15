import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import {TooltipProvider} from "~/components/ui/tooltip"
 
export default function App() {
  return (
    <TooltipProvider>
      <main
        className={`h-screen w-screen bg-background`}
      >
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/demo" component={Demo} />
            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
          </Switch>
      </main>
    </TooltipProvider>
  );
}
