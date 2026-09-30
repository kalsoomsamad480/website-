import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import ScrollReveal from '../../components/common/ScrollReveal/ScrollReveal';
import ContactInfo from '../../components/contact/ContactInfo/ContactInfo';
import ContactForm from '../../components/contact/ContactForm/ContactForm';
import styles from './Contact.module.css';

function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Find Alladin Cafe: address, phone, email, opening hours, and a message form."
      />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Come say <em>hello</em>.
          </>
        }
        intro="Questions, feedback, or a group booking. We usually reply within a day."
      />
      <section className={`container ${styles.layout}`} aria-label="Contact details and form">
        <ScrollReveal>
          <ContactInfo />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ContactForm />
        </ScrollReveal>
      </section>
    </>
  );
}

export default Contact;
