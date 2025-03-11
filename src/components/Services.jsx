const Services = () => {
  const services = [
    {
      name: "General Dentistry",
      description: "Comprehensive care for your oral health",
      icon: "/icons/general-dentistry.svg",
    },
    {
      name: "Cosmetic Dentistry",
      description: "Enhance your smile with our aesthetic treatments",
      icon: "/icons/cosmetic-dentistry.svg",
    },
    { name: "Orthodontics",
      description: "Straighten your teeth for a perfect smile",
      icon: "/icons/orthodontics.svg" 
    },
    {
      name: "Pediatric Dentistry",
      description: "Specialized care for children's dental needs",
      icon: "/icons/pediatric-dentistry.svg",
    },
    {
      name: "Oral Surgery",
      description: "Expert surgical procedures for complex cases",
      icon: "/icons/oral-surgery.svg",
    },
    {
      name: "Periodontics",
      description: "Gum care and treatment for overall oral health",
      icon: "/icons/periodontics.svg",
    },
  ]

  return (
    <section id="services" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Our Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img src={service.icon || "/placeholder.svg"} alt={service.name} className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">{service.name}</h3>
              <p className="text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

