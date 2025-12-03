import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import { resolveAddress } from './ens'
import { fetchMakerStats } from './api'

// ===================
// BRAND COLORS
// ===================
const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  grey: '#888888',
  darkGrey: '#333333',
  background: '#0a0a0a',
  ignitionStart: '#FF3A33',
  ignitionEnd: '#FFE500',
}

// $100k threshold for gradient unlock
const VOLUME_THRESHOLD = 100000


// ===================
// FETCH PFP AS BASE64 (via CORS proxy)
// ===================
async function fetchPfpAsBase64(twitterHandle) {
  const imageUrl = `https://unavatar.io/twitter/${twitterHandle}`
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`

  const response = await fetch(proxyUrl)
  const blob = await response.blob()

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

// ===================
// PEER CARD COMPONENT
// ===================
function PeerCard({ stats, pfpBase64, displayAddress, showAddress }) {
  const isHighVolume = stats.volume >= VOLUME_THRESHOLD

  const gradientStyle = {
    background: `linear-gradient(180deg, ${COLORS.ignitionStart}, ${COLORS.ignitionEnd})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  const formatMoney = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const wrapperStyle = {
    padding: 4,
    borderRadius: 29,
    background: isHighVolume
      ? 'linear-gradient(180deg, #FF3A33, #FFE500)'
      : 'linear-gradient(180deg, #000000, #EEEEEE)',
    filter: isHighVolume
      ? 'drop-shadow(0px 0px 20px #FF3A33)'
      : 'none',
  }

  return (
    <div style={wrapperStyle}>
      <div style={{
        width: 354,
        height: 551,
        backgroundColor: '#000000',
        borderRadius: 25,
        fontFamily: "'PP Valve', 'Inter', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* PFP */}
        <div style={{
          position: 'absolute',
          top: showAddress ? 50 : 60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 247,
          height: 247,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: '#1a1a1a',
        }}>
          {pfpBase64 && (
            <img
              src={pfpBase64}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        {/* Address */}
        {showAddress && (
          <p style={{
            position: 'absolute',
            top: 300,
            left: 0,
            right: 0,
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: '16px',
            margin: 0,
          }}>
            {displayAddress}
          </p>
        )}

        {/* Volume */}
        <div style={{
          position: 'absolute',
          top: showAddress ? 335 : 320,
          left: 0,
          right: 0,
          textAlign: 'center',
          lineHeight: '37px',
        }}>
          <span style={{ 
            color: '#EEEEEE',
            fontSize: 28,
            fontWeight: 500,
          }}>
            VOLUME{' '}
          </span>
          <span style={{
            fontSize: 28,
            fontWeight: 500,
            ...(isHighVolume ? gradientStyle : { color: '#EEEEEE' }),
          }}>
            {formatMoney(stats.volume)}
          </span>
        </div>

        {/* Stats row 1 */}
        <div style={{
          position: 'absolute',
          top: showAddress ? 387 : 372,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 50,
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 14, 
              fontWeight: 500, 
              lineHeight: '18px',
              margin: 0,
            }}>
              PROFIT
            </p>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 20, 
              fontWeight: 500, 
              lineHeight: '26px', 
              margin: 0,
            }}>
              {formatMoney(stats.profit)}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 14, 
              fontWeight: 500, 
              lineHeight: '18px',
              margin: 0,
            }}>
              DEPOSITS
            </p>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 20, 
              fontWeight: 500, 
              lineHeight: '26px', 
              margin: 0,
            }}>
              {stats.deposits}
            </p>
          </div>
        </div>

        {/* Stats row 2 */}
        <div style={{
          position: 'absolute',
          top: showAddress ? 466 : 451,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 50,
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 14, 
              fontWeight: 500, 
              lineHeight: '18px',
              margin: 0,
            }}>
              CURRENCY
            </p>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 20, 
              fontWeight: 500, 
              lineHeight: '26px', 
              margin: 0,
            }}>
              {stats.currency}
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#EEEEEE', 
              fontSize: 14, 
              fontWeight: 500, 
              lineHeight: '18px',
              margin: 0,
            }}>
              PLATFORM
            </p>
            <p style={{ 
              color: 'rgba(238, 238, 238, 0.93)', 
              fontSize: 20, 
              fontWeight: 500, 
              lineHeight: '26px', 
              margin: 0,
            }}>
              {stats.platform}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


