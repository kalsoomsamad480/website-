import { useState } from 'react';
import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import Loader from '../../components/common/Loader/Loader';
import ReservationForm from '../../components/reservation/ReservationForm/ReservationForm';
import ReservationSuccess from '../../components/reservation/ReservationSuccess/ReservationSuccess';
import useAuth from '../../hooks/useAuth';

function Reservation() {
  const { isReady } = useAuth();
  const [booked, setBooked] = useState(null);

  const handleBooked = (reservation) => {
    setBooked(reservation);
    window.scrollTo({ top: 0 });
  };

  if (booked) {
    return (
      <>
        <SEO
          title="Booking received"
          description="Your Alladin Cafe reservation request was received."
        />
        <ReservationSuccess reservation={booked} onBookAnother={() => setBooked(null)} />
      </>
    );
  }

  return (
    <>
      <SEO title="Reserve" description="Reserve a table or a study desk at Alladin Cafe." />
      <PageHeader
        eyebrow="Reservations"
        title={
          <>
            Save your <em>seat</em>.
          </>
        }
        intro="Book a table for friends or a study desk for a focused session. It is free, and it takes less than a minute."
      />
      <div className="container">
        {/* Wait for the session so signed-in guests get their details filled in */}
        {isReady ? <ReservationForm onBooked={handleBooked} /> : <Loader />}
      </div>
    </>
  );
}

export default Reservation;
