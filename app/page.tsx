import Hero from '@/app/components/Hero/Hero'
import SummitOverview from '@/app/components/SummitOverview/SummitOverview'
import ThematicAreas from '@/app/components/ThematicAreas/ThematicAreas'
import DelegatesFormat from '@/app/components/DelegatesFormat/DelegatesFormat'
import ObjectivesOutcomes from '@/app/components/ObjectivesOutcomes/ObjectivesOutcomes'
import CredibilityStack from '@/app/components/CredibilityStack/CredibilityStack'
import ObjectionHandling from '@/app/components/ObjectionHandling/ObjectionHandling'
import OfferClarity from '@/app/components/OfferClarity/OfferClarity'
import Pricing from '@/app/components/Pricing/Pricing'
import RegistrationForm from '@/app/components/RegistrationForm/RegistrationForm'

export default function Home() {
  return (
    <main>
      <Hero />
      <SummitOverview />
      <ThematicAreas />
      <DelegatesFormat />
      <ObjectivesOutcomes />
      <CredibilityStack />
      <ObjectionHandling />
      <OfferClarity />
      <Pricing />
      <RegistrationForm />
    </main>
  )
}
