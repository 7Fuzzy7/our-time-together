import React, { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Trophy, Weight, CalendarCheck, Camera, Music, Pause, Upload, ImagePlus } from 'lucide-react'
import confetti from 'canvas-confetti'

// 🎉 Função de confete
const soltarConfete = () => confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })

// 🎯 Personalize aqui
const NOME_DELA = 'Isa'
const DATA_QUE_SE_CONHECERAM = '2024-10-12' // AAAA-MM-DD
const DATA_PRIMEIRO_BEIJO = '2025-10-19' // AAAA-MM-DD
const FRASE_FINAL = 'Te amo, Isa. Obrigado por cada dia ao seu lado.'
const MUSICA_URL = '' // ex.: 'https://meu-servidor/nossa-musica.mp3'

// 🔒 Chaves de storage
const STORAGE_KEYS = {
  eventos: 'ntj:eventos',
  galeria: 'ntj:galeria'
}

// Utilitários
function diffEmDias(dateStr) {
  const agora = new Date()
  const inicio = new Date(dateStr + 'T00:00:00')
  const umDiaMs = 24 * 60 * 60 * 1000
  const diff = Math.floor((agora.setHours(0, 0, 0, 0) - inicio.getTime()) / umDiaMs)
  return diff < 0 ? 0 : diff
}

