import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Listing from "../models/listing.model";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Listing.deleteMany({});
});

describe("Listing Model Test", () => {
  it("should create a listing successfully", async () => {
    const validListing = new Listing({
      name: "Test Listing",
      description: "This is a test listing.",
      address: "123 Test St.",
      price: 250000,
      bathrooms: 2,
      bedrooms: 3,
      furnished: true,
      parking: true,
      type: "sale",
      offer: false,
      owner: "test@test.com",
      imageUrls: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      userRef: "1234567890abcdef",
    });

    const savedListing = await validListing.save();

    expect(savedListing._id).toBeDefined();
    expect(savedListing.name).toBe("Test Listing");
    expect(savedListing.description).toBe("This is a test listing.");
    expect(savedListing.address).toBe("123 Test St.");
    expect(savedListing.price).toBe(250000);
    expect(savedListing.bathrooms).toBe(2);
    expect(savedListing.bedrooms).toBe(3);
    expect(savedListing.furnished).toBe(true);
    expect(savedListing.parking).toBe(true);
    expect(savedListing.type).toBe("sale");
    expect(savedListing.offer).toBe(false);
    expect(savedListing.owner).toBe("test@test.com");
    expect(savedListing.imageUrls).toEqual([
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ]);
    expect(savedListing.userRef).toBe("1234567890abcdef");
  });
});
