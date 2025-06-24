import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import main from '../../assets/images/yooga.jpg';


export default function Preventon3(){
    useEffect(() => {
        AOS.init({
          duration: 2000, // Durée de l'animation
          once: true, // L'animation ne se répète qu'une seule fois
        });
      }, []);

      const schedule = [
        ["19h00- 20h00 Prévention", "18h30 - 20h00 Détente", "", "18:00 – 19:00 Prévention <br/> 19:00 - 20:00 Prévention", ""],
      ];

    return(
        <div>
            {/* section 1 */}
            <div className='flex max-sm:flex-col'>
                <div className="bg-white px-44 py-10 flex flex-col gap-4 max-sm:px-4 max-sm:py-6 w-4/5 max-sm:w-full">
                <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-3xl">prévention</h1>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                La relaxation est la <b>base de toute guérison .</b>    
                Lors de la relaxation, les pouvoirs d’auto-guérison
                inhérents à tout organisme vivant sont activés.
                </h2>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                La relaxation et la tension des muscles constituent la base de la relaxation musculaire progressive. La méthode a été développée par Edmund Jacobson, un médecin américain. Il a découvert que les maladies mentales peuvent être liées à la tension musculaire. Selon sa découverte, la relaxation ciblée des muscles réduisait l’activité des nerfs, tandis que dans le même temps, la tension psychologique diminuait également.
                </h2>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                Lors des exercices de relaxation musculaire progressive, le patient se concentre sur des groupes musculaires individuels. Il les serre d'abord fortement puis les desserre à nouveau. La tension et la relaxation se produisent selon un rythme aussi régulier que possible.
                </h2>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                Après instruction préalable d'un thérapeute dûment formé, le patient peut également effectuer les exercices de manière autonome.
                </h2>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                Des vêtements amples et un endroit confortable pour s'asseoir ou s'allonger sont utiles pour pouvoir surveiller de près l'activité musculaire pendant les exercices.
                </h2>
                </div>

                <div className='bg-white py-20 flex flex-col gap-4 max-sm:px-4 max-sm:py-6 w-5/5' >
                <h2 className="text-3xl text-customGreen font-dmsans max-sm:text-lg flex gap-5">
                À long terme, la relaxation musculaire progressive peut aider
                </h2>
                <div className="mt-5">
          {[
            { idx: ">", p: "améliorer la conscience corporelle," },
            { idx: ">", p: "pour réduire l’agitation mentale et physique" },
            { idx: ">", p: "réduire la douleur" },
            { idx: ">", p: "réduire le stress" },
            { idx: ">", p: "réduire la tension musculaire" },
            { idx: ">", p: "ralentir le rythme cardiaque" },
            { idx: ">", p: "pour favoriser une respiration calme et détendue" },
            { idx: ">", p: "pour renforcer l'équilibre mental et physique" },
            { idx: ">", p: "développer la paix intérieure et la sérénité" },
            { idx: ">", p: "dilater les vaisseaux sanguins dans les muscles." },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-row text-gray-700 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
            >
              <div className="pr-4 text-customGreen">{item.idx} </div>
                <div>{item.p}</div>
             </div>
            ))}
            </div>
            <h1 className='text-black font-dmsans text-1.5xl' ><b>Nouveau cours à partir du mardi 25.03.2025</b></h1>
            </div>
            </div>

            {/* section 2 */}
            <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={main} alt='chelsea' className="h-full object-cover max-sm:h-auto" />
        </div>

        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Dates des cours </h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Prévention Nous serons heureux de vous informer du début du prochain cours de prévention à : 
            </h2>
            <h2 className='text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0 flex gap-3'>Tél:<p className='text-customGreen'>0201 21969434</p> </h2>
            
            <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Vous êtes également invités à assister à l'un de nos divers cours :
            </h2>
        </div>
       
            </div>

            {/* section 3 */}
            <div className="pt-16 p-4 w-12/12 overflow-hidden flex justify-center bg-white ">
          <div className="max-w-full overflow-auto border border-gray-300 rounded-lg" style={{ maxHeight: '400px' }}>
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 border border-gray-300">Lundi</th>
                <th className="p-3 border border-gray-300">Mardi</th>
                <th className="p-3 border border-gray-300">Mercredi</th>
                <th className="p-3 border border-gray-300">Jeudi</th>
                <th className="p-3 border border-gray-300">Vendredi</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`p-2 md:p-10 border border-gray-300 ${cell ? "text-gray-700" : "bg-gray-100"}`}
                      >
                       <span dangerouslySetInnerHTML={{ __html: cell }}></span>   
                    </td>
                    
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
    )
}