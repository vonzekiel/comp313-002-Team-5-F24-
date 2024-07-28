function CreateListing() {
  return (
    <main className="p-3 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg shadow-md"
            id="name"
            maxLength={50}
            min={4}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg shadow-md"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg shadow-md"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="sale" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="parking" />
              <span>With Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedroom"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathroom"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="price"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg shadow-md"
              />
              <div className="flex flex-col items-center">
                <span>Price</span>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Upload Images:{" "}
            <span className="font-normal text-blue-950">
              Please upload up to 6 images
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full shadow-md"
            />
            <button className="border border-blue-700 text-blue-600 p-3 rounded-lg uppercase hover:drop-shadow-xl disabled:opacity-80">
              Upload Images
            </button>
          </div>
          <button className="p-3 bg-blue-600 text-white rounded-lg shadow-lg">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
