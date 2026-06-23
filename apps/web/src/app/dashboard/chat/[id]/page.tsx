import React from 'react'

//slug comming from the url

const page = ({ params }: { params: { id: string } }) => {




  return (
    <div>page


    //render the chat page based on the id from the url

    {params.id}

    </div>
  )
}

export default page