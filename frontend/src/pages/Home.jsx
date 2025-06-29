import React from 'react'
import Hero from '../components/hero'
import ProductTabs from '../components/ProductTabs'
import Banner from '../components/Banner'
import NewsLetter from '../components/NewsLetter'
import Deals from '../components/Deals'

function Home() {
  return (
    <div>
      <Hero />
      <ProductTabs />
      <Deals />
      <Banner />
      <NewsLetter />
    </div>
  )
}

export default Home
