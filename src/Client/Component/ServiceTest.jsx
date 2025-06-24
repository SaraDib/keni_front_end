import Page from "./util/services/Page";
import ComposantRight from "./util/services/ComposantRight";
import ComposantLeft from "./util/services/composantLeft"; // Assure-toi que le chemin est correct

import imagego from '../assets/images/sport.jpg';
import fb from "../assets/images/fb.png";
import insta from "../assets/images/insta.png";
import kante from "../assets/images/wave.svg";
import hdid from "../assets/images/lehdiid.jpg";
import kaka from "../assets/images/DSC01864-2880w.webp";
import xavi from "../assets/images/training.jpg";

export default function ServiceTest() {
  /* section 1 */
  const descrption = [
    {
      title: "FAQ",
      image: imagego,
      imagefb: fb,
      imageinsta: insta,
      imagevague: kante,
      subtitle: "Centre de santé et de sport Frintrop GmbH à Essen",
      socialLinks: {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com"
      }
    }
  ];

  /* section 2 */
  const descrpsuPage = [
    {
      title1: "Ergothérapie",
      subtitle1: "« Nous permettons à nos clients de gérer leur situation de santé actuelle grâce à des stratégies d'ergothérapie et en même temps de les accompagner dans l'utilisation des ressources qu'ils ont apprises ou réapprises dans leur vie quotidienne privée ou professionnelle et dans leur réintégration personnelle dans la vie sociale. »",
      title2: "Stratégies d'ergothérapie",
      subtitle2: "« Entraînement des capacités motrices et sensorielles »",
      image: hdid,
    }
  ];

  /* composantright */
  const composantright = [
    {
      title: "PNF",
      title1: "Facilitation neuromusculaire proprioceptive",
      subtitle: "Le but de la physiothérapie est de maintenir, d’améliorer ou de restaurer la mobilité et la fonctionnalité du patient après une blessure. Différentes mesures sont appliquées au cours de la thérapie.",
      image: kaka
    }
  ];

  // Renomme cette variable pour éviter le conflit
  const composantLeftData = [
    {
      title: "PNF",
      title1: "Facilitation neuromusculaire proprioceptive",
      subtitle: "Le but de la physiothérapie est de maintenir, d’améliorer ou de restaurer la mobilité et la fonctionnalité du patient après une blessure. Différentes mesures sont appliquées au cours de la thérapie.",
      image: xavi
    }
  ];

  return (
    <>
      <Page
        title={descrption[0].title}
        subtitle={descrption[0].subtitle}
        image={descrption[0].image}
        imagefb={descrption[0].imagefb}
        imageinsta={descrption[0].imageinsta}
        imagevaque={descrption[0].imagevague}

        /*section 2 dans page */
        title1={descrpsuPage[0].title1}
        subtitle1={descrpsuPage[0].subtitle1}
        title2={descrpsuPage[0].title2}
        subtitle2={descrpsuPage[0].subtitle2}
      />

      <ComposantRight
        title={composantright[0].title}
        title1={composantright[0].title1}
        subtitle={composantright[0].subtitle}
        image={composantright[0].image}
      />

      <ComposantLeft
        title={composantLeftData[0].title}
        title1={composantLeftData[0].title1}
        subtitle={composantLeftData[0].subtitle}
        image={composantLeftData[0].image}
      />
    </>
  );
}