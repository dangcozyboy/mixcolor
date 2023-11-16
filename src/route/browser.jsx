import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginForm from "../components/Login";
import { ColorScheme } from "../pages/Color";
const routes = [{ path: "/login", exact: true, component: LoginForm }];
export const Browser = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" component={ColorScheme}></Route>
        {routes.map((route, key) => {
          return <Route key={key} {...route}></Route>;
        })}
      </Switch>
    </BrowserRouter>
  );
};
