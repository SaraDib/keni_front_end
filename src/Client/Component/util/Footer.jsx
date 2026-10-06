import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../config";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import image22 from "../../assets/images/icons8-@-50 (1).png";
import telephone from "../../assets/images/icons8-téléphone-50.png";
import position from "../../assets/images/icons8-position-24.png";
import handicap from "../../assets/images/icons8-fauteuil-roulant-30 (1).png";

function Footer() {
  const { t, i18n } = useTranslation(); // Get i18n instance and t function
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/centres`);
        setCentres(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching centres:", error);
        setError(i18n.language === 'ar' ? "فشل في تحميل بيانات المراكز" : "Failed to load centres data");
        setLoading(false);
      }
    };

    fetchCentres();
  }, [i18n.language]);

  // Helper function to get the appropriate text based on language
  const getLocalizedText = (item, field) => {
    if (i18n.language === 'ar' && item[`${field}AR`]) {
      return item[`${field}AR`];
    }
    return item[field];
  };

  // Transform API data to match the sections format
  const transformCentreToSection = (centre) => {
    // Create infos array based on centre data
    const infos = [
      { icon: position, text: getLocalizedText(centre, 'Adresse') },
      { icon: telephone, text: centre.Telephone },
    ];

    // Add Fix number if available
    if (centre.Fix) {
      infos.push({ icon: telephone, text: centre.Fix });
    }

    // Add email if available
    if (centre.Email) {
      infos.push({ icon: image22, text: centre.Email });
    }

    // Add handicap access info if available
    if (centre.Handicapes === 1) {
      infos.push({
        icon: handicap,
        text: t('footer.handicapAccess', 'Accès sans obstacle') // Default fallback if translation key doesn't exist
      });
    }

    // Transform horaires data
    const hours = centre.horaires.map(horaire => {
      return {
        jour: i18n.language === 'ar' && horaire.Day_Start_AR ? horaire.Day_Start_AR : horaire.Day_Start,
        horaire: horaire.isClosed === 1
          ? t('footer.closed', 'Fermé') // Use translation key for 'closed'
          : `${horaire.Time_Start.substring(0, 5)} - ${horaire.Time_End.substring(0, 5)}`
      };
    });

    return {
      id: `centre-${centre.ID_Center}`,
      title: getLocalizedText(centre, 'Nom'),
      infos,
      hours
    };
  };

  // Create sections from API data
  const sections = loading || error ? [] : centres.map(transformCentreToSection);

  if (loading) {
    return <div className="text-center py-12">{t('footer.loading', 'Chargement...')}</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <footer className="bg-white font-sans text-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Titre principal */}
        <div className="text-[#1a2a7b] text-3xl sm:text-4xl font-bold text-center mb-10">
          {t("footer.title")}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 ">
          {sections.map((section) => (
            <div key={section.id} className="flex flex-col gap-6">
              {/* Titre de la section */}
              <div>
                <h1 className="text-[#1a2a7b] text-xl sm:text-2xl font-semibold">
                  {section.title}
                </h1>
                <hr className="h-0.5 bg-gray-500 w-3/4 mt-2" />
              </div>

              {/* Informations */}
              <div className="flex flex-col gap-4">
                {section.infos.map((info, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-3 text-gray-600"
                  >
                    <img
                      src={info.icon}
                      alt={info.text}
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                    <p
                      className="text-lg sm:text-xl"
                      dangerouslySetInnerHTML={{ __html: info.text }}
                    />
                  </div>
                ))}
              </div>

              {/* Horaires */}
              <div className="lg:w-11/12">
                <h2 className="text-[#1a2a7b] text-lg sm:text-2xl font-body mt-6">
                  {t('footer.openingHours', "Horaires d'ouverture")}
                </h2>
                <div className="mt-4 space-y-2 font-sans !font-thin">
                  {section.hours.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-[#444444] sm:text-lg font-sans "
                    >
                      <span>{item.jour}</span>
                      <span>{item.horaire}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;