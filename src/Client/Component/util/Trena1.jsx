import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import imagego from '../../assets/images/sport.jpg';
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import kante from "../../assets/images/wave.svg";

import fcb from '../../assets/images/boro.webp';
import doctor from '../../assets/images/kora.jpg';

function Arena() {

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
            <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">T-RENA</h1>
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
          <h1 className="text-4xl text-blue-950 mb-5 font-dmsans max-sm:text-3xl">T-RENA</h1>
          <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            Êtes-vous en réadaptation en milieu hospitalier ?<br />
            Vous pouvez ensuite poursuivre votre formation et favoriser votre réadaptation grâce à votre assurance pension.
          </h2>

          <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
              Restaurer les performances physiques après la rééducation grâce à un entraînement assisté par équipement.
              Vous pouvez le faire avec notre formation de suivi de rééducation thérapeutique T-RENA. Le T-RENA est principalement
              réalisé dans des centres de rééducation, des centres de santé, des cabinets de physiothérapie ou des hôpitaux.
              On utilise parfois pour cela les termes entraînement de renforcement
              musculaire, thérapie d'entraînement médical ou musculation sur matériel médical. Vous pouvez trouver votre fournisseur local ici.
            </h2>
          </h2>

        </div>


        {/* Section 2 */}
        <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
          <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
            <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Quand faut-il envisager le T-RENA ?</h1>

            <div className="mt-5">
              {[
                { idx: ">", p: "en cas de limitations fonctionnelles de l'appareil locomoteur" },
                { idx: ">", p: "si les services de thérapie par la formation ont déjà été utilisés avec succès lors d'une réadaptation médicale" },
                { idx: ">", p: "si l'on veut encore améliorer les performances physiques et la résilience après la rééducation" },

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

        {/* Section 5 */}
        <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
          <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
            <img src={doctor} alt='doctor' className="h-full object-cover max-sm:h-auto" />
          </div>

          <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
            <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">processus de T-RENA</h1>
            <div className="mt-5">
              {[
                { idx: ">", p: "Commencer dans les 4 semaines (6 semaines au plus tard) après la rééducation" },
                { idx: ">", p: "26 séances de formation (plus une formation d'initiation individuelle) en groupe ouvert" },
                { idx: ">", p: "maximum de 12 participants par groupe" },
                { idx: ">", p: "Cl'entraînement est généralement effectué 1 à 2 fois par semaine" },
                { idx: ">", p: "une séance d'entraînement dure 60 minutes" },
                { idx: ">", p: "Si nécessaire, T-RENA peut être prolongé de 26 séances de formation supplémentaires" },

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
export default Arena;