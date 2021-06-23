import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Footer, Home, Table } from "./screens";
function App() {
  return (
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/table" exact component={() => <Table />} />
        </Switch>
        <Footer />
      </Router>
  );
}

export default App;
