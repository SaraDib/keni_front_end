import Prevention1 from "../util/Prevention1";
import Prevention2 from "../util/Prevention2";
import Prevention3 from "../util/Prevention3";
import OpacityComponent from "../util/OpacityComponent";



export default function Prévention(){
    return(
        <div className="w-full overflow-hidden ">
        <Prevention1/>
        <Prevention2/>
        <Prevention3/>
        <OpacityComponent top="white"/>
        
    </div>)
}