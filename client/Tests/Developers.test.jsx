import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Developers from "../src/Component/Developers.jsx";
import React from "react";

describe("Developers Page", () => {
  // Test Case 1: Check if h1 exists
  it("should render the main heading", () => {
    render(<Developers />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  // Test Case 2: Check if developer name is displayed in the h3
  it("should display the developer name", () => {
    render(<Developers />);
    const devName = screen.getByRole("heading", { level: 3 });
    expect(devName).toHaveTextContent("Aisha Al-Mashikhi");
  });

  // Test Case 3: Check if references section (h2) exists
  it("should display the references section", () => {
    render(<Developers />);
    const refHeading = screen.getByRole("heading", { level: 2 });
    expect(refHeading).toBeInTheDocument();
  });
});
