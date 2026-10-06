import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import imagego from '../../assets/images/image1.webp';
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import kante from "../../assets/images/wave.svg";

import fcb from '../../assets/images/JOG_8931-1368w.webp';
import doctor from '../../assets/images/vini.jpg';

import city from '../../assets/images/FAQimage.jpg';
import diaz from '../../assets/images/diaz.jpg';
import arabi from '../../assets/images/yogawom.jpg';

import timber from '../../assets/images/timber.webp';

function Service() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durée de l'animation
      once: true,     // L'animation ne se répète qu'une seule fois
    });
  }, []);


  return (
    <div>
      <div className="w-full h-screen overflow-hidden relative">
        <img
          src={imagego}
          alt="FAQ"
          className="w-full h-full object-cover"
        />


        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between">

          <div data-aos="zoom-in" className="absolute bottom-1/2 sm:bottom-1/3 lg:ml-14 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4">
            <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">Services supplémentaires</h1>
            <h2 className="text-customGreen sm:text-4xl font-dmsans max-sm:text-2xl">
              GlobalHealth - Therapy & Training Center
            </h2>
          </div>

          <div className="hidden md:flex absolute top-2/4 sm:bottom-6 left-24 max-sm:left-6  max-sm:bottom-44 sm:right-16 flex flex-row items-end justify-self-end gap-4 sm:flex-col w-12 z-40">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
                <img src={fb} alt="facebook" className="w-full" />
              </div>
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
                <img src={insta} alt="instagram" className="w-full" />
              </div>
            </a>
          </div>

          <div className="absolute bottom-0 w-full">
            <img src={kante} alt="kante" className="w-full" />
          </div>
        </div>
      </div>

      <div>
        {/* Section 1 */}
        <div className="bg-white px-44 py-10 flex flex-col gap-4 max-sm:px-4 max-sm:py-6">
          <h1 className="text-4xl text-blue-950 mb-5 font-dmsans max-sm:text-3xl">
            Promotion de la santé en entreprise
          </h1>
          <h2 className="pr-4 text-customGreen font-dmsans text-2xl ">La réussite économique grâce à la performance </h2>

          <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            Le centre de santé et de sport d'Essen-Frintrop propose une promotion de la santé en entreprise par le biais de thérapies
            professionnelles et de programmes de formation.
            Nos programmes sur mesure aident les entreprises à soutenir et à promouvoir la santé et
            le bien-être à long terme de leurs employés.
          </h2>

        </div>
      </div>
      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Employés</h1>

          <div className="mt-5">
            {[
              { idx: ">", p: "Employés qualifiés" },
              { idx: ">", p: "Des employés en bonne santé et très motivés" },
              { idx: ">", p: "identification avec l'entreprise" },
              { idx: ">", p: "Marque forte en interne et en externe" },


            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-800 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div>{item.p}</div>
              </div>
            ))}
          </div>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={fcb} alt='inter' className="h-full w-full max-sm:h-auto" />
        </div>
      </div>

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={doctor} alt='doctor' className="h-full object-cover max-sm:h-auto" />
        </div>

        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Module BGF</h1>
          <div className="mt-5">
            {[
              { idx: ">", p: "événement d'information pour les gestionnaires" },
              { idx: ">", p: "conseil en ergonomie du lieu de travail" },
              { idx: ">", p: "Exercice et détente au travail" },

            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-100 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div>{item.p}</div>
              </div>
            ))}
          </div>

          <div className="ml-6" ><img src={timber} alt='timber' /> </div>
        </div>
      </div>

      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Module BGM</h1>

          <div className="mt-5">
            {[
              { idx: ">", p: "anamnèse des données d'entreprise pertinentes pour la santé" },
              { idx: ">", p: "Discussion sur la stratégie Objectifs de l'entreprise" },
              { idx: ">", p: "marketing BGM interne" },
              { idx: ">", p: "événement d'information « Fitness et sport santé en entreprise » " },
              { idx: ">", p: "Atelier après 6 mois « Evaluation et recalibrage des mesures »" },
              { idx: ">", p: "ROI Présentation des résultats, ajustement des mesures si nécessaire " },


            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-800 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div>{item.p}</div>
              </div>
            ))}
          </div>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={city} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
      </div>

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={diaz} alt='doctor' className="h-full object-cover max-sm:h-auto" />
        </div>

        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Baustein Firmenfitness</h1>
          <div className="mt-5">
            {[
              { idx: ">", p: "Individuelle Förderung der Mitarbeitergesundheit " },
              { idx: ">", p: "Mitarbeiter-Gesundheitscheck, Monitoring relevanter Körper,- und Leistungsparameter" },
              { idx: ">", p: "Individuelles, persönliches Trainings-Programm" },
              { idx: ">", p: "Verschiedene Kursprogramme" },
              { idx: ">", p: "Wellness, Entspannung" },
              { idx: ">", p: "Ernährungserstberatung, Gesundheitscoaching" },
              { idx: ">", p: "Employer Branding: dem Mitarbeiter wird ein hohes Maß an Wertschätzung entgegengebracht" },
              { idx: ">", p: "Durch Maßnahme das Gemeinschaftsgefühl in allen Unternehmensebenen stärken" },

            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-100 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div>{item.p}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      < div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Module BGM</h1>

          <div className="mt-5">
            {[
              { idx: ">", p: "anamnèse des données d'entreprise pertinentes pour la santé" },
              { idx: ">", p: "Discussion sur la stratégie Objectifs de l'entreprise" },
              { idx: ">", p: "marketing BGM interne" },
              { idx: ">", p: "événement d'information « Fitness et sport santé en entreprise » " },
              { idx: ">", p: "Atelier après 6 mois « Evaluation et recalibrage des mesures »" },
              { idx: ">", p: "ROI Présentation des résultats, ajustement des mesures si nécessaire " },


            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-800 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div>{item.p}</div>
              </div>
            ))}
          </div>
        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={arabi} alt='inter' className="h-full w-full max-sm:h-auto" />
        </div>
      </div>
    </div>
  )
}
export default Service;