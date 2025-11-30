import React from 'react'
import HeroV1 from '../components/HeroV1'
import SocialProof from '../components/SocialProof'
import FeatureSection from '../components/FeatureSection'
import PersonalizationSection from '../components/PersonalizationSection'
import UseCases from '../components/UseCases'
import ProductPreview from '../components/ProductPreview'
import StockSection from '../components/StockSection'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import FinalCTA from '../components/FinalCTA'

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroV1 />

      {/* Social Proof - Stats & Credibility */}
      <SocialProof />

 

      {/* Features Section - 4 Key Features */}
      <section id="features">
        <FeatureSection />
      </section>

      {/* How It Works - 3-Step Process */}
      <PersonalizationSection />

      {/* Use Cases - Who It's For */}
      <section id="use-cases">
        <UseCases />
      </section>

      {/* Product Preview - Dashboard Demo */}
      <ProductPreview />

      {/* Markets & Crypto Section */}
      <StockSection />

      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA />
    </>
  )
}

export default HomePage
