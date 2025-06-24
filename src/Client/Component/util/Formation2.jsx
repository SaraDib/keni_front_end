import hdid from "../../assets/images/lehdiid.jpg";
import iniesta from "../../assets/images/DSC01864-2880w.webp";
import xavi from "../../assets/images/training.jpg";
import busquet from "../../assets/images/shutter.jpg";






function Formation2(){

    return(
        <div>
            {/* Section 1 */}
            <div className="flex max-sm:flex-col max-sm:gap-0">
                <div className="bg-white px-44 py-10 flex flex-col gap-10 max-sm:px-4 max-sm:py-6">
                    <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Entraînement</h1>
                    <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                    Notre circuit d’entraînement est une combinaison unique d’entraînement en force et en endurance. Vous entraînez tous les groupes
                     musculaires grands et importants en termes de posture et de stabilité articulaire.
                     C'est l'entraînement idéal pour des muscles du dos forts et sans douleur, un métabolisme actif, un cœur fort et une silhouette tonique.                    </h2>
                </div>
                <div>
                    <img src={hdid} alt="entrainement"/>
                </div>
            </div>

            {/* Section 2 */}
            <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col-reverse">
            <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-6 ">
                <img src={xavi} alt="tab" className="h-full w-full max-sm:h-auto" />
            </div>

                <div className="p-20 w-15/16 max-sm:p-6 pb-80 max-sm:w-full">
                <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">force et endurance</h1>
                <h1 className="text-2xl text-customGreen mt-6 font-dmsans max-sm:text-2xl">La stratégie duale</h1>

                <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
                Notre circuit d’entraînement est une combinaison unique d’entraînement en force et en endurance. Vous entraînez tous les groupes
                 musculaires grands et importants en termes de posture et de stabilité articulaire.
                 C'est l'entraînement idéal pour des muscles du dos forts et sans douleur, un métabolisme actif, un cœur fort et une silhouette tonique.                </h2>
            
        </div>
        
      </div>

      {/* Section 3 */}
      <div className="bg-white flex gap-10 justify-between max-sm:flex-col">

        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">En forme et en bonne santé</h1>
          <h1 className="text-2xl text-customGreen mt-6 font-dmsans max-sm:text-2xl">Atteignez votre plein potentiel</h1>

          <h2 className="text-gray-700 text-1.5xl tex text- font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Vous souhaitez simplement vous sentir en bonne santé, par exemple ? B. sans douleur, ou recherchez-vous la forme physique, c'est-à-dire la résilience, l'énergie et la mobilité ?
          </h2>
          <h2 className="text-gray-700 text-1.5xl text- font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Bien sûr, c’est toujours une question de savoir ce que chacun entend par « sain ». Nous entendons par « en forme » une personne qui
           est non seulement en bonne santé, mais qui, malgré 
           restrictions de santé,  possède une <b className="text-black">force, une agilité et une endurance supérieures à la moyenne pour son âge  .</b>
           </h2>
           <h2 className="text-gray-700 text-1.5xl text- font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Par exemple :
          </h2>

            <div className="mt-5">
            {[
                { idx: ".", p: "Quelqu'un qui ne rentre pas à la maison épuisé après le travail, mais qui peut <b> quand même être actif pendant son temps libre.</b>" },
                { idx: ".", p: "Quelqu'un qui est concentré et persévérant même sous une lourde charge de travail." },
                { idx: ".", p: "Quelqu'un qui  peut encore <b>être actif</b> dans son sport favori, d'autres passe-temps ou dans le jardin  même à <b>un âge avancé.</b>" },
                { idx: ".", p: "Quelqu'un qui peut encore jouer avec ses  <b>petits-enfants</b>  ou même ses arrière-petits-enfants." },
                { idx: ".", p: "Quelqu'un qui  <b>reste indépendant et mobile même à un âge avancé</b>  , qui peut monter les escaliers sans problème et qui peut également aider." },
                
            ].map((item, index) => (
                <div
                key={index}
                className="flex flex-row text-gray-700 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
                >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div dangerouslySetInnerHTML={{ __html: item.p }}></div>
                </div>
            ))}
            </div>

            <h2 className="text-gray-700 text-1.5xl text- font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Pour tous ceux qui souhaitent être non seulement en bonne santé mais également en forme, nous proposons des programmes <b className="text-black"> adaptés à leurs objectifs et à leur état de santé et de forme physique actuel  .</b>            </h2>

        </div>

        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-6 ">
          <img src={iniesta} alt="souf" className="h-full w-full max-sm:h-auto" />
        </div>

      </div>

      {/* Section 4 */}
      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col-reverse">

      <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-6">
          <img src={busquet} alt="anee" className="h-full w-full max-sm:h-auto" />
        </div>

        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Quels sont vos objectifs ?</h1>
          <h1 className="text-2xl text-customGreen mt-6 font-dmsans max-sm:text-2xl">Entraînement personnel</h1>

          <h2 className="text-1.5xl text-gray-200 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Après quelques séances d’entraînement supervisées, la plupart de nos clients sont capables de poursuivre leur entraînement de manière
           autonome avec le soutien et le contrôle nécessaires.
           Cependant, des situations peuvent survenir où il est nécessaire ou souhaitable d’avoir quelqu’un à vos côtés tout au long de la formation.
         </h2>
         <h2 className="text-1.5xl text-gray-200 font-sans mt-4 pr-6 max-sm:text-lg max-sm:pr-0">
         Certains peuvent également avoir besoin d’une motivation supplémentaire pour atteindre leurs objectifs.
          La formation individuelle peut être réalisée aussi bien dans la zone de formation que seul dans la salle de formation.
         </h2>
        </div>
        
      </div>    
        </div>
    )
}
export default Formation2;