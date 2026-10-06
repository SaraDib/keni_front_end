import React, { useEffect, useState } from 'react';
import contact from "../../assets/images/contact.jpg";
import amwaj1 from "../../assets/images/wave-white-bottom.svg";
import amwaj2 from "../../assets/images/wave.svg";
import telephone from "../../assets/images/icons8-téléphone-25 (1).png";
import telephone1 from "../../assets/images/icons8-téléphone-96 (1).png";
import calendrier from "../../assets/images/icons8-calendrier-32 (1).png";
import axios from "axios";
import API_BASE_URL from "../../../config";


import 'aos/dist/aos.css';
import AOS from 'aos';


function ContactFAQ() {
    const [phone, setPhone] = useState("0201 9776650");

    useEffect(() => {
        AOS.init({
            duration: 1000, // Durée de l'animation
            once: true,     // L'animation ne se répète qu'une seule fois
        });

        // Fetch phone number
        axios.get(`${API_BASE_URL}/entreprises/1`)
            .then(res => {
                const data = res.data.data || res.data;
                if (data.Telephone) {
                    setPhone(data.Telephone);
                }
            })
            .catch(err => console.error("Error fetching phone:", err));
    }, []);

    return (
        <div data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="100" data-aos-offset="0" className="-mt-40 relative h-screen">
            <div className="absolute top-60 left-0 w-full h-full bg-customGreen opacity-50 z-10"></div>

            <div className=" top-60 left-0 w-full h-full -z-50 absolute">
                <img src={contact} alt="contact" className="h-full w-full object-cover " />
            </div>

            <div>
                <div className=" absolute top-96 mt-28 left-16 z-40 flex flex-row gap-64 max-sm:flex-col max-sm:top-84 max-sm:left-2 max-sm:mt-0 max-sm:gap-6">
                    <div className=" z-40">
                        <img src={telephone1} alt="telephone1" className="w-60 ml-52 max-sm:w-24 max-sm:ml-0" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="  left-0 gap-8  flex flex-col justify-center">
                            <h1 className="text-white text-3xl font-dmsans font w-2/3 max-sm:text-xl max-sm:w-4/5">
                                Contactez-nous pour prendre rendez-vous et faire le premier pas vers une vie plus saine.</h1>
                            <div className="flex flex-row gap-20 max-sm:flex-col max-sm:gap-4">
                                <div className="flex flex-row">
                                    <button className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-2xl border-2 w-auto hover:bg-customGreen">
                                        <img src={calendrier} alt="calendrier" className="w-8 h-8" />
                                        Prenez rendez-vous maintenant
                                    </button>
                                </div>

                                <div className=" flex flex-row">
                                    <button className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-2xl border-2 w-auto hover:bg-customGreen transition-all hover:transition-all">
                                        <img src={telephone} alt="telephone" className="w-8 h-8" />
                                        {phone}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-60 left-0 w-full z-30">
                <img src={amwaj1} alt="amwaj" className="w-full" />
            </div>

            <div className="absolute -bottom-60 left-0 w-full z-20">
                <img src={amwaj2} alt="amwaj2" className="w-full" />
            </div>
        </div>

    );
}

export default ContactFAQ;
