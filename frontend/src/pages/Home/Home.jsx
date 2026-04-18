import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
const Home = ({ searchQuery, setSearchQuery }) => {

  const [category,setCategory] = useState("All")

  return (
    <>
      <Header/>
      <ExploreMenu setCategory={setCategory} category={category} setSearchQuery={setSearchQuery} />
      <FoodDisplay category={category} searchQuery={searchQuery} />
    </>
  )
}

export default Home
