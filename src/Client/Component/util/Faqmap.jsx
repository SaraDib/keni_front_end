import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Mapfaq({ question, reponse, questionAR, reponseAR }) {
  const { i18n } = useTranslation();
  const [Afficherplus, setAfficherplus] = useState(false);

  const toggleAfficherplus = () => {
    setAfficherplus(!Afficherplus);
  };

  const isArabic = i18n.language === "ar";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        {/* Question */}
        <button
          className={`w-full text-lg sm:text-xl font-semibold hover:text-blue-800 focus:outline-none text-blue-700 ${
            isArabic ? "text-right" : "text-left"
          }`}
          onClick={toggleAfficherplus}
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic && questionAR ? questionAR : question}
        </button>

        {/* Toggle + / − */}
        <div className={`flex ${isArabic ? "justify-start sm:justify-end" : "justify-end sm:justify-start"}`}>
          <button
            className="text-3xl sm:text-4xl text-customGreen cursor-pointer focus:outline-none"
            onClick={toggleAfficherplus}
          >
            {Afficherplus ? "−" : "+"}
          </button>
        </div>
      </div>

      <hr className="border-t border-gray-400 my-3" />

      {Afficherplus && (
        <div
          className={`text-gray-600 text-base sm:text-base leading-relaxed`}
          dir={isArabic ? "rtl" : "ltr"}
        >
          {isArabic && reponseAR ? reponseAR : reponse}
          <hr className="border-t border-gray-400 my-3" />
        </div>
      )}
    </div>
  );
}

function Faq() {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/faqs")
      .then((response) => {
        setFaqData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching FAQ data:", error);
        setError("Failed to load FAQ data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white pb-10 text-center py-12">
        <div className="h-28 bg-white"></div>
        <div>Chargement des FAQs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white pb-10 text-center py-12">
        <div className="h-28 bg-white"></div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const isArabic = i18n.language === "ar";

  return (
    <div className="bg-white pb-10" dir={isArabic ? "rtl" : "ltr"}>
      <div className="h-28 bg-white"></div>

      {/* Header */}
      <div className="bg-white sm:ps-36 lg:ms-1">
        <div className={`text-4xl font-sans text-blue-800 ${isArabic ? "text-right" : "text-left"}`}>
          {t("faqs.title")}
        </div>
        <div className={`text-2xl font-sans text-customGreen mt-4 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
          {t("faqs.subtitle")}
        </div>
      </div>

      {/* FAQ list */}
      {faqData.length > 0 ? (
        faqData.map((item) => (
          <Mapfaq
            key={item.ID_FAQ}
            question={item.Question}
            reponse={item.Reponse}
            questionAR={item.QuestionAR}
            reponseAR={item.ReponseAR}
          />
        ))
      ) : (
        <div className="w-full max-w-6xl mx-auto px-4 text-center py-8">
          {isArabic ? "لا توجد أسئلة متاحة حالياً" : "Aucune FAQ disponible pour le moment."}
        </div>
      )}
    </div>
  );
}

export default Faq;
