import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("User Model Test", () => {
  it("should create a user successfully", async () => {
    const validUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser");
    expect(savedUser.email).toBe("test@example.com");
    expect(savedUser.password).toBe("password123");
    expect(savedUser.avatar).toBe(
      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
    );
  });

  it("should not create a user without required fields", async () => {
    const userWithoutRequiredField = new User({ username: "testuser" });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should enforce unique constraint on username and email", async () => {
    const user1 = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    await user1.save();

    const user2 = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password456",
    });
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });
});
