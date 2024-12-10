import { useState } from "react";
import emailjs from "emailjs-com";
import { useSelector } from "react-redux";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  // const currentUser = useSelector((state) => state.user.currentUser);
  // const fromEmail = currentUser ? currentUser.email : "";
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
      from_email: formData.email,
      to_email: toEmail, // Replace with your recipient email
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
        setSuccessMessage("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
      })
      .catch((err) => {
        console.error("FAILED...", err);
        setSuccessMessage("Failed to send message. Please try again later.");
      });
  };

  return (
    <div>
      <section
        className="min-h-screen bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="flex flex-col min-h-screen bg-black/60">
          <div className="container flex flex-col flex-1 px-6 py-12 mx-auto">
            <div className="flex-1 lg:flex lg:items-center lg:-mx-6">
              <div className="text-white lg:w-1/2 lg:mx-6 hidden md:block">
                <h1 className="text-2xl font-semibold capitalize lg:text-3xl">
                  Your Ultimate Real Estate Partner
                </h1>

                <p className="max-w-xl mt-6">
                  Welcome to RealEstateVentures, your trusted partner in finding
                  the perfect property. Whether you're looking to buy, sell, or
                  rent, we provide comprehensive solutions tailored to your
                  needs. Explore our listings and discover your dream home
                  today.
                </p>

                <div className="mt-6 md:mt-8 hidden md:block">
                  <h3 className="text-gray-300">Follow us</h3>

                  <div className="flex mt-4 -mx-1.5">
                    <a
                      className="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500"
                      href="#"
                    >
                      <svg
                        className="w-10 h-10 fill-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.6668 6.67334C18.0002 7.00001 17.3468 7.13268 16.6668 7.33334C15.9195 6.49001 14.8115 6.44334 13.7468 6.84201C12.6822 7.24068 11.9848 8.21534 12.0002 9.33334V10C9.83683 10.0553 7.91016 9.07001 6.66683 7.33334C6.66683 7.33334 3.87883 12.2887 9.3335 14.6667C8.0855 15.498 6.84083 16.0587 5.3335 16C7.53883 17.202 9.94216 17.6153 12.0228 17.0113C14.4095 16.318 16.3708 14.5293 17.1235 11.85C17.348 11.0351 17.4595 10.1932 17.4548 9.34801C17.4535 9.18201 18.4615 7.50001 18.6668 6.67268V6.67334Z" />
                      </svg>
                    </a>

                    <a
                      className="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500"
                      href="#"
                    >
                      <svg
                        className="w-8 h-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.2 8.80005C16.4731 8.80005 17.694 9.30576 18.5941 10.2059C19.4943 11.1061 20 12.327 20 13.6V19.2H16.8V13.6C16.8 13.1757 16.6315 12.7687 16.3314 12.4687C16.0313 12.1686 15.6244 12 15.2 12C14.7757 12 14.3687 12.1686 14.0687 12.4687C13.7686 12.7687 13.6 13.1757 13.6 13.6V19.2H10.4V13.6C10.4 12.327 10.9057 11.1061 11.8059 10.2059C12.7061 9.30576 13.927 8.80005 15.2 8.80005Z"
                          fill="currentColor"
                        />
                        <path
                          d="M7.2 9.6001H4V19.2001H7.2V9.6001Z"
                          fill="currentColor"
                        />
                        <path
                          d="M5.6 7.2C6.48366 7.2 7.2 6.48366 7.2 5.6C7.2 4.71634 6.48366 4 5.6 4C4.71634 4 4 4.71634 4 5.6C4 6.48366 4.71634 7.2 5.6 7.2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>

                    <a
                      className="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500"
                      href="#"
                    >
                      <svg
                        className="w-8 h-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10.2222V13.7778H9.66667V20H13.2222V13.7778H15.8889L16.7778 10.2222H13.2222V8.44444C13.2222 8.2087 13.3159 7.9826 13.4826 7.81591C13.6493 7.64921 13.8754 7.55556 14.1111 7.55556H16.7778V4H14.1111C12.9324 4 11.8019 4.46825 10.9684 5.30175C10.1349 6.13524 9.66667 7.2657 9.66667 8.44444V10.2222H7Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>

                    <a
                      className="mx-1.5 text-white transition-colors duration-300 transform hover:text-blue-500"
                      href="#"
                    >
                      <svg
                        className="w-8 h-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.9294 7.72275C9.65868 7.72275 7.82715 9.55428 7.82715 11.825C7.82715 14.0956 9.65868 15.9271 11.9294 15.9271C14.2 15.9271 16.0316 14.0956 16.0316 11.825C16.0316 9.55428 14.2 7.72275 11.9294 7.72275ZM11.9294 14.4919C10.462 14.4919 9.26239 13.2959 9.26239 11.825C9.26239 10.354 10.4584 9.15799 11.9294 9.15799C13.4003 9.15799 14.5963 10.354 14.5963 11.825C14.5963 13.2959 13.3967 14.4919 11.9294 14.4919ZM17.1562 7.55495C17.1562 8.08692 16.7277 8.51178 16.1994 8.51178C15.6711 8.51178 15.2426 8.08328 15.2426 7.55495C15.2426 7.02663 15.6711 6.59814 16.1994 6.59814C16.7277 6.59814 17.1562 7.02663 17.1562 7.55495ZM19.6209 8.563C19.1707 7.76979 18.497 7.09512 17.7041 6.64488C16.9012 6.18393 15.9378 5.9433 14.9531 5.94754H8.90573C7.919 5.94754 6.95458 6.18817 6.15335 6.64912C5.3604 7.09936 4.68673 7.77403 4.23648 8.56724C3.77603 9.36906 3.53564 10.3324 3.53564 11.3171V17.3645C3.53564 18.35 3.77603 19.3135 4.23648 20.1167C4.68673 20.9099 5.3604 21.5845 6.15335 22.0348C6.94701 22.4958 7.91041 22.7364 8.89518 22.7364H14.9425C15.928 22.7364 16.8915 22.496 17.6947 22.0356C18.4879 21.5853 19.1625 20.9116 19.6128 20.1187C20.0738 19.3166 20.3145 18.3532 20.3102 17.3684V11.321C20.3145 10.3362 20.0738 9.37281 19.6209 8.57096V8.563ZM18.1752 18.5813C18.0261 18.9471 17.803 19.2745 17.5265 19.5409C17.2468 19.8072 16.9161 20.0057 16.5566 20.123C16.1667 20.2533 15.7551 20.3196 15.3406 20.318H8.52239C8.10791 20.3196 7.69634 20.2533 7.30645 20.123C6.94696 20.0057 6.61622 19.8072 6.33655 19.5409C6.06005 19.2745 5.83697 18.9471 5.68786 18.5813C5.55439 18.1917 5.48765 17.7788 5.49284 17.3645V11.3171C5.48765 10.9026 5.55439 10.4907 5.68786 10.1012C5.83697 9.73536 6.06005 9.40826 6.33655 9.14177C6.61622 8.87527 6.94696 8.67678 7.30645 8.55947C7.69634 8.42923 8.10791 8.36292 8.52239 8.36448H15.3406C15.7551 8.36292 16.1667 8.42923 16.5566 8.55947C16.9161 8.67678 17.2468 8.87527 17.5265 9.14177C17.803 9.40826 18.0261 9.73536 18.1752 10.1012C18.3087 10.4907 18.3754 10.9026 18.3702 11.3171V17.3645C18.3754 17.7788 18.3087 18.1917 18.1752 18.5813Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 lg:w-1/2 lg:mx-6">
                <div className="w-full px-8 py-10 mx-auto overflow-hidden bg-white shadow-2xl rounded-xl dark:bg-gray-900 lg:max-w-xl">
                  {successMessage && (
                    <p className="text-green-500 text-center text-xl">
                      {successMessage}
                    </p>
                  )}
                  <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                    Contact form
                  </h1>

                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Ask us everything and we would love to hear from you
                  </p>

                  <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="flex-1">
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        id="name"
                        placeholder="Full Name"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex-1 mt-6">
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email Address"
                        className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="w-full mt-6">
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-48 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        placeholder="Message"
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <button className="w-full px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50">
                      Send message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900 hidden md:block">
        <div className="container px-6 py-12 mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 lg:text-3xl dark:text-white">
            Frequently Asked Questions
          </h1>

          <div className="grid grid-cols-1 gap-8 mt-8 lg:mt-16 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <div className="inline-block p-3 text-white bg-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
                  What can I expect at my first consultation?
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  During your first consultation, we will discuss your needs and
                  preferences, review available properties, and outline the next
                  steps in the process.
                </p>
              </div>
            </div>

            <div>
              <div className="inline-block p-3 text-white bg-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
                  How can I prepare for the property viewing?
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  To prepare for the property viewing, make a list of questions,
                  bring a notepad, and ensure you have a clear idea of your
                  budget and requirements.
                </p>
              </div>
            </div>

            <div>
              <div className="inline-block p-3 text-white bg-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
                  How do I make an offer on a property?
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  To make an offer on a property, contact your agent with your
                  offer details, including the price and any conditions. Your
                  agent will then communicate your offer to the seller.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
