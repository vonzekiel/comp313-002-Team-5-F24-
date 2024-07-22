import { FaHammer } from "react-icons/fa";

function About() {
  return (
    <div>
      {" "}
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <FaHammer size="4em" className="text-yellow-500 mb-4" />
          <h1 className="text-4xl font-semibold">Under Construction</h1>
        </div>
      </div>
    </div>
  );
}

export default About;
