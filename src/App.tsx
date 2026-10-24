import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AboutPage } from "./pages/AboutPage";

export function App() {
  return (
    <Router hook={useHashLocation} base="/">
      <Switch>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}
