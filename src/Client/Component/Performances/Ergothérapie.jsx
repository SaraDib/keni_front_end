import Ergothrapie1 from "../util/Ergotherapie1"
import Ergotherapie2 from "../util/Ergotherapie2"

import OpacityComponent from "../util/OpacityComponent";

export default function Ergothrapie(){
    return(
        <div className="w-full overflow-hidden ">
        <Ergothrapie1/>
        <Ergotherapie2/>
        <OpacityComponent top="none"/>
       
    </div>
    )
}