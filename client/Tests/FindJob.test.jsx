import React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FindJob from "../src/Component/FindJob.jsx";

// ====== MOCK REDUX ======
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => ({
    jobList: [],
    isLoading: false,
    user: { cvLink: "cv.pdf" },
  }),
}));

// ====== MOCK NAVIGATE ======
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

describe("FindJob Page", () => {
  it("should display the Search button", () => {
    render(
      <MemoryRouter>
        <FindJob />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button", { name: /search/i });
    expect(btn).toBeInTheDocument();
  });
});
