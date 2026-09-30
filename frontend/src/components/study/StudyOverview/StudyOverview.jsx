import { use } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import SeatingZones from '../SeatingZones/SeatingZones';
import AvailabilityPreview from '../AvailabilityPreview/AvailabilityPreview';
import AmenityList from '../AmenityList/AmenityList';
import PassCard from '../PassCard/PassCard';
import HouseRules from '../HouseRules/HouseRules';
import { getInfo } from '../../../services/infoService';
import { fadeUp } from '../../../utils/motionVariants';
import styles from './StudyOverview.module.css';

/** All study-space sections, driven by GET /info. */
function StudyOverview() {
  const { studySpace, amenities } = use(getInfo());

  return (
    <>
      <section className="section container" aria-labelledby="zones-title">
        <SectionHeading
          id="zones-title"
          eyebrow="Seating zones"
          title={
            <>
              Pick your <em>mood</em>.
            </>
          }
          description="Silent, solo, or social. Every seat has power, fast Wi-Fi, and room to spread out."
        />
        <SeatingZones zones={studySpace.zones} />
      </section>

      <section className="section surface" aria-labelledby="availability-title">
        <div className={`container ${styles.split}`}>
          <div className={styles.intro}>
            <SectionHeading
              id="availability-title"
              eyebrow="Right now"
              title={
                <>
                  Is there a <em>seat</em> for me?
                </>
              }
              description="A quick look at how busy each zone usually is at this time of day."
            />
            <AmenityList amenities={amenities} />
          </div>
          <AvailabilityPreview zones={studySpace.zones} />
        </div>
      </section>

      <section className="section container" aria-labelledby="passes-title">
        <SectionHeading
          id="passes-title"
          eyebrow="Study passes"
          title={
            <>
              Simple, <em>honest</em> pricing.
            </>
          }
          description="Pay by the hour, stay all day, or save with a weekly pass. Prices are for the demo."
        />
        <ul className={styles.passes}>
          {studySpace.passes.map((pass, index) => (
            <motion.li
              key={pass.name}
              variants={fadeUp}
              custom={index * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <PassCard pass={pass} featured={pass.name === 'Day Pass'} />
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="section container" aria-labelledby="rules-title">
        <div className={styles.split}>
          <SectionHeading
            id="rules-title"
            eyebrow="House rules"
            title={
              <>
                A few rules that keep it <em>calm</em>.
              </>
            }
          />
          <HouseRules rules={studySpace.rules} />
        </div>
      </section>
    </>
  );
}

export default StudyOverview;
