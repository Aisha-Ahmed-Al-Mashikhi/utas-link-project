import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/app/store"; // ← IMPORTANT
import Home from "../src/Component/Home.jsx";

describe("Home Page", () => {
  it("should show the welcome text", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    const heading = screen.getByText(/Unlock/i);
    expect(heading).toBeInTheDocument();
  });
});
