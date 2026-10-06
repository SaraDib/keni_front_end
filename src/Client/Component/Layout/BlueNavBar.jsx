import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Phone from "../../assets/images/BluePhone.png";
import WhatsApp from "../../assets/images/whatsappBlue.png";
import LanguageSwitcher from "../util/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API_BASE_URL from "../../../config";

export default function BlueNavbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [logoUrl, setLogoUrl] = useState(""); // logo dynamique
  const [phone, setPhone] = useState("0201 9776650"); // default
  const [whatsapp, setWhatsapp] = useState("1234567890"); // default
  const location = useLocation();

  const isArabic = i18n.language === "ar";

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fetch services
  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then((r) => r.json())
      .then((data) => setServices(data || []))
      .catch((e) => console.error("Error fetching services:", e));
  }, []);

  // Fetch entreprise info (logo, phone, whatsapp)
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/entreprises/1`) // remplace 1 par l'ID correct
      .then((res) => {
        const entreprise = res.data.data || res.data;
        if (entreprise.Logo) {
          setLogoUrl(`${API_BASE_URL.replace('/api', '/storage')}/${entreprise.Logo}`);
        }
        if (entreprise.Telephone) {
          setPhone(entreprise.Telephone);
        }
        if (entreprise.Whatsapp) {
          setWhatsapp(entreprise.Whatsapp);
        }
      })
      .catch((err) => console.error("Erreur récupération entreprise:", err));
  }, []);

  const isActive = (path) => location.pathname === path;

  // underline direction
  const linkStyle =
    "relative overflow-hidden inline-block transition-all duration-300 " +
    "after:content-[''] after:absolute after:bottom-0 " +
    (isArabic ? "after:right-0 " : "after:left-0 ") +
    "after:w-[var(--after-width)] after:h-[2px] after:bg-customGreen after:transition-all after:duration-300 " +
    "hover:after:w-full pointer-events-auto";

  const mainRoutes = ["/quiSommesNous", "/Offresdemploi", "/FAQ", "/Contact"];
  const getServiceName = (s) => (isArabic && s.NomAR ? s.NomAR : s.Nom);

  // Logo
  const LogoBlock = (
    <Link to="/" className="text-lg font-bold text-white z-50 flex-shrink-0">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo"
          className="w-56 max-sm:w-44 max-sm:h-16 flex-shrink-0"
        />
      ) : (
        <div className="w-56 max-sm:w-44 max-sm:h-16 flex-shrink-0" />
      )}
    </Link>
  );

  // Contacts
  const ContactsBlock = (
    <div className="hidden xl:flex items-center gap-x-2">
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-x-2 bg-white border-2 border-solid px-2 py-1 rounded-full hover:border-blue-800 hover:bg-customGreen"
        style={{ borderColor: "#1A2A7B", color: "#1A2A7B" }}
      >
        <img src={WhatsApp} alt="WhatsApp" className="inline m-2 w-5" />
      </a>

      <button
        className="flex items-center gap-x-2 bg-white border-2 border-solid px-2 py-2 rounded-full hover:border-blue-800 hover:bg-customGreen"
        style={{ borderColor: "#1A2A7B", color: "#1A2A7B" }}
      >
        <img src={Phone} alt="Phone" className="inline m-2 w-5" />
        <span className="text-sm" style={{ direction: "ltr" }}>
          {phone}
        </span>
      </button>

    </div>
  );

  return (
    <nav
      className="w-full fixed top-0 z-50 shadow-md"
      style={{ backgroundColor: "#1A2A7B" }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* === HEADER DESKTOP / MOBILE TOP === */}
      <div
        className={`w-full flex items-center p-4 px-3 gap-x-6 transition-opacity duration-300 ${isArabic ? "pr-6" : "pl-6"} ${isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        {LogoBlock}

        {/* === HAMBURGER pour mobiles === */}
        <button
          className={`lg:hidden flex flex-col justify-center items-center z-50 ${isArabic ? "order-last" : "order-last"
            }`}
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

        {/* Menu desktop centré */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-x-8">
          <Link
            to="/"
            className={`${linkStyle} ${isActive("/") ? "text-white" : "text-gray-300"
              } hover:text-white text-base`}
            style={{ "--after-width": isActive("/") ? "100%" : "0" }}
          >
            {t("navbar.start")}
          </Link>

          {/* Services */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              className={`${linkStyle} ${services.some((s) => isActive(`/service/${s.ID_Service}`))
                ? "text-white"
                : "text-gray-300"
                } hover:text-white flex items-center text-base`}
              style={{
                "--after-width": services.some((s) =>
                  isActive(`/service/${s.ID_Service}`)
                )
                  ? "100%"
                  : "0",
              }}
            >
              {t("navbar.services")}
              <span className={isArabic ? "mr-1" : "ml-1"}>▾</span>
            </button>

            {isOpen && (
              <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className={`absolute top-7 ${isArabic ? "right-0 text-right" : "left-0 text-left"
                  } bg-white w-56 shadow-lg`}
                style={{ color: "#1A2A7B" }}
              >
                {services.map((service) => (
                  <Link
                    key={service.ID_Service}
                    to={`/service/${service.ID_Service}`}
                    className={`block w-full px-6 py-2 hover:bg-customGreen text-base ${isActive(`/service/${service.ID_Service}`)
                      ? "bg-customGreen relative"
                      : ""
                      }`}
                  >
                    {getServiceName(service)}
                    {isActive(`/service/${service.ID_Service}`) && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-customGreen" />
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
              className={`${linkStyle} whitespace-nowrap text-base sm:text-sm ${isActive(path) ? "text-white" : "text-gray-300"
                } hover:text-white`}
              style={{ "--after-width": isActive(path) ? "100%" : "0" }}
            >
              {[t("navbar.about"), t("navbar.jobs"), t("navbar.faq"), t("navbar.contact")][index]}
            </Link>
          ))}

          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Contacts à droite */}
        <div className="ml-auto">{ContactsBlock}</div>
      </div>

      {/* === MOBILE (overlay) === */}
      <div
        className={`fixed lg:hidden inset-0 w-full h-full transition-opacity duration-300 z-[60] ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{ backgroundColor: "#1A2A7B" }}
      >
        <div
          className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50"
          style={{ backgroundColor: "#1A2A7B" }}
        >
          {LogoBlock}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-4xl font-light"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <div className="pt-28 pb-24 h-full overflow-y-auto">
          <div
            className={`px-6 flex flex-col gap-y-6 ${isArabic ? "text-right" : "text-left"
              }`}
          >
            <Link
              to="/"
              className={`text-base font-medium py-2 border-b border-gray-200 ${isActive("/")
                ? "text-white font-bold"
                : "text-gray-300 hover:text-white"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("navbar.start")}
            </Link>

            {/* Services mobile */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`text-base font-medium py-2 border-b border-gray-200 text-left flex justify-between items-center ${services.some((s) => isActive(`/service/${s.ID_Service}`))
                  ? "text-white font-bold"
                  : "text-gray-300"
                  }`}
              >
                {t("navbar.services")}
                <span
                  className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                    } ${isArabic ? "mr-1" : "ml-1"}`}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <div
                  className={`${isArabic ? "mr-0" : "ml-4"} flex flex-col gap-y-2 mt-2`}
                >
                  {services.map((service) => (
                    <Link
                      key={service.ID_Service}
                      to={`/service/${service.ID_Service}`}
                      className={`py-1 ${isActive(`/service/${service.ID_Service}`)
                        ? "text-white font-bold"
                        : "text-gray-400 hover:text-white"
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
                className={`text-lg font-medium py-2 border-b border-gray-200 ${isActive(path) ? "text-white font-bold" : "text-gray-300 hover:text-white"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {[t("navbar.about"), t("navbar.jobs"), t("navbar.faq"), t("navbar.contact")][index]}
              </Link>
            ))}
          </div>
        </div>

        {/* Boutons bas mobile */}
        <div
          className={`fixed bottom-0 left-0 right-0 p-4 flex justify-center gap-x-4 ${isArabic ? "flex-row-reverse" : ""
            }`}
          style={{ backgroundColor: "#1A2A7B" }}
        >
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-x-2 bg-white px-4 max-sm:pr-2 py-3 rounded-full hover:bg-customGreen"
            style={{ color: "#1A2A7B" }}
          >
            <img src={WhatsApp} alt="WhatsApp" className="w-6 h-6 inline" />
          </a>

          <button
            className="flex items-center space-x-2 bg-white border-2 border-solid px-2 py-2 rounded-full hover:border-blue-800 hover:bg-customGreen "
            style={{ borderColor: '#1A2A7B', color: '#1A2A7B' }}
          >
            <img src={Phone} alt="Phone" className="inline m-2 w-5 sm:w-4 md:w-4" />
            <span className="text-sm mr-5">{phone}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
