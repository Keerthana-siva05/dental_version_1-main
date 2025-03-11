import { Menu } from "lucide-react"
import logo from "../assets/images/logo.jpg";
import "./header.css";

const Header = ({ toggleSidebar }) => {
  return (
<header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-white">
  <div className="container mx-auto px-4 py-3 md:py-4 lg:py-5 flex items-center justify-between">
    
    {/* Logo */}
    <div className="flex-shrink-0">
      <img src={logo} alt="Dental Clinic Logo" className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
    </div>
    
    {/* Centered Text - Takes Equal Space */}
    <div className="flex-1 flex flex-col items-center text-center space-y-1">
      <h1 className="text-base md:text-lg font-bold text-white">MAHATMA GANDHI</h1>
      <h2 className="text-sm md:text-md font-semibold text-gray-100">
        POSTGRADUATE OF MEDICAL SCIENCES (MGPGIDS)
      </h2>
      <h3 className="text-base md:text-lg font-bold text-yellow-600">DEPARTMENT OF ORTHODONTICS</h3>
      <p className="text-xs text-gray-300">
        GOVERNMENT OF PUDUCHERRY INSTITUTION
      </p>
    </div>

    {/* Mobile Menu Button */}
<div className="flex-shrink-0">
  <button
    onClick={toggleSidebar}
    className="text-white hover:text-gray-400 transition-colors duration-200"
  >
    <Menu size={30} />
  </button>
</div>

      
    


        

    {/* Navigation
    <nav className="hidden lg:flex space-x-6">
      <a href="#home" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        Home
      </a>
      <a href="#about" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        About
      </a>
      <a href="#services" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        Services
      </a>
      <a href="#testimonials" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        Testimonials
      </a>
      <a href="#contact" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
        Contact
      </a>
    </nav> */}
  </div>
</header>
  )
}

export default Header

