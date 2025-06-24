import Service from "../util/service";
import OpacityComponent from "../util/OpacityComponent";



export default function AutresServices(){
    return(
        <div className="w-full overflow-hidden ">
        <Service/>
        <OpacityComponent top="none"/>
        
    </div>
    )
}