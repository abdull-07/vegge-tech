import React from "react";
import Banner from "../components/Banner";
import Products from "../components/Products";

const AllProducts = () => {
  return (
    <div>
      <Banner hideButton={true}/>
      <Products/>
    </div>
    
  );
};

export default AllProducts;