// ===================
// MAIN APP
// ===================
function App() {
  const [twitterHandle, setTwitterHandle] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [showAddress, setShowAddress] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [pfpBase64, setPfpBase64] = useState(null)

  const cardRef = useRef(null)

  const handleGenerate = async () => {
    if (!twitterHandle || !addressInput) return

    setLoading(true)

    try {
      // Fetch PFP via CORS proxy
      const base64 = await fetchPfpAsBase64(twitterHandle)
      setPfpBase64(base64)

      // Resolve ENS if needed
      const { address, display } = await resolveAddress(addressInput)

      // Fetch stats from API
      const stats = await fetchMakerStats(address)

      setCardData({
        stats,
        displayAddress: display,
      })
    } catch (error) {
      console.error('Failed to generate card:', error)
      alert('SOMETHING WENT WRONG. TRY AGAIN.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
      })

      const link = document.createElement('a')
      link.download = 'peer-card.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to download:', error)
    }
  }

  const handleTweet = () => {
    const volume = cardData?.stats?.volume || 0
    const text = `I've filled ${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(volume)} on @zkp2p 🔥`

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      fontFamily: "'PP Valve', 'Inter', sans-serif",
      color: COLORS.white,
    }}>
      <main style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: 48,
        display: 'grid',
        gridTemplateColumns: cardData ? '1fr 1fr' : '1fr',
        gap: 64,
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              marginBottom: 8,
              fontFamily: "'PP Valve', 'Inter', sans-serif",
            }}>
              GENERATE YOUR PEER CARD
            </h2>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              color: COLORS.grey,
              marginBottom: 8,
              letterSpacing: '0.05em',
              fontFamily: "'PP Valve', 'Inter', sans-serif",
            }}>
              TWITTER USERNAME
            </label>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value.replace('@', ''))}
              placeholder="USERNAME"
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#1a1a1a',
                border: `1px solid ${COLORS.darkGrey}`,
                borderRadius: 8,
                color: COLORS.white,
                fontSize: 16,
                outline: 'none',
                fontFamily: "'PP Valve', 'Inter', sans-serif",
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 12,
              color: COLORS.grey,
              marginBottom: 8,
              letterSpacing: '0.05em',
              fontFamily: "'PP Valve', 'Inter', sans-serif",
            }}>
              WALLET ADDRESS OR ENS
            </label>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="0X... OR NAME.ETH"
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#1a1a1a',
                border: `1px solid ${COLORS.darkGrey}`,
                borderRadius: 8,
                color: COLORS.white,
                fontSize: 16,
                outline: 'none',
                fontFamily: "'PP Valve', 'Inter', sans-serif",
              }}
            />
          </div>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={showAddress}
              onChange={(e) => setShowAddress(e.target.checked)}
              style={{
                width: 20,
                height: 20,
                accentColor: COLORS.ignitionStart,
              }}
            />
            <span style={{ 
              fontSize: 14,
              fontFamily: "'PP Valve', 'Inter', sans-serif",
            }}>
              SHOW ADDRESS ON CARD
            </span>
          </label>

          <button
            onClick={handleGenerate}
            disabled={loading || !twitterHandle || !addressInput}
            style={{
              padding: '16px 32px',
              background: `linear-gradient(90deg, ${COLORS.ignitionStart}, ${COLORS.ignitionEnd})`,
              border: 'none',
              borderRadius: 8,
              color: COLORS.black,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading || !twitterHandle || !addressInput ? 'not-allowed' : 'pointer',
              opacity: loading || !twitterHandle || !addressInput ? 0.5 : 1,
              fontFamily: "'PP Valve', 'Inter', sans-serif",
            }}
          >
            {loading ? 'GENERATING...' : 'GENERATE MY CARD!'}
          </button>

          {cardData && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: COLORS.white,
                  border: 'none',
                  borderRadius: 8,
                  color: COLORS.black,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'PP Valve', 'Inter', sans-serif",
                }}
              >
                DOWNLOAD PNG
              </button>
              <button
                onClick={handleTweet}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: '#1DA1F2',
                  border: 'none',
                  borderRadius: 8,
                  color: COLORS.white,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'PP Valve', 'Inter', sans-serif",
                }}
              >
                TWEET
              </button>
            </div>
          )}
        </div>

        {cardData && (
          <div ref={cardRef} style={{ display: 'flex', justifyContent: 'center' }}>
            <PeerCard
              stats={cardData.stats}
              pfpBase64={pfpBase64}
              displayAddress={cardData.displayAddress}
              showAddress={showAddress}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App