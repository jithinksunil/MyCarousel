import { Carousel } from './component/Carousel'

function App() {
  const array=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  return (
    <Carousel noOfCards={array.length} cardGap={10} >
      {
        array.map((item,index)=>
        <div key={index} style={{height:'100px',width:'80px',backgroundColor:'red'}}></div>
        )
      }
    </Carousel>
  )
}

export default App
