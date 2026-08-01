import React from 'react'
import { motion } from 'motion/react'

export default function ProjectDetailPage({ project, onClose, visible = true }) {
  if (!project) return null

  return (
    <motion.div
      className="detail-page"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        // While mounted behind the canvas (visible=false): painted but invisible.
        // Two rAFs after mount the canvas fades → visible flips to true → no flash.
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: visible ? 'opacity 0.18s ease-in' : 'none',
      }}
    >
      {/* Noise texture overlay */}
      <div className="detail-noise" />

      {/* Accent glow blob */}
      <div
        className="detail-glow-blob"
        style={{ background: `radial-gradient(ellipse at 30% 30%, ${project.accent}22 0%, transparent 65%)` }}
      />

      {/* Header Bar */}
      <div className="detail-nav">
        <button className="detail-back-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Projects
        </button>
        <div className="detail-nav-pill" style={{ borderColor: `${project.accent}55` }}>
          <span className="detail-nav-dot" style={{ background: project.accent }} />
          <span className="detail-nav-label">Case Study</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">

        {/* Left Column */}
        <div className="detail-left">

          <motion.div
            className="detail-index-label"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="detail-index-line" style={{ background: project.accent }} />
            Featured Project
          </motion.div>

          <motion.h1
            className="detail-title"
            style={{ color: project.accent }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className="detail-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.88 }}
          >
            {project.subtitle}
          </motion.p>

          <motion.div
            className="detail-role-badge"
            style={{ borderColor: `${project.accent}55`, color: project.accent }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.95 }}
          >
            {project.role}
          </motion.div>

          <motion.p
            className="detail-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.0 }}
          >
            {project.description}
          </motion.p>

          {/* Tech Stack */}
          <motion.div
            className="detail-stack-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.08 }}
          >
            <div className="detail-stack-label">Tech Stack</div>
            <div className="detail-stack-chips">
              {project.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="detail-chip"
                  style={{ borderColor: `${project.accent}44` }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 1.12 + i * 0.06 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="detail-cta-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.28 }}
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-cta-live"
                style={{ '--live-accent': project.accent }}
              >
                <span className="detail-cta-live-pulse" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 8 16 12 12 16" /><line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Visit Live Site
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-cta-primary"
              style={{ background: project.accent, color: '#000' }}
            >
              View on GitHub
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <button
              className="detail-cta-secondary"
              onClick={onClose}
            >
              ← All Projects
            </button>
          </motion.div>
        </div>

        {/* Right Column — Screenshot */}
        <motion.div
          className="detail-right"
          initial={{ opacity: 0, scale: 0.9, rotateY: 8 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1200 }}
        >
          <div className="detail-mockup-frame" style={{ borderColor: `${project.accent}33` }}>
            <div className="detail-mockup-bar">
              <span className="mockup-dot red" />
              <span className="mockup-dot yellow" />
              <span className="mockup-dot green" />
            </div>
            <div className="detail-mockup-screen">
              <img
                src={project.image}
                alt={project.title}
                className="detail-mockup-img"
              />
            </div>
          </div>

          {/* Floating accent badge */}
          <div className="detail-float-badge" style={{ background: `${project.accent}18`, borderColor: `${project.accent}44` }}>
            <span style={{ color: project.accent }}>★</span>
            <span>{project.subtitle.split('•')[0].trim()}</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
