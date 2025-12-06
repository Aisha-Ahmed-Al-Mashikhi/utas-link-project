import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "../src/Component/Footer.jsx";
import React from "react";

describe("Footer Component", () => {
  // Test 1: Should render the brand name UTAS Link
  it("should display the UTAS Link brand", () => {
    render(<Footer />);
    const brand = screen.getByText(/UTASLink/i);
    expect(brand).toBeInTheDocument();
  });

  // Test 2: Should show the contact email
  it("should display the contact email", () => {
    render(<Footer />);
    const email = screen.getByText(/Utas.Link@gmail.com/i);
    expect(email).toBeInTheDocument();
  });

  // Test 3: Should show the copyright line
  it("should display copyright text", () => {
    render(<Footer />);
    const copyright = screen.getByText(/Developed by Aisha/i);
    expect(copyright).toBeInTheDocument();
  });
});
