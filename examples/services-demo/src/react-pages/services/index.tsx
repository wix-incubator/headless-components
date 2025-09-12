import React, { useState } from 'react';
import type { ServicesListServiceConfig } from '@wix/headless-services/services';
import { List, Options, ServiceRepeater, Error, Service } from '@wix/headless-services/react';
import type { services } from '@wix/bookings';

interface ServicesPageProps {
  servicesConfig: ServicesListServiceConfig;
}

export default function ServicesPage({ servicesConfig }: ServicesPageProps) {
  console.log('[ServicesPage] Rendering with config:', {
    serviceCount: servicesConfig.services.length,
    firstService: servicesConfig.services[0] ? {
      id: servicesConfig.services[0]._id,
      name: servicesConfig.services[0].name,
      image: servicesConfig.services[0].media?.mainMedia?.image,
      category: servicesConfig.services[0].category?.name,
    } : null,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  return (
    <List servicesListConfig={servicesConfig}>
      {({ services: servicesList }: { services: services.Service[] }) => {
        console.log('[ServicesPage] List render with services:', {
          count: servicesList.length,
          firstService: servicesList[0] ? {
            id: servicesList[0]._id,
            name: servicesList[0].name,
            image: servicesList[0].media?.mainMedia?.image,
            category: servicesList[0].category?.name,
          } : null,
        });

        return (
          <div className="min-h-screen bg-[#f8f9fa]">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#e9ecef]">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center">
                  <a href="/" className="text-2xl font-serif text-[#212529] flex items-center">
                    <svg className="w-8 h-8 mr-3 text-[#6c757d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-light">DESIGN</span><span className="font-medium">STUDIO</span>
                  </a>
                </div>
                <div className="flex items-center space-x-8">
                  <a href="/portfolio" className="text-[#495057] hover:text-[#212529] transition-colors text-sm font-medium">
                    Portfolio
                  </a>
                  <a href="/about" className="text-[#495057] hover:text-[#212529] transition-colors text-sm font-medium">
                    About
                  </a>
                  <a href="/contact" className="text-[#495057] hover:text-[#212529] transition-colors text-sm font-medium">
                    Contact
                  </a>
                </div>
              </nav>
            </header>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#1a1f24] to-[#2d3339] text-white py-32 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGgtNnYxMmgtNnYtNmgtNnYxMmgtNnYtNmgtNnYxMmg0MnYtMTJoLTZ2LTZoLTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] bg-repeat opacity-20"></div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-3xl mx-auto text-center">
                  <span className="text-[#adb5bd] font-medium text-sm tracking-wider uppercase mb-6 block">Welcome to Our Studio</span>
                  <h1 className="text-6xl font-serif mb-8 leading-tight">
                    <span className="font-light">Interior Design</span>
                    <br />
                    <span className="font-medium">Services</span>
                  </h1>
                  <p className="text-xl text-[#dee2e6] leading-relaxed max-w-2xl mx-auto mb-12">
                    Transform your space into a stunning reflection of your style. Our expert designers create harmonious,
                    functional spaces that inspire and delight.
                  </p>
                  <div className="flex justify-center space-x-6">
                    <a href="#services" className="bg-white text-[#212529] px-8 py-3 rounded-full font-medium hover:bg-[#f8f9fa] transition-colors">
                      Explore Services
                    </a>
                    <a href="/contact" className="border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="space-y-12">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e9ecef] p-6 mb-12">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                    <div>
                      <h2 className="text-[#212529] text-lg font-medium mb-4">Browse by Category</h2>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`px-4 py-2 text-sm rounded-full transition-all ${
                            selectedCategory === null
                              ? 'bg-[#212529] text-white shadow-md'
                              : 'bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef]'
                          }`}
                        >
                          All Services
                        </button>
                        {Array.from(new Set(servicesList.map(s => s.category?.name))).filter(Boolean).map((category) => (
                          <button
                            key={category as string}
                            onClick={() => setSelectedCategory(category as string)}
                            className={`px-4 py-2 text-sm rounded-full transition-all ${
                              selectedCategory === category
                                ? 'bg-[#212529] text-white shadow-md'
                                : 'bg-[#f8f9fa] text-[#495057] hover:bg-[#e9ecef]'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#6c757d] text-sm">Sort by:</span>
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
                          className="appearance-none bg-[#f8f9fa] text-[#495057] text-sm py-2 pl-4 pr-10 rounded-lg border border-[#e9ecef] focus:outline-none focus:ring-2 focus:ring-[#212529] focus:ring-opacity-20 cursor-pointer"
                        >
                          <option value="name">Name</option>
                          <option value="price">Price</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6c757d]">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                <Error>
                  {({ error }: { error: string | null }) => (
                    error && (
                      <div className="bg-[#fff3f3] border border-[#fecaca] rounded-lg p-4 mb-6">
                        <div className="flex">
                          <svg className="h-5 w-5 text-[#ef4444]" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-[#991b1b]">Error Loading Services</h3>
                            <p className="mt-2 text-sm text-[#b91c1c]">{error}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </Error>

                {/* Services Grid */}
                <Options emptyState={
                  <div className="text-center py-16">
                    <div className="mx-auto h-12 w-12 text-[#9a8f8f]">
                      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-light text-[#2c3338]">No Services Found</h3>
                    <p className="mt-2 text-[#6b7280]">Try adjusting your filters or check back later.</p>
                  </div>
                }>
                  {({ services: optionsServices }: { services: services.Service[] }) => {
                    console.log('[ServicesPage] Options render with services:', {
                      count: optionsServices.length,
                      firstService: optionsServices[0] ? {
                        id: optionsServices[0]._id,
                        name: optionsServices[0].name,
                        image: optionsServices[0].media?.mainMedia?.image,
                        category: optionsServices[0].category?.name,
                      } : null,
                    });

                    const filteredServices = optionsServices
                      .filter(service => !selectedCategory || service.category?.name === selectedCategory)
                      .sort((a: services.Service, b: services.Service) => {
                        if (sortBy === 'name') {
                          return (a.name || '').localeCompare(b.name || '');
                        } else {
                          const priceA = Number(a.payment?.fixed?.price?.value || 0);
                          const priceB = Number(b.payment?.fixed?.price?.value || 0);
                          return priceA - priceB;
                        }
                      });

                    return (
                      <>
                        <p className="text-sm text-[#6b7280] mb-8">
                          Showing {filteredServices.length} design services
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          <ServiceRepeater>
                            {({ service }: { service: services.Service }) => {
                              console.log('[ServicesPage] ServiceRepeater render for service:', {
                                id: service._id,
                                name: service.name,
                                image: service.media?.mainMedia?.image,
                                category: service.category?.name,
                              });

                              if (!selectedCategory || service.category?.name === selectedCategory) {
                                return (
                                  <Service.Root service={service}>
                                    {({ service: rootService }: { service: services.Service }) => {
                                      console.log('[ServicesPage] Service.Root render for service:', {
                                        id: rootService._id,
                                        name: rootService.name,
                                        image: rootService.media?.mainMedia?.image,
                                        category: rootService.category?.name,
                                      });

                                      return (
                                        <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#e9ecef]">
                                          {/* Service Image */}
                                          <div className="aspect-[16/9] w-full overflow-hidden relative">
                                            <Service.Image className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {service.category?.name && (
                                              <div className="absolute top-4 left-4">
                                                <Service.Category className="bg-white/90 backdrop-blur-sm text-xs text-[#495057] px-3 py-1 rounded-full font-medium uppercase tracking-wider" />
                                              </div>
                                            )}
                                          </div>

                                          {/* Service Content */}
                                          <div className="p-6">
                                            <Service.Name className="text-xl font-medium text-[#212529] mb-3 group-hover:text-[#1a1f24] transition-colors" />
                                            <Service.Description className="text-[#6c757d] text-sm leading-relaxed mb-6 line-clamp-2" />

                                            {/* Service Details */}
                                            <div className="flex items-center justify-between text-sm border-t border-[#e9ecef] pt-4">
                                              <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-[#495057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <Service.Duration className="text-[#495057]" />
                                              </div>
                                              <Service.Price className="text-[#212529] font-medium" />
                                            </div>

                                            {/* Learn More Link */}
                                            <div className="mt-6">
                                              <a href="#" className="inline-flex items-center justify-center w-full bg-[#f8f9fa] text-[#212529] px-4 py-2 rounded-lg font-medium hover:bg-[#e9ecef] transition-colors">
                                                Learn more
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  </Service.Root>
                                );
                              }
                              return null;
                            }}
                          </ServiceRepeater>
                        </div>
                      </>
                    );
                  }}
                </Options>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#212529] text-white mt-24">
              <div className="max-w-7xl mx-auto">
                {/* Newsletter Section */}
                <div className="px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10">
                  <div className="max-w-xl mx-auto text-center">
                    <h3 className="text-2xl font-serif mb-3">Stay Inspired</h3>
                    <p className="text-[#adb5bd] mb-8">
                      Subscribe to our newsletter for design tips, trends, and exclusive offers.
                    </p>
                    <form className="flex gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-[#6c757d] focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                      <button className="bg-white text-[#212529] px-6 py-2 rounded-lg font-medium hover:bg-[#f8f9fa] transition-colors">
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-4 sm:px-6 lg:px-8 py-16">
                  <div>
                    <div className="flex items-center mb-6">
                      <svg className="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-xl font-serif"><span className="font-light">DESIGN</span><span className="font-medium">STUDIO</span></span>
                    </div>
                    <p className="text-[#adb5bd] leading-relaxed">
                      Creating beautiful, functional spaces that reflect your unique style and personality.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-wider text-[#6c757d] mb-6">Services</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Interior Design</a>
                      </li>
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Space Planning</a>
                      </li>
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Color Consultation</a>
                      </li>
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Furniture Selection</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-wider text-[#6c757d] mb-6">Company</h3>
                    <ul className="space-y-4">
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">About</a>
                      </li>
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Portfolio</a>
                      </li>
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Contact</a>
                      </li>
                      <li>
                        <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">Careers</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-wider text-[#6c757d] mb-6">Connect</h3>
                    <div className="flex space-x-5">
                      <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">
                        <span className="sr-only">Pinterest</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                        </svg>
                      </a>
                      <a href="#" className="text-[#dee2e6] hover:text-white transition-colors">
                        <span className="sr-only">Houzz</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 14.419l-8.419-8.419v-6l-7.581 7.581v6.838h-8v10.581h8v-6.419l8 8v-6.162h8v-6z"/>
                        </svg>
                      </a>
                    </div>
                    <div className="mt-8">
                      <h4 className="text-sm font-medium text-[#6c757d] mb-3">Contact Us</h4>
                      <p className="text-[#dee2e6]">
                        123 Design Street<br />
                        San Francisco, CA 94107<br />
                        <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a><br />
                        <a href="mailto:hello@designstudio.com" className="hover:text-white transition-colors">hello@designstudio.com</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 px-4 sm:px-6 lg:px-8 py-8">
                  <p className="text-sm text-[#6c757d] text-center">
                    © {new Date().getFullYear()} Design Studio. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        );
      }}
    </List>
  );
}
