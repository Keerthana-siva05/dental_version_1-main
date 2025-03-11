import { Facebook, Twitter, Instagram } from "lucide-react"
import "./header.css";
const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">MGPGIDS Dental</h3>
            <p>Providing quality dental care for a brighter future.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Services
                </a>
              </li>
              {/* <li>
                <a href="#testimonials" className="hover:underline">
                  Testimonials
                </a>
              </li> */}
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          {/* <div>
            <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-200 transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-blue-200 transition-colors duration-200">
                <Instagram size={24} />
              </a>
            </div>
          </div> */}
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} MGPGIDS Dental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

