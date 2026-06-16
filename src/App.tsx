import { useState, useRef } from 'react';
import './index.css';

const FloatingHearts = () => {
  const hearts = Array.from({ length: 20 }).map((_, i) => {
    const left = Math.random() * 100;
    const animationDelay = Math.random() * 15;
    const animationDuration = Math.random() * 10 + 10;
    const size = Math.random() * 1.5 + 1;
    return (
      <div 
        key={i} 
        className="floating-heart" 
        style={{ 
          left: `${left}vw`, 
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`,
          fontSize: `${size}rem`
        }}
      >
        ❤️
      </div>
    );
  });

  return <div className="hearts-container">{hearts}</div>;
};

const WEB3FORMS_KEY = "aeaabb19-4ae8-4110-90b6-fedcdbc4c534"; 

function App() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // If they click without selecting, we can just proceed, but it's best to record whatever is there
    setIsSubmitting(true);
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New Date Response! ❤️",
          Message: "They said YES! 🎉",
          "Contact Name": name,
          "Contact Number": mobile,
          "Chosen Date": date,
          "Chosen Time": time.split(' —')[0],
          SubmissionTime: new Date().toLocaleString()
        })
      });
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
    setStep(3);
  };
  const [noStyle, setNoStyle] = useState<{ position?: 'static' | 'fixed', left?: string, top?: string }>({ 
    position: 'static'
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHover = () => {
    const btnWidth = 120; // approximate width
    const btnHeight = 60; // approximate height

    // Use fixed positioning so coordinates are strictly relative to the viewport
    const x = Math.max(20, Math.random() * (window.innerWidth - btnWidth - 40));
    const y = Math.max(20, Math.random() * (window.innerHeight - btnHeight - 40));

    setNoStyle({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
    });
  };

  return (
    <>
      <FloatingHearts />
      <div className="app-container" ref={containerRef}>
        {step === 0 && (
        <>
          <img src="/cat_sticker.png" alt="Cute cat sticker" style={{ width: '200px', marginBottom: '1rem', animation: 'float 6s ease-in-out infinite', mixBlendMode: 'multiply' }} />
          <div className="title">Will you go on a date with me?</div>
          <div className="buttons-container" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-yes"
              onClick={() => setStep(1)}
            >
              Yes 🙈
            </button>
            <button
              className="btn btn-no"
              style={{ 
                position: noStyle.position,
                ...(noStyle.left && { left: noStyle.left }),
                ...(noStyle.top && { top: noStyle.top }),
                transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)' 
              }}
              onMouseEnter={handleHover}
              onClick={handleHover}
            >
              No 😡
            </button>
          </div>
        </>
      )}

      {step === 1 && (
        <div className="success-message">
          <img src="/sticker.png" alt="Cute sticker" style={{ width: '250px', marginBottom: '1rem', animation: 'float 6s ease-in-out infinite' }} />
          <div className="success-text">wait you actully said yes ? 😭</div>
          <button className="btn-next" onClick={() => setStep(2)}>
            okay... ---&gt;
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="date-picker-container">
          <div className="title" style={{ marginBottom: '2rem' }}>So.... when are you free ?</div>
          
          <div className="input-group">
            <label>Your Name:</label>
            <input type="text" className="text-input" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Mobile Number:</label>
            <input type="tel" className="text-input" placeholder="Enter your number" value={mobile} onChange={e => setMobile(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Pick a date:</label>
            <input type="date" className="date-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          
          <div className="input-group">
            <label>What time:</label>
            <select className="time-input" value={time} onChange={e => setTime(e.target.value)}>
              <option value="" disabled>Select a time...</option>
              <option value="5:00 PM">5:00 PM — we eating with the retirees</option>
              <option value="6:00 PM">6:00 PM — this is the right answer tbh</option>
              <option value="7:00 PM">7:00 PM — you're making me hungry already</option>
              <option value="8:00 PM">8:00 PM — we eating dinner or breakfast?</option>
            </select>
          </div>

          <button 
            className="btn btn-yes" 
            style={{ marginTop: '2rem', opacity: (!date || !time || !name || !mobile) ? 0.5 : 1 }}
            onClick={handleSubmit}
            disabled={isSubmitting || !date || !time || !name || !mobile}
          >
            {isSubmitting ? 'Sending...' : 'Set a date'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="success-message">
          <div className="heart">❤️</div>
          <div className="success-text" style={{ marginTop: '2rem', fontSize: '2rem', maxWidth: '600px', lineHeight: '1.4' }}>
            glad you didnt say no. be ready by {date ? date : "the date"} at {time ? time.split(' —')[0] : "the time"} im comming to get you 🚗
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
