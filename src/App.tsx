import { useMemo, useState } from 'react'

type Session = {
  time: string
  end: string
  title: string
  speaker: string
  role: string
  kind: 'keynote' | 'talk' | 'panel' | 'break' | 'workshop'
  description: string
  accent: string
}

const sessions: Session[] = [
  { time: '09:00', end: '09:30', title: 'Opening keynote: The intelligence era', speaker: 'Maya Chen', role: 'Founder, Signal House', kind: 'keynote', description: 'A sharp look at what changes when AI moves from a tool to a teammate.', accent: 'orange' },
  { time: '09:35', end: '10:05', title: 'From pilot to product', speaker: 'Amir Khan', role: 'VP of Product, Layer', kind: 'talk', description: 'The operating habits that turn promising experiments into durable products.', accent: 'blue' },
  { time: '10:10', end: '10:40', title: 'Building trust into AI systems', speaker: 'Elena Rossi', role: 'AI Policy Lead, Verity', kind: 'talk', description: 'Practical design choices for responsible, human-centred experiences.', accent: 'lime' },
  { time: '10:40', end: '11:05', title: 'Coffee & connection', speaker: '', role: '', kind: 'break', description: 'Take a breath, meet someone new, or browse the resource room.', accent: 'cream' },
  { time: '11:05', end: '11:50', title: 'The builders’ roundtable', speaker: 'Maya, Amir & Elena', role: 'Live panel', kind: 'panel', description: 'An honest conversation about the difficult decisions behind the scenes.', accent: 'purple' },
  { time: '12:00', end: '12:45', title: 'Hands-on: Your next 30 days with AI', speaker: 'Jordan Bell', role: 'Design Director, Northstar', kind: 'workshop', description: 'Leave with a clear, actionable starting point for your team.', accent: 'pink' },
]

const Icon = ({ name }: { name: 'arrow' | 'play' | 'plus' | 'calendar' | 'chevron' }) => {
  if (name === 'play') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" fill="currentColor" /></svg>
  if (name === 'plus') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  if (name === 'calendar') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  if (name === 'chevron') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function App() {
  const [selected, setSelected] = useState(0)
  const [saved, setSaved] = useState<number[]>([])
  const [reminder, setReminder] = useState(false)
  const current = sessions[selected]
  const savedCount = saved.length
  const progress = useMemo(() => ((selected + 1) / sessions.length) * 100, [selected])

  const toggleSaved = (index: number) => setSaved(items => items.includes(index) ? items.filter(item => item !== index) : [...items, index])

  return <main>
    <nav className="nav wrap" aria-label="Main navigation">
      <a className="logo" href="#top" aria-label="NOVA home"><span>NO</span><i>VA</i><b>↗</b></a>
      <div className="nav-links"><a href="#agenda">Agenda</a><a href="#agenda">Speakers</a><a href="#about">About</a></div>
      <button className="nav-cta" onClick={() => document.getElementById('agenda')?.scrollIntoView({ behavior: 'smooth' })}>Get your pass <Icon name="arrow" /></button>
    </nav>

    <section className="hero wrap" id="top">
      <div className="hero-copy">
        <p className="kicker"><span className="live-dot" /> Live online event · October 24, 2024</p>
        <h1>Make room<br />for what’s <em>next.</em></h1>
        <p className="hero-text">One inspiring day for curious minds building the future with artificial intelligence.</p>
        <div className="hero-actions"><a className="button button-dark" href="#agenda">Explore the agenda <Icon name="arrow" /></a><button className="watch"><span><Icon name="play" /></span> Watch the trailer</button></div>
      </div>
      <div className="hero-art" aria-label="Abstract orange and blue 3D artwork">
        <div className="orb orb-blue" /><div className="orb orb-orange" /><div className="orb orb-pink" />
        <div className="scribble">★</div><div className="art-label">NOVA<br />2024</div>
      </div>
      <div className="hero-meta"><span>09:00–13:00 <small>GMT+1</small></span><span>4 talks · 1 workshop</span><span>Free to attend</span></div>
    </section>

    <section className="agenda-section" id="agenda">
      <div className="wrap">
        <div className="agenda-head"><div><p className="kicker">The schedule</p><h2>A day worth<br />showing up for.</h2></div><p>Big ideas, useful perspectives, and the people making AI feel a little more human.</p></div>
        <div className="agenda-layout">
          <div className="timeline" role="list" aria-label="Webinar sessions">
            {sessions.map((session, index) => <button key={session.time} className={`session ${selected === index ? 'is-active' : ''}`} onClick={() => setSelected(index)} aria-label={session.title}>
              <span className="time">{session.time}<small>{session.end}</small></span>
              <span className={`session-dot ${session.accent}`} />
              <span className="session-content"><small className="session-type">{session.kind === 'break' ? 'INTERMISSION' : session.kind.toUpperCase()}</small><b>{session.title}</b>{session.speaker && <span>{session.speaker} <i>·</i> {session.role}</span>}</span>
              <span className="session-arrow"><Icon name="chevron" /></span>
            </button>)}
          </div>
          <aside className={`session-card ${current.accent}`} aria-live="polite">
            <div className="card-top"><span>{current.time} — {current.end}</span><button className={saved.includes(selected) ? 'saved' : ''} onClick={() => toggleSaved(selected)} aria-label="Save this session"><Icon name="plus" /></button></div>
            <div className="mini-art"><span className="glow one" /><span className="glow two" /><strong>{current.kind === 'break' ? 'PAUSE' : 'NOVA'}</strong></div>
            <p className="card-type">{current.kind === 'break' ? 'INTERMISSION' : current.kind.toUpperCase()}</p><h3>{current.title}</h3><p className="card-description">{current.description}</p>
            {current.speaker && <div className="speaker"><div className="avatar">{current.speaker.split(' ').map(name => name[0]).join('')}</div><span><b>{current.speaker}</b><small>{current.role}</small></span></div>}
            <button className="save-button" onClick={() => toggleSaved(selected)}>{saved.includes(selected) ? 'Saved to your schedule' : 'Add to my schedule'} <Icon name="plus" /></button>
          </aside>
        </div>
      </div>
    </section>

    <section className="join wrap" id="about"><div><p className="kicker">Save your seat</p><h2>Come curious.<br /><em>Leave charged.</em></h2></div><div className="join-side"><p>We’ll send you your access link, a calendar invite, and a little something to get you thinking.</p><button className="button button-light" onClick={() => setReminder(!reminder)}><Icon name="calendar" /> {reminder ? 'Reminder added' : 'Add to calendar'}</button><small>{savedCount ? `${savedCount} session${savedCount > 1 ? 's' : ''} saved to your schedule` : 'No spam. Just good things.'}</small></div></section>
    <footer className="wrap"><a className="logo" href="#top"><span>NO</span><i>VA</i><b>↗</b></a><span>© 2024 Nova. Made for the curious.</span><div><a href="#top">Instagram</a><a href="#top">LinkedIn</a><a href="#top">YouTube</a></div></footer>
    <div className="progress" style={{ width: `${progress}%` }} />
  </main>
}
