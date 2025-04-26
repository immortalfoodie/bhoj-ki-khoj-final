
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-bhoj-light text-gray-700">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-bhoj-dark">
              Bhoj<span className="text-bhoj-primary">-ki-</span>Khoj
            </h3>
            <p className="mb-4">
              Connecting you with authentic homemade food providers and
              Mumbai's legendary Dabbawalas for a delicious, convenient meal experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-bhoj-primary text-white p-2 rounded-full hover:bg-bhoj-dark transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="bg-bhoj-primary text-white p-2 rounded-full hover:bg-bhoj-dark transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="bg-bhoj-primary text-white p-2 rounded-full hover:bg-bhoj-dark transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-bhoj-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-bhoj-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-bhoj-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-bhoj-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-bhoj-primary transition-colors">
                  Dabbawala Delivery
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-bhoj-primary transition-colors">
                  Homemade Food
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-bhoj-primary transition-colors">
                  Tiffin Services
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-bhoj-primary transition-colors">
                  Catering
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <address className="not-italic">
              <p className="mb-2">Mumbai, Maharashtra, India</p>
              <p className="mb-2">info@bhojkikhoj.com</p>
              <p>+91 98765 43210</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Bhoj-ki-Khoj. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
