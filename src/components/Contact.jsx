import { MapPin, Phone, Mail } from "lucide-react"

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Contact Us</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {/* Contact Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <MapPin className="text-blue-600" size={24} />
          <p>Gorimedu, Indira Nagar, Puducherry, 605006</p>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="text-blue-600" size={24} />
          <p>+91- 0413- 2279601 to 2279606</p>
        </div>
      </div>

      {/* Google Map for Navigation */}
      <div className="rounded-lg overflow-hidden shadow-md">
        <iframe
          title="Google Map"
          className="w-full h-70 md:h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.247047814169!2d79.79077417478027!3d11.957389936302425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a53612302674a1d%3A0x45fbd57e14946028!2sMahatma%20Gandhi%20Postgraduate%20Institute%20of%20Dental%20Sciences!5e0!3m2!1sen!2sin!4v1740555975836!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
              </div>
    </div>
  </div>
</section>
  )
}

export default Contact

