'use client'
import { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 

} from '@heroicons/react/24/outline';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-[#ffffff] bg-no-repeat "
        style={{
            backgroundImage: 'url("./illustrations/loginBackground.png")',
        }}>
    {/* Contact Form */}
    
        <div className="p-8  ml-193 w-140 ">
            <div className='mt-5 rounded-2xl shadow-xl p-8 w-140'>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-0 gap-x-10">
                <FormInput
                    label="Full Name *"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Email Address *"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <div>
                    <label className="text-sm block font-semibold text-gray-700 mb-1">I am a...</label>
                    <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full h-10 border border-gray-300 rounded-xl px-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                    <option value="" disabled>Select one</option>
                    <option value="parent">Parent</option>
                    <option value="school">School Administrator</option>
                    <option value="driver">Driver</option>
                    <option value="other">Other</option>
                    </select>
                </div>

                <FormInput
                    label="Subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="md:col-span-2"
                />

                <div className="md:col-span-2">
                    <label className="text-sm block font-semibold text-gray-700 mb-1">Message *</label>
                    <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500"
                    ></textarea>
                </div>

                <div className="md:col-span-2 mt-4">
                    <button
                    type="submit"
                    className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition transform hover:scale-105"
                    >
                    Send Message
                    </button>
                </div>
            </form>
            </div>
        </div>
        

        {/* Contact Info Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 mt-0">
            <div className="grid md:grid-cols-3 gap-8">
                
                {/* Card 1 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                            <div className="mt-5 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                            <MapPinIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className='items-center'>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Visit Our Office</h3>
                            <p className="text-sm text-gray-600">
                                123 School Transport Ave<br />
                                Education District, ED 12345<br />
                                United States
                            </p>
                            </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                            <div className="mt-5 flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                            <PhoneIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Call Us</h3>
                            <p className="text-sm text-gray-600">
                                Main: (555) 123-4567<br />
                                Emergency: (555) 987-6543<br />
                                Toll-free: 1-800-SCHOOL-WAY
                            </p>
                            </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                    <div className="grid grid-cols-[auto_1fr] gap-4 items-start justify-center">
                        <div className="mt-5 flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                        <EnvelopeIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Email Us</h3>
                        <p className="text-sm text-gray-600">
                            info@schoolway.com<br />
                            support@schoolway.com<br />
                            emergency@schoolway.com
                        </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      <Footer/>
    </div>
    
  );
}