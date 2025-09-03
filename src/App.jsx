import Heading from "./components/Heading";
import Navbar from "./components/Navbar";
import Bird from "./components/Bird";
import Scroll from "./components/Scroll";
import { Canvas } from "@react-three/fiber";  


function App() {
  return (
    <>
      <section>
      <div style={{ height: "150vh"}}>
      <Heading />
      <Navbar /> 
      <Canvas>
        {/* Add some basic lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Bird />
      </Canvas>
      <Scroll />
      </div>
      </section>
      <section>
        
      </section>
    </>
  );
};

export default App;






