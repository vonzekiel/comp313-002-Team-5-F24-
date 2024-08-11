// ListingItem.test.jsx
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, expect, it } from "@jest/globals";
import ListingItem from "../../components/ListingItem";
import "@testing-library/jest-dom/extend-expect";

const mockListing = {
  _id: "1",
  imageUrls: ["https://via.placeholder.com/150"],
  type: "rent",
};

describe("ListingItem Component", () => {
  it("should render the listing image", () => {
    const { getByAltText } = render(
      <Router>
        <ListingItem listing={mockListing} />
      </Router>
    );
    const image = getByAltText("listing cover");
    expect(image).toHaveAttribute("src", mockListing.imageUrls[0]);
  });

  it('should display "For Rent" when listing type is rent', () => {
    const { getByText } = render(
      <Router>
        <ListingItem listing={mockListing} />
      </Router>
    );
    const rentText = getByText("For Rent");
    expect(rentText).toBeInTheDocument();
    expect(rentText).toHaveClass("text-black");
  });

  it('should display "For Sale" when listing type is sale', () => {
    const saleListing = { ...mockListing, type: "sale" };
    const { getByText } = render(
      <Router>
        <ListingItem listing={saleListing} />
      </Router>
    );
    const saleText = getByText("For Sale");
    expect(saleText).toBeInTheDocument();
    expect(saleText).toHaveClass("text-white");
  });

  it("should have green background when listing type is rent", () => {
    const { container } = render(
      <Router>
        <ListingItem listing={mockListing} />
      </Router>
    );
    const div = container.querySelector("div.flex.items-center.px-6.py-3");
    expect(div).toHaveClass("bg-green-500");
  });

  it("should have red background when listing type is sale", () => {
    const saleListing = { ...mockListing, type: "sale" };
    const { container } = render(
      <Router>
        <ListingItem listing={saleListing} />
      </Router>
    );
    const div = container.querySelector("div.flex.items-center.px-6.py-3");
    expect(div).toHaveClass("bg-red-500");
  });
});
