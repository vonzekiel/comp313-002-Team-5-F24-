import { FaBuilding, FaGlobe, FaHandsHelping } from "react-icons/fa";

const Home = () => {
  return (
    <div className="bg-gray-100 h-screen">
      <div className="flex justify-center items-start h-full flex-col px-4 md:px-8">
        <div
          className="relative w-full h-96 mb-4 bg-cover bg-center"
          style={{ backgroundImage: "url('public/assets/aboutt.jpg')" }}
        >
          {" "}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-lg text-white text-center">
              Real Estate Ventures is dedicated to building your dreams into
              reality.
            </p>
          </div>
        </div>
        <div className="text-center mt-0 mx-auto w-full max-w-screen-lg">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <FaBuilding size="2em" className="text-gray-600 mb-2 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p className="text-gray-700">
                To create exceptional living spaces that inspire and endure.
              </p>
            </div>
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <FaGlobe size="2em" className="text-gray-600 mb-2 mx-auto" />
              <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
              <p className="text-gray-700">
                To be a leader in innovative and sustainable real estate
                development.
              </p>
            </div>
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <FaHandsHelping
                size="2em"
                className="text-gray-600 mb-2 mx-auto"
              />
              <h2 className="text-xl font-semibold mb-2">Our Commitment</h2>
              <p className="text-gray-700">
                To provide exceptional service and build lasting relationships
                with our clients and communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
