import React from "react";
import './DiagramContainer.css'

interface ContainerProps {
    category: string;
}


const DiagramContainer: React.FC<ContainerProps> = (props: ContainerProps) =>{



        return <div className="DiagramContainer"><h1>{props.category}</h1>
            <div className="ScrollBarDiagram">

 </div>
        </div>
}

export default DiagramContainer;