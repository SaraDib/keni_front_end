import { useEffect, useState } from 'react';
import 'aos/dist/aos.css'; 
import AOS from 'aos';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

import DC from '../../assets/images/DSC01864-2880w.webp'
import Wave from '../../assets/images/wave.svg'
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import Image1 from '../../assets/images/T+2+2023-11-08+10_33_40-2880w.webp'
import image3 from '../../assets/images/shutterstock_575303488-684747b5-2880w.webp'
import image5 from '../../assets/images/image5.jpg';
import image6 from '../../assets/images/image6.jpg';
import image7 from '../../assets/images/image7.jpg';
import image8 from '../../assets/images/image8.jpg';
import image9 from '../../assets/images/image9.jpg';
import image10 from '../../assets/images/image10.jpg';
import image13 from '../../assets/images/image13.jpg';
import image14 from '../../assets/images/image14.jpg';
import image15 from '../../assets/images/image15.jpg';

// import OpacityComponent from './OpacityComponent';




function Services1({ serviceData }) {
  const { i18n } = useTranslation(); // Get i18n instance
  const [service, setService] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [rows, setRows] = useState([]);
  const [pairRowServices, setPairRowServices] = useState([]);
  const [impairRowServices, setImpairRowServices] = useState([]);
  const [firstRowService, setFirstRowService] = useState(null);
  console.log(serviceData);
    useEffect(() => {

                AOS.init({
                  duration: 1000, // Durée de l'animation
                  once: true,     // L'animation ne se répète qu'une seule fois
                });
              }, []);
              useEffect(() => {
              setFirstRowService(serviceData.row_services.find(service => service.Classement === 1))
              setPairRowServices(serviceData.row_services.filter(service => service.Classement % 2 === 0))
              setImpairRowServices(serviceData.row_services.filter(service => service.Classement % 2 !== 0 && service.Classement !== 1))
              },[]);
              
  // Helper function to get the appropriate text based on language
  const getLocalizedText = (item, field) => {
    if (i18n.language === 'ar' && item[`${field}AR`]) {
      return item[`${field}AR`];
    }
    return item[field];
  };
  
  return (
    <div>
    <div className=" w-full h-screen overflow-hidden relative">
    <img 
      src={'http://keniweb.test/api/services/'+serviceData.ID_Service+'/photo'} 
      alt="FAQ" 
      className="w-full h-full object-cover"
    />


<div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between">

<div data-aos="zoom-in" className="absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4 lg:ml-14">
  <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">{getLocalizedText(serviceData, 'Nom')}</h1>
  <h2 className="text-customGreen sm:text-4xl font-dmsans max-sm:text-2xl" >
  {getLocalizedText(serviceData, 'Descriptions')}
  </h2>
</div>

<div className="absolute top-2/4 sm:bottom-6 left-24 max-sm:left-6  max-sm:bottom-44 sm:right-16 flex flex-row items-end gap-4 sm:flex-col">
  
  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
    <div className="bg-white rounded-full w-12 sm:w-14 hover:translate-x-4 transition-all cursor-pointer">
      <img src={fb} alt="facebook" className="w-full"/>
    </div>
  </a>

  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <div className="bg-white rounded-full w-12 sm:w-14 hover:translate-x-4 transition-all cursor-pointer">
      <img src={insta} alt="instagram" className="w-full"/>
    </div>
  </a>
</div>

<div className="absolute bottom-0 w-full">
  <img src={Wave} alt="kante" className="w-full"/>
</div>
</div>
    </div>
    {/* first Row */}
    {firstRowService && (
      <div className="bg-white max-w-0xl mx-auto p-4 md:p-6 font-salam" >
        <div dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' && firstRowService.TextAR ? firstRowService.TextAR : firstRowService.Text }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pl-40 max-sm:pl-0 overflow-hidden w-11/12 max-sm:w-full h-full md:h-[250px]">
          {firstRowService.photos && firstRowService.photos.length > 0 && (
            <>
              <div data-aos="fade-right" className="overflow-hidden">
                <img
                  src={`http://keniweb.test/api/photos/${firstRowService.photos[0].ID_Photo}/image`}
                  alt="Physiothérapie 1"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              {firstRowService.photos.length > 1 && (
                <div data-aos="fade-left" className="overflow-hidden">
                  <img
                    src={`http://keniweb.test/api/photos/${firstRowService.photos[1].ID_Photo}/image`}
                    alt="Physiothérapie 2"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )}


     {/* Paire Row */}
    {pairRowServices.map((service)=>(
     <div  className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
     <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full" >
     <div dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' && service.TextAR ? service.TextAR : service.Text }} />




   </div>
   <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
     <img  src={'http://keniweb.test/api/photos/'+service.photos[0].ID_Photo+'/image'} alt='inter' className="h-full object-cover max-sm:h-auto" />
   </div>
   </div>
    ))}

        {/* Impaire Row */}

        {impairRowServices.map((service) => (
      <div key={service.ID_Row_Service} className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          {service.photos && service.photos.length > 0 && (
            <img src={`http://keniweb.test/api/photos/${service.photos[0].ID_Photo}/image`} alt='chelsea' className="h-full w-full object-cover max-sm:h-auto" />
          )}
        </div>
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full text-white">
        <div dangerouslySetInnerHTML={{ __html: i18n.language === 'ar' && service.TextAR ? service.TextAR : service.Text }} />
        </div>
        </div>
      </div>
    ))}


</div>
  )
}

export default Services1
