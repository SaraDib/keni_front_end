import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import imagego from '../../assets/images/pomme.jpg';
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import kante from "../../assets/images/wave.svg";

import fcb from '../../assets/images/boro.webp';
import doctor from '../../assets/images/kora.jpg';

function Conseils() {

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
            <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">Conseil nutritionnel</h1>
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
          <h1 className="text-4xl text-blue-950 mb-5 font-dmsans max-sm:text-3xl">Conseils nutritionnels<br />
            – votre chemin vers une vie saine et heureuse</h1>
          <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            Vous souhaitez non seulement perdre du poids mais également mener une vie saine et active ?
          </h2>

          <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            Alors vous êtes au bon endroit ! En tant que physiothérapeute passionnée et nutritionniste agréée,<b>Mandy Schneiderat</b>  souhaite vous accompagner dans un voyage holistique qui vous aidera non seulement à atteindre le poids souhaité, mais vous donnera également plus d'énergie et de joie de vivre.
          </h2>

        </div>


        {/* Section 2 */}
        <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
          <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
            <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Ce que vous pouvez attendre de nos conseils nutritionnels</h1>

            <div className="mt-5">
              {[
                { idx: ">", p: "Analyse individuelle", pi: " Nous prenons le temps de connaître vos objectifs personnels, votre état de santé et vos ambitions sportives afin d'élaborer un plan individuel qui vous convient" },
                { idx: ">", p: "Nutrition et sport en harmonie", pi: " Avec nous, vous pouvez également utiliser l'espace d'entraînement et vous entraîner sur des équipements modernes qui vous aideront à atteindre vos objectifs" },
                { idx: ">", p: "Scientifiquement prouvé", pi: " Nos conseils sont basés sur les découvertes scientifiques actuelles. Nous vous offrons une expertise pratique pour acquérir une compréhension de base d'une alimentation équilibrée" },
                { idx: ">", p: "Les régimes drastiques", pi: " conduisent souvent à un succès à court terme – ensuite vient l’effet yo-yo. Notre objectif est de développer avec vous des habitudes alimentaires saines à long terme, où vous n'avez pas l'impression de devoir vous passer de quoi que ce soit." },

              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row text-gray-800 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
                >
                  <div className="pr-4 text-customGreen font-bold ">{item.idx} </div>
                  <div className='flex flex-col'>
                    <div className='text-black font-bold'>{item.p}</div>
                    <div className='mt-5'>{item.pi}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
            <img src={fcb} alt='inter' className="h-full w-full max-sm:h-auto" />
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
          <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
            <img src={doctor} alt='doctor' className="h-full object-cover max-sm:h-auto" />
          </div>

          <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
            <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Notre programme en conseil nutritionnel</h1>
            <h2 className='text-3xl text-white font-dmsans max-sm:text-2xl'>Vous pouvez réserver des rendez-vous individuels ou un programme de 9 semaines avec nous.</h2>
            <div className="mt-5">
              {[
                { idx: ">", p: "9 semaines de conseils nutritionnels (conseils supplémentaires possibles)" },
                { idx: ">", p: "6 séances de 60 min./40 min./30 min. chacune" },
                { idx: ">", p: "Échange par mail si des questions se posent" },
                { idx: ">", p: "Plans nutritionnels individuels" },
                { idx: ">", p: "une séance d'entraînement dure 60 minutes" },
                { idx: ">", p: "Utilisation de notre propre espace de formation avec des formateurs très bien formés" },
                { idx: ">", p: "Consultation initiale détaillée comprenant deux mesures avec notre balance d'analyse corporelle moderne" },


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
      </div>
    </div>
  )
}
export default Conseils;