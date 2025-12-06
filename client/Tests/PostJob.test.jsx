import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostJob from "../src/Component/PostJob";

// Mock useDispatch فقط لأنه مستخدم في الصفحة
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

describe("PostJob Page", () => {
  it("should display the Post Job button", () => {
    render(<PostJob />);

    const btn = screen.getByRole("button", { name: /Post Job/i });

    expect(btn).toBeInTheDocument();
  });
});
