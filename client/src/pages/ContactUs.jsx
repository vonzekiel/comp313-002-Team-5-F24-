import { useState } from "react";
import emailjs from "emailjs-com";
import { useSelector } from "react-redux";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const currentUser = useSelector((state) => state.user.currentUser);
  const fromEmail = currentUser ? currentUser.email : "";
  const toEmail = "realestateventures05@gmail.com";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.name,
      from_email: fromEmail || formData.email,
      to_email: toEmail,
      message: formData.message,
    };

    emailjs
      .send(
        "service_k16oiyx", // EmailJS service ID
        "template_hb2ede9", // EmailJS template ID
        templateParams,
        "lrXvxvIozvWAL0mWf" // EmailJS user ID (Public Key)
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert("Message sent successfully!");
      })
      .catch((err) => {
        console.error("FAILED...", err);
        alert("Failed to send message. Please try again later.");
      });

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen  text-white p-4">
      <div className="flex flex-col md:flex-row bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl gap-4">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold mb-4">Support</h1>
          <p className="text-gray-400 mb-4">
            We are here to help you. Please fill out the form on the right to
            send us a message. Your feedback and suggestions are important to
            us. Let us know how we can improve our services and support you
            better.
          </p>
        </div>
        <div className="md:w-2/3">
          <h1 className="text-2xl font-bold mb-4 text-center">Contact Us</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white sm:text-base h-12"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white sm:text-base h-12"
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white sm:text-base h-32"
                placeholder="Your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
