import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/Blue Logo.png";
import Phone from "../../assets/images/BluePhone.png";
import WhatsApp from "../../assets/images/whatsappBlue.png"; 
import LanguageSwitcher from "../util/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function BlueNavbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Fetch services from API
    fetch('http://keniweb.test/api/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkStyle =
    "relative overflow-hidden inline-block transition-all duration-300 " +
    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[var(--after-width)] after:h-[2px] " +
    "after:bg-customGreen after:transition-all after:duration-300 after:origin-center " +
    "hover:after:w-full pointer-events-auto";

  const mainRoutes = [
    "/quiSommesNous",
    "/Offresdemploi",
    "/FAQ",
    "/Contact",
  ];

  // Function to get service name based on current language
  const getServiceName = (service) => {
    return i18n.language === 'ar' && service.NomAR ? service.NomAR : service.Nom;
  };

  return (
    <nav className="w-full fixed top-0 z-50 shadow-md" style={{ backgroundColor: '#1A2A7B' }}>
      <div className="container mx-auto max-sm:mx-0 flex justify-between items-center p-4 max-sm:pt-4">
        {/* Logo - reste fixe */}
        <Link to="/" className="text-xl font-bold text-white z-50 mr-8"> 
          <img src={Logo} alt="Logo" className="w-64 max-sm:w-44 max-sm:h-16" />
        </Link>

        {/* Hamburger Button - reste fixe */}
        <button
          className="lg:hidden flex flex-col justify-center items-center z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <></>  
          ) : (
            <>
              <span className="block w-6 h-0.5 bg-white transition-all duration-300 mb-1.5"></span>
              <span className="block w-6 h-0.5 bg-white transition-all duration-300 mb-1.5"></span>
              <span className="block w-6 h-0.5 bg-white transition-all duration-300"></span>
            </>
          )}
        </button>

        {/* Mobile Menu - overlay complet */}
        <div
          className={`fixed lg:hidden inset-0 w-full h-full transition-opacity duration-300 z-40 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: '#1A2A7B' }}
        >
          {/* Header fixe avec logo et bouton fermer */}
          <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50" style={{ backgroundColor: '#1A2A7B' }}>
            <Link to="/" className="text-xl font-bold text-white" onClick={() => setIsMobileMenuOpen(false)}> 
              <img src={Logo} alt="Logo" className="w-44 h-16" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-4xl font-light"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>

          {/* Contenu défilable */}
          <div className="pt-28 pb-24 h-full overflow-y-auto">
            <div className="px-6 flex flex-col space-y-6">
              <Link
                to="/"
                className={`text-lg font-medium py-2 border-b border-gray-200 ${
                  isActive("/") ? "text-white font-bold" : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navbar.start')}
              </Link>

              <div className="flex flex-col">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`text-lg font-medium py-2 border-b border-gray-200 text-left flex justify-between items-center ${
                    services.some(service => isActive(`/service/${service.ID_Service}`)) ? "text-white font-bold" : "text-gray-300"
                  }`}
                >
                  {t('navbar.services')}
                  <span
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="ml-4 flex flex-col space-y-2 mt-2">
                    {services.map((service) => (
                      <Link
                        key={service.ID_Service}
                        to={`/service/${service.ID_Service}`}
                        className={`py-1 ${
                          isActive(`/service/${service.ID_Service}`) ? "text-white font-bold" : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {getServiceName(service)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {mainRoutes.map((path, index) => (
                <Link
                  key={path}
                  to={path}
                  className={`text-lg font-medium py-2 border-b border-gray-200 ${
                    isActive(path) ? "text-white font-bold" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {[t('navbar.about'), t('navbar.jobs'), t('navbar.faq'), t('navbar.contact')][index]}
                </Link>
              ))}
            </div>
          </div>

          {/* Boutons en bas (fixes) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center space-x-4" style={{ backgroundColor: '#1A2A7B' }}>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-white px-4 max-sm:pr-2 py-3 rounded-full hover:bg-customGreen"
              style={{ color: '#1A2A7B' }}
            >
              <img src={WhatsApp} alt="WhatsApp" className="size-6 inline mr-2" />
            </a>

            <button
              className="flex items-center justify-center space-x-2 bg-white px-4 py-3 rounded-full hover:bg-customGreen"
              style={{ color: '#1A2A7B' }}
            >
              <img src={Phone} alt="Phone" className="size-5 inline mr-2" />
              <span>0201 9776650</span>
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            to="/"

            className={`${linkStyle} ${
              isActive("/") ? "text-white" : "text-gray-300"
            } hover:text-white text-lg`}
            style={{ "--after-width": isActive("/") ? "100%" : "0" , marginLeft:"20px"}}
          >
            {t('navbar.start')}
          </Link>

          <div className="relative">
            <button
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              className={`${linkStyle} ${
                services.some(service => isActive(`/service/${service.ID_Service}`)) ? "text-white" : "text-gray-300"
              } hover:text-white flex items-center text-lg`}
              style={{ 
                "--after-width": services.some(service => isActive(`/service/${service.ID_Service}`)) ? "100%" : "0",
                color: services.some(service => isActive(`/service/${service.ID_Service}`)) ? 'white' : ''
              }}
            >
              {t('navbar.services')}
              <span className="ml-1">▾</span>
            </button>
            {isOpen && (
              <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="absolute top-7 left-0 bg-white w-48 shadow-lg"
                style={{ color: '#1A2A7B' }}
              >
                {services.map((service) => (
                  <Link
                    key={service.ID_Service}
                    to={`/service/${service.ID_Service}`}
                    className={`block w-full px-6 py-2 hover:bg-customGreen text-lg
                      ${isActive(`/service/${service.ID_Service}`) ? 'bg-customGreen relative' : ''}`}
                  >
                    {getServiceName(service)}
                    {isActive(`/service/${service.ID_Service}`) && (
                      <span 
                        className="absolute bottom-0 left-0 w-full h-1 bg-customGreen"
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainRoutes.map((path, index) => (
            <Link
              key={path}
              to={path}
              className={`${linkStyle} ${
                isActive(path) ? "text-white" : "text-gray-300"
              } hover:text-white text-lg`}
              style={{ "--after-width": isActive(path) ? "100%" : "0" }}
            >
              {[t('navbar.about'), t('navbar.jobs'), t('navbar.faq'), t('navbar.contact')][index]}
            </Link>
          ))}
        </div>
        <LanguageSwitcher />
        {/* Desktop Button Group */}
        <div className="hidden lg:flex items-center ml-8">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-white border-2 border-solid px-2 py-1 rounded-full hover:border-blue-800 hover:bg-customGreen mr-1"
            style={{ borderColor: '#1A2A7B', color: '#1A2A7B' }}
          >
            <img src={WhatsApp} alt="WhatsApp" className="size-7 inline m-2" />
          </a>

          <button
            className="flex items-center space-x-2 bg-white border-2 border-solid px-4 py-2 rounded-full hover:border-blue-800 hover:bg-customGreen"
            style={{ borderColor: '#1A2A7B', color: '#1A2A7B' }}
          >
            <img src={Phone} alt="Phone" className="size-5 inline m-2" />
            <span>0201 9776650</span>
          </button>
        </div>
      </div>
    </nav>
  );
}