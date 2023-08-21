import React from "react";
import Header from "../Components/partials/Header";
import Footer from "../Components/partials/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <div style={{ height: "1000px" , marginTop:"90px"}}>
        <h2>Đây là trang Home</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta nisi,
          repellendus ipsa hic autem delectus quis. Atque laudantium fugit sed
          unde! Ex vel alias vero assumenda qui eum laudantium at!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta nisi,
          repellendus ipsa hic autem delectus quis. Atque laudantium fugit sed
          unde! Ex vel alias vero assumenda qui eum laudantium at!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta nisi,
          repellendus ipsa hic autem delectus quis. Atque laudantium fugit sed
          unde! Ex vel alias vero assumenda qui eum laudantium at!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta nisi,
          repellendus ipsa hic autem delectus quis. Atque laudantium fugit sed
          unde! Ex vel alias vero assumenda qui eum laudantium at!
        </p>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
