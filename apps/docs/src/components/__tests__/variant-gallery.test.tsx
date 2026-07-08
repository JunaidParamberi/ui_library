import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VariantGallery, GalleryCell } from "../variant-gallery";

describe("VariantGallery", () => {
  it("labels each cell", () => {
    render(
      <VariantGallery>
        <GalleryCell label="Default"><span>a</span></GalleryCell>
        <GalleryCell label="Loading"><span>b</span></GalleryCell>
      </VariantGallery>,
    );
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeVisible();
  });
});
