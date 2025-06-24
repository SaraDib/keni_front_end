import Faq from "./Faq";
import Mapfaq from "./util/Faqmap";
import OpacityComponent from "./util/OpacityComponent"
// import ContactFAQ from "./util/ContactFAQ";
// import Footer from "./util/Footer";

function PageFAQ(){ 
    
    return(
        <div>
            <Faq/>
            <Mapfaq/>
            <OpacityComponent top="white" />
            {/* <ContactFAQ/> */}
        
        </div>
    )
}
export default PageFAQ;