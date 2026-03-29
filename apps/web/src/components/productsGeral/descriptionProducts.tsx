

type Description = {
    text: string,
    titulo: string
}

export default  function DescriptionProducts({text, titulo}: Description){
    

    
    return(
        <>
            <div className="">

                <span>{text}</span>
                <span>{titulo}</span>
            </div>
        </>
    )
}