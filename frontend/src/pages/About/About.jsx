import { use } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import SectionHeading from '../../components/common/SectionHeading/SectionHeading';
import DataBoundary from '../../components/common/DataBoundary/DataBoundary';
import Skeleton from '../../components/common/Skeleton/Skeleton';
import ReservationCTA from '../../components/common/ReservationCTA/ReservationCTA';
import StorySection from '../../components/about/StorySection/StorySection';
import ValuesSection from '../../components/about/ValuesSection/ValuesSection';
import TeamCard from '../../components/about/TeamCard/TeamCard';
import AmenityList from '../../components/study/AmenityList/AmenityList';
import { getInfo } from '../../services/infoService';
import { fadeUp } from '../../utils/motionVariants';
import { TEAM } from '../../utils/constants';
import styles from './About.module.css';

function Amenities() {
  const info = use(getInfo());
  return <AmenityList amenities={info.amenities} />;
}

function About() {
  return (
    <>
      <SEO
        title="About"
        description="The story, people, and values behind Alladin Cafe, a neighborhood cafe and study space."
      />
      <PageHeader
        eyebrow="Our story"
        title={
          <>
            A neighborhood cafe with a <em>studious</em> heart.
          </>
        }
        intro="We started Alladin Cafe for people who think better with a good cup in hand, and we still run it that way."
      />

      <StorySection />
      <ValuesSection />

      <section className="section container" aria-labelledby="team-title">
        <SectionHeading
          id="team-title"
          eyebrow="The team"
          title={
            <>
              The people <em>behind</em> the counter.
            </>
          }
        />
        <ul className={styles.team}>
          {TEAM.map((member, index) => (
            <motion.li
              key={member.name}
              variants={fadeUp}
              custom={index * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <TeamCard member={member} />
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="section surface" aria-labelledby="features-title">
        <div className={`container ${styles.features}`}>
          <SectionHeading
            id="features-title"
            eyebrow="Study friendly"
            title={
              <>
                Everything you need to <em>focus</em>.
              </>
            }
            description="Every seat comes with the basics that make a long session easy."
          />
          <DataBoundary
            fallback={<Skeleton height={200} radius="var(--radius-md)" />}
            errorTitle="Features did not load."
          >
            <Amenities />
          </DataBoundary>
        </div>
      </section>

      <ReservationCTA />
    </>
  );
}

export default About;
