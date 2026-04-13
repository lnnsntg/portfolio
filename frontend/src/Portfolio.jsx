import { useState, useRef, useEffect } from 'react'
import './App.css'

const PROJECTS = [
  {
    id: 1,
    title: "AI Chatbot",
    description: "Interactive chat with local AI using Ollama. FastAPI + React + LLM integration demo.",
    tech: ["FastAPI", "React", "Ollama", "Python"],
    github: "https://github.com/lnnsntg",
    demo: "https://chat-bot-ports.duckdns.org",
    status: "live"
  },
  {
    id: 2,
    title: "E-commerce API",
    description: "RESTful API for online store with Django REST Framework and PostgreSQL.",
    tech: ["Django", "PostgreSQL", "JWT"],
    github: "https://github.com/lnnsntg",
    demo: null,
    status: "coming soon"
  }
]

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/lnnsntg", icon: "🐙" },
  { name: "LinkedIn", url: "https://linkedin.com/in/lenin-s-15234b217", icon: "💼" },
  { name: "Upwork", url: "https://www.upwork.com/freelancers/~015fccc96f66fddf4f", icon: "💻" },
  { name: "Email", url: "mailto:lnnsntg@gmail.com", icon: "📧" }
]

function Portfolio() {
  const [botOpen, setBotOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am Lenin. Ask me about my services or projects. 🚀' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input
    setInput('')
    setMessages(m => [...m, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await response.json()
      setMessages(m => [...m, { role: 'assistant', content: data.response }])
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I could not process your message.' }])
    }
    setLoading(false)
  }

  return (
    <div className="portfolio-container">
      {/* Chatbot Widget - Bottom Right */}
      <div className={`chatbot-widget ${botOpen ? 'open' : ''}`}>
        {!botOpen ? (
          <button className="chatbot-toggle" onClick={() => setBotOpen(true)}>
            💬 Chat with me
          </button>
        ) : (
          <div className="chatbot-panel">
            <div className="chatbot-header">
              <span>💬 Lenin</span>
              <button onClick={() => setBotOpen(false)}>✕</button>
            </div>
            <div className="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chatbot-msg ${m.role}`}>
                  {m.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} disabled={loading}>➤</button>
            </div>
          </div>
        )}
      </div>

      <header className="portfolio-header">
        <h1>👨‍💻 Hi! I am Lenin.</h1>
        <p>Full-Stack Developer | React, Next.js, Python, Django, AI & Automation</p>
        
        <div className="social-links">
          {SOCIALS.map(social => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
              <span>{social.icon}</span> {social.name}
            </a>
          ))}
        </div>
      </header>

      <main className="portfolio-content">
        {/* Projects */}
        <section className="projects-grid">
          <div className="section-title">Projects</div>
          <div className="project-cards-wrapper">
            {PROJECTS.map(project => (
            <article key={project.id} className={`project-card ${project.status}`}>
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className={`status ${project.status}`}>
                  {project.status === 'live' ? '🟢 Live' : '⏳ Coming Soon'}
                </span>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {project.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>
              <div className="project-links">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    🐙 GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank">
                    🚀 View Demo
                  </a>
                )}
              </div>
            </article>
          ))}
          </div>
        </section>

        {/* About */}
        <section className="about-section">
          <div className="section-title">About Me</div>
          <p>Full-Stack Developer with 5+ years of experience building modern web applications.</p>
          <h3>Tech Stack</h3>
          <div className="stack-list">
            <span className="tech-tag">JavaScript</span>
            <span className="tech-tag">TypeScript</span>
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">Express</span>
            <span className="tech-tag">Next.js</span>
            <span className="tech-tag">React</span>
            <span className="tech-tag">Python</span>
            <span className="tech-tag">Django</span>
            <span className="tech-tag">FastAPI</span>
            <span className="tech-tag">PostgreSQL</span>
            <span className="tech-tag">AWS</span>
          </div>
        </section>

        {/* Contact */}
        <section className="contact-section">
          <div className="section-title">Contact</div>
          <p>Have a project in mind? Let's talk.</p>
          <a href="https://www.upwork.com/freelancers/~015fccc96f66fddf4f" target="_blank" className="cta-button">
            💬 Contact me on Upwork
          </a>
          <a href="mailto:lnnsntg@gmail.com" className="cta-button secondary">
            📧 Email
          </a>
        </section>
      </main>

      <footer className="portfolio-footer">
        <p>© 2026 - Lenin S. | Full-Stack Developer</p>
      </footer>
    </div>
  )
}

export default Portfolio