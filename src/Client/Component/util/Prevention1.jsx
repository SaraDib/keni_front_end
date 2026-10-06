import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import imagego from '../../assets/images/DSC01589-2880w.jpg';
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import kante from "../../assets/images/wave.svg";
function Ergothrapie1() {

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


        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between">

          <div data-aos="zoom-in" className="absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 lg:ml-14 sm:flex sm:justify-start text-white p-4">
            <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">Prévention</h1>
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
    </div>
  )
}
export default Ergothrapie1;