function formatarDataBR(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// 📅 Eventos iniciais
const eventosBase = [
  { data: DATA_QUE_SE_CONHECERAM, titulo: 'Nos conhecemos', descricao: '12 de outubro de 2024 ❤️', icon: CalendarCheck },
  { data: DATA_PRIMEIRO_BEIJO, titulo: 'Primeiro beijo', descricao: '19 de outubro de 2025 — impossível esquecer.', icon: Heart },
  { data: '2025-11-02', titulo: 'Treino e parceria', descricao: 'Academia juntos: um cuida do outro. 💪', icon: Weight }
]

// 🧠 App principal
export default function App() {
  const [eventos, setEventos] = useState(eventosBase)
  const [galeria, setGaleria] = useState([
    'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975922284-9bab0653c2a9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop',
  ])
  const [tocando, setTocando] = useState(false)
  const audioRef = useRef(null)

  // ✅ Carregar dados do localStorage
  React.useEffect(() => {
    try {
      const e = JSON.parse(localStorage.getItem(STORAGE_KEYS.eventos) || 'null')
      if (Array.isArray(e) && e.length) setEventos(e)
      const g = JSON.parse(localStorage.getItem(STORAGE_KEYS.galeria) || 'null')
      if (Array.isArray(g)) setGaleria(g)
    } catch {}
  }, [])

  // 💾 Salvar alterações
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.eventos, JSON.stringify(eventos)) } catch {}
  }, [eventos])
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.galeria, JSON.stringify(galeria)) } catch {}
  }, [galeria])

  const diasDesdeQueSeConheceram = useMemo(() => diffEmDias(DATA_QUE_SE_CONHECERAM), [])
  const diasDesdePrimeiroBeijo = useMemo(() => diffEmDias(DATA_PRIMEIRO_BEIJO), [])

  // ➕ Adicionar novo evento
  const adicionarEvento = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = form.data.value
    const titulo = form.titulo.value
    const descricao = form.descricao.value
    if (!data || !titulo) return
    setEventos((prev) => [...prev, { data, titulo, descricao, icon: Camera }].sort((a, b) => new Date(a.data) - new Date(b.data)))
    form.reset()
  }

  // 📸 Upload de imagens
  const onUploadImagens = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => setGaleria((g) => [reader.result, ...g])
      reader.readAsDataURL(file)
    })
  }

  // 🔊 Música
  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (tocando) { a.pause(); setTocando(false) } else { a.play(); setTocando(true) }
  }

  // 📤 Compartilhar
  const compartilhar = async () => {
    const url = window.location.href
    const text = `Nossa timeline, ${NOME_DELA}! 💖`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Nosso Tempo Juntos', text, url })
      } else {
        await navigator.clipboard.writeText(url)
        alert('Link copiado! Cole para compartilhar com a Isa ✨')
      }
    } catch {}
  }

  // 🔗 QR Code dinâmico
  const qrUrl = typeof window !== 'undefined'
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(window.location.href)}`
    : ''

  return (
    <div style={{ minHeight: '100vh', color: '#1f2937' }}>
      {/* HERO */}
      <section style={{ position: 'relative', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)', textAlign: 'center' }}
          >
            Nosso Tempo Juntos, <span style={{ color: '#e11d48' }}>{NOME_DELA}</span>
          </motion.h1>
          <p style={{ marginTop: 12, textAlign: 'center', color: '#6b7280' }}>
            Desde {formatarDataBR(DATA_QUE_SE_CONHECERAM)} até hoje — celebrando cada treino, cada riso e cada ponto no vôlei.
          </p>

          {/* Música */}
          {MUSICA_URL ? (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <button onClick={togglePlay} style={btn()}>
                {tocando ? '⏸ Pausar música' : '🎵 Tocar música'}
              </button>
              <audio ref={audioRef} src={MUSICA_URL} preload="none" />
            </div>
          ) : null}

          {/* Botões */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={soltarConfete} style={btn()}>🎉 Celebrar</button>
            <button onClick={compartilhar} style={btn()}>📤 Compartilhar</button>
          </div>

          {/* Contadores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 28 }}>
            <ContadorCard
              icon={<CalendarCheck size={20} color="#e11d48" />}
              titulo={`Desde que nos conhecemos (${formatarDataBR(DATA_QUE_SE_CONHECERAM)})`}
              valor={`${diasDesdeQueSeConheceram} dias`}
              destaque
            />
            <ContadorCard
              icon={<Heart size={20} color="#e11d48" />}
              titulo={`Desde o primeiro beijo (${formatarDataBR(DATA_PRIMEIRO_BEIJO)})`}
              valor={`${diasDesdePrimeiroBeijo} dias`}
            />
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy color="#e11d48" /> Nossa Timeline
        </h2>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Marcos que a gente não esquece. Adicione mais quando quiser! ✨</p>

        <ul style={{ marginTop: 16, position: 'relative', listStyle: 'none', paddingLeft: 0 }}>
          {eventos.sort((a, b) => new Date(a.data) - new Date(b.data)).map((ev, i) => (
            <li key={i} style={{ paddingLeft: 28, marginBottom: 16, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 8, width: 16, height: 16, borderRadius: 9999, background: '#fff', border: '1px solid #fda4af', display: 'grid', placeItems: 'center' }}>
                {ev.icon ? <ev.icon size={12} color="#e11d48" /> : <CalendarCheck size={12} color="#e11d48" />}
              </div>
              <div style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 16, padding: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{formatarDataBR(ev.data)}</div>
                <div style={{ fontWeight: 600 }}>{ev.titulo}</div>
                {ev.descricao ? <div style={{ color: '#6b7280', marginTop: 4 }}>{ev.descricao}</div> : null}
              </div>
            </li>
          ))}
        </ul>

        {/* Form */}
        <form onSubmit={adicionarEvento} style={{ marginTop: 16, display: 'grid', gap: 12, border: '1px solid #e5e7eb', background: '#fff', padding: 16, borderRadius: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <label style={label()}>Data</label>
              <input name="data" type="date" style={input()} />
            </div>
            <div>
              <label style={label()}>Título</label>
              <input name="titulo" placeholder="Viagem, campeonato..." style={input()} />
            </div>
            <div>
              <label style={label()}>Descrição (opcional)</label>
              <input name="descricao" placeholder="Detalhes do momento" style={input()} />
            </div>
          </div>
          <button type="submit" style={primary()}>
            <Camera size={18} style={{ marginRight: 8 }} /> Adicionar evento
          </button>
        </form>
      </section>

      {/* GALERIA */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Camera color="#7c3aed" /> Nossa Galeria
        </h2>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Suba fotos de jogos, treinos e momentos especiais 🫶</p>

        <div style={{ marginTop: 12 }}>
          <label style={btn({ cursor: 'pointer' })}>
            <Upload size={18} style={{ marginRight: 8 }} /> Enviar imagens
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={onUploadImagens} />
          </label>
        </div>

        {galeria.length === 0 ? (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280' }}>
            <ImagePlus /> Nada por aqui ainda — suba as primeiras fotos!
          </div>
        ) : (
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {galeria.map((src, idx) => (
              <motion.div key={idx} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ overflow: 'hidden', border: '1px solid #e5e7eb', borderRadius: 16, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <img src={src} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* QR CODE */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 16, padding: 16, display: 'grid', gap: 16, alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Compartilhe com um QR</h3>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Imprima e cole no presente. Ao escanear, abre este app ❤️</p>
          </div>
          <div style={{ justifySelf: 'center' }}>
            {qrUrl ? <img src={qrUrl} alt="QR Code" width="160" height="160" /> : <div style={{ color: '#6b7280' }}>QR indisponível no preview.</div>}
          </div>
        </div>
      </section>

      {/* DECLARAÇÃO FINAL */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 48px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 24, padding: 24, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <Heart color="#e11d48" style={{ display: 'inline-block' }} />
          <p style={{ marginTop: 12, fontSize: 18, color: '#374151' }}>{FRASE_FINAL}</p>
        </motion.div>
      </section>

      <footer style={{ padding: '24px 0', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
        Feito com <span style={{ color: '#e11d48' }}>❤</span> por Juninho para {Juninha}
      </footer>
    </div>
  )
}

// === Helpers de estilo ===
function btn(extra = {}) {
  return {
    display: 'inline-flex', alignItems: 'center', padding: '8px 14px',
    border: '1px solid #e5e7eb', borderRadius: 16, background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)', ...extra
  }
}
function primary() {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '10px 16px', borderRadius: 16, border: '1px solid #e11d48',
    background: '#e11d48', color: '#fff', fontWeight: 600
  }
}
function label() {
  return { display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 6 }
}
function input() {
  return { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 10 }
}

function ContadorCard({ icon, titulo, valor, destaque = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      style={{
        border: '1px solid #e5e7eb', background: '#fff', padding: 16, borderRadius: 20,
                boxShadow: destaque ? '0 0 0 3px #ffe4e6' : '0 1px 3px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: '#fff1f2',
            border: '1px solid #ffe4e6',
            display: 'grid',
            placeItems: 'center'
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{titulo}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{valor}</div>
        </div>
      </div>
    </motion.div>
  )
}

