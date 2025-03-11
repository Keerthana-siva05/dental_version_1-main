import { Users, Award, Clock } from "lucide-react"

const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">About ORTHODONTICS </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-lg">
              Orthodontics is a specialized branch of dentistry that focuses on the diagnosis, prevention, and correction of misaligned teeth and jaws.
              It helps improve oral function, aesthetics, and overall dental health.
            </p>
            <p className="text-lg">
              We believe in personalized care and take the time to understand each patient's unique needs and concerns.
              Our goal is to help you achieve and maintain a healthy, beautiful smile that lasts a lifetime.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <Users className="mx-auto text-blue-600 mb-2" size={32} />
              <h3 className="font-semibold text-xl mb-2">Expert Team</h3>
              <p>Skilled professionals dedicated to your oral health</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <Award className="mx-auto text-blue-600 mb-2" size={32} />
              <h3 className="font-semibold text-xl mb-2">Quality Care</h3>
              <p>Committed to excellence in dental services</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <Clock className="mx-auto text-blue-600 mb-2" size={32} />
              <h3 className="font-semibold text-xl mb-2">Convenient Hours</h3>
              <p>Flexible scheduling to fit your busy life</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center hover:shadow-lg transition-shadow duration-300">
              <img src="/tooth-icon.svg" alt="Modern Technology" className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-xl mb-2">Modern Technology</h3>
              <p>State-of-the-art equipment for the best results</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

