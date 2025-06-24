import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import image22 from '../../assets/images/icons8-50.png';
import telephone from '../../assets/images/icons8-téléphone-96 (1).png';
import position from '../../assets/images/icons8-position-50.png';
import handicap from '../../assets/images/icons8-fauteuil-roulant-30.png';
import parking from '../../assets/images/icons8-parking-50.png';
import bus from '../../assets/images/icons8-autobus-24.png';
import internet from '../../assets/images/icons8-internet-64.png';
import LeafletMap from './LeafletMap';


function ContactLoca() {
    const [centres, setCentres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        setLoading(true);
        axios.get('http://keniweb.test/api/centres')
            .then(response => {
                setCentres(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error loading centres');
                setLoading(false);
            });
    }, []);

    const RenderSection = ({ centre, index }) => {
        const isEven = index % 2 === 0;
        
        return (
            isEven ? (
                <div className="flex flex-row gap-6 bg-[#1a2a7b] text-white py-10 items-center text-xl px-4">
                    <div 
                        data-aos="fade-zoom-in"
                        data-aos-easing="ease-in-back"
                        data-aos-delay="100"
                        data-aos-offset="0"
                        className='flex gap-8 max-sm:flex-col w-full overflow-x-auto'
                    >
                        <div 
                            data-aos="fade-right" 
                            data-aos-delay="500"
                            className='w-2/4 max-sm:w-full'
                        >
                            <LeafletMap position={centre.Positions}/>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <div className="flex flex-col items-center sm:ml-44 mb-8">
                                <h1 className="text-3xl sm:text-5xl text-center sm:text-left">{centre.Nom}</h1>
                            </div>

                            <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 ml-8 max-sm:ml-0 items-center text-gray-300">
                                <img src={position} alt="position" className="w-6 h-6 sm:w-8 sm:h-8"/>
                                <h1 className="text-center sm:text-left">{centre.Adresse}</h1>
                            </div>

                            <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 ml-8 max-sm:mr-0 items-center text-gray-300">
                                <img src={telephone} alt="telephone" className="w-6 h-6 sm:w-8 sm:h-8"/>
                                <h1 className="text-center sm:text-left">{centre.Telephone}</h1>
                            </div>

                            <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 ml-8 max-sm:mr-0 items-center text-gray-300">
                                <img src={telephone} alt="telephone" className="w-6 h-6 sm:w-8 sm:h-8"/>
                                <h1 className="text-center sm:text-left">{centre.Fix}</h1>
                            </div>

                            <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 ml-8 max-sm:ml-0 items-center text-gray-300">
                                <img src={image22} alt="email" className="w-6 h-6 sm:w-8 sm:h-8"/>
                                <h1 className="text-center sm:text-left">{centre.Email}</h1>
                            </div>

                            <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 ml-8 items-center text-gray-300">
                                <img src={handicap} alt="handicap" className="w-6 h-6 sm:w-8 sm:h-8"/>
                                <h1>{centre.Handicapes === 1 ? 'Accès sans obstacle' : 'Pas d\'accès pour handicapés'}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-row gap-6 bg-gray-400 text-white py-10 items-center text-xl px-4">
                    <div data-aos="fade-zoom-in"
                        data-aos-easing="ease-in-back"
                        data-aos-delay="100"
                        data-aos-offset="00"
                        className='flex flex-row-reverse gap-8 max-sm:flex-col w-full overflow-x-auto'>
                        <div data-aos="fade-left" data-aos-delay="500"
                        className='w-2/4 mt-28 mr-10 max-sm:w-full max-sm:mt-0 max-sm:mr-0'>
                                <LeafletMap/>
                        </div>
                        
                        <div className='flex flex-col gap-6 '>
                        <div className="flex flex-col items-center sm:ml-56 mb-8 max-sm:ml-0">
                            <h1 className="text-3xl sm:text-5xl text-center ">{centre.Nom}</h1>
                        </div>


                        {/* Adresse */}
                        <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 items-center text-gray-700">
                            <img src={position} alt="position" className="w-6 h-6 sm:w-8 sm:h-8"/>
                            <h1 className="text-center sm:text-left">{centre.Adresse}</h1>
                        </div>

                        {/* Téléphone */}
                        <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 items-center text-gray-700">
                            <img src={telephone} alt="telephone" className="w-6 h-6 sm:w-8 sm:h-8"/>
                            <a className="text-center sm:text-left" href={`tel:${centre.Telephone}`}>{centre.Telephone}</a>
                        </div>
                        {/* fix */}
                        <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 items-center text-gray-700">
                            <img src={telephone} alt="telephone" className="w-6 h-6 sm:w-8 sm:h-8"/>
                            <a className="text-center sm:text-left" href={`tel:${centre.Fix}`}>{centre.Fix}</a>
                        </div>
                        {/* handicapés */}
                        <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 items-center text-gray-700">
                            <img src={handicap} alt="internet" className="w-6 h-6 sm:w-8 sm:h-8"/>
                            <h1>{centre.Handicapes === 1 ? 'Accès sans obstacle' : 'Pas d\'accès pour handicapés'}</h1>
                        </div>

                        <div className="flex flex-col max-sm:flex-row sm:flex-row gap-3 items-center text-gray-700 mb-5">
                            <img src={image22} alt="internet" className="w-6 h-6 sm:w-8 sm:h-8"/>
                            <h1 className='text-blue-800'><a href={`mailto:${centre.Email}`}>{centre.Email}</a></h1>
                        </div>
                    </div>
                    </div>
                </div>
                )
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {centres.map((centre, index) => (
                <RenderSection key={centre.ID_Center} centre={centre} index={index} />
            ))}
        </div>
    );
}

export default ContactLoca;