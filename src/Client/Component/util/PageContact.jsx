import Contact from "../Contact";
import Inputcontact from "./Inputcontact";
import Contactgenerale from "./Contactgenerale";
import ContactLoca from "./ContactLoca";
import OpacityComponent from "./OpacityComponent";


function PageContact(){ 
    
    return(
            <div className="w-full overflow-hidden ">      
            <Contact/>
            <Inputcontact/>
            <Contactgenerale/>
            <ContactLoca/>

            
        </div>
    )
}
export default PageContact;