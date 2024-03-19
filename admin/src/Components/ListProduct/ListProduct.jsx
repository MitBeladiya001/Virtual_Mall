import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'


const ListProduct = () => {

  const [allProducts, setAllProducts] = useState([]);

  // use function to fetch data through API and put to function

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => { setAllProducts(data) });
  }

  // run above function so e use useEffect function

  // [] is for we use only one time function exicute

  useEffect(() => {
    fetchInfo();
  }, []);

  // use function for remove function
  const remove_product = async (id) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    })
    // we update our all products because we delete some products
    await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old_Price</p>
        <p>New_Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproducts-allproducts">
        <hr />
        {/* map product data that we fetch data through API */}
        {allProducts.map((product, index) => {
          return <>
            <div key={index} className='listproduct-format-main listproduct-format'>
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => { remove_product(product.id) }} className='listproduct-remove-icon' src={cross_icon} alt="" />
            </div>
            <hr />
          </>
        })}
      </div>
    </div>
  )
}

export default ListProduct