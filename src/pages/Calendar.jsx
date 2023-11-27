import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../style.css';
import 'react-calendar/dist/Calendar.css';



export default function Sample() {
  const [value, onChange] = useState(new Date());

return (
    <div className="Sample">
      <div className="Sample__container">
        <main className="Sample__container__content">
          <Calendar
            onChange={onChange}
            showWeekNumbers
            value={value}
            tileClassName={({ date }) => {
              if (date.getDate() === value.getDate()) {
                return 'react-calendar__tile--active';
              } else if (date.toDateString() === new Date().toDateString()) {
                return 'react-calendar__tile--today';
              }
              return '';
            }}
          />
        </main>
      </div>
    </div>
  );
}