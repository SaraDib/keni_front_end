import Formation1 from "../util/Formation1";
import Formation2 from "../util/Formation2";
import CalendrierTable from "../util/CalendrierTable";

import OpacityComponent from "../util/OpacityComponent";

export default function Formation(){
    return(
        <div className="w-full overflow-hidden ">
        <Formation1/>
        <Formation2/>
        <CalendrierTable/>
        <OpacityComponent top="white"/>
       
    </div>)
}