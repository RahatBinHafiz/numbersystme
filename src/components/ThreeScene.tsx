import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { BlockSceneSpec } from '../utils/sceneAdapter'

interface Props {
  spec: BlockSceneSpec
  isDark: boolean
  accentHex: string
  version: number // bump to replay the reveal animation on a fresh conversion
}

interface HoverInfo {
  index: number
  lines: string[]
}

function makeTextSprite(text: string, color: string, fontSize = 88, canvasSize = 256): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = canvasSize
  canvas.height = canvasSize
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Sprite()

  ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvasSize / 2, canvasSize / 2 + 4)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.colorSpace = THREE.SRGBColorSpace

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
  const sprite = new THREE.Sprite(material)
  sprite.renderOrder = 10
  return sprite
}

interface Interactive {
  mesh: THREE.Object3D
  index: number
  lines: string[]
}

export function ThreeScene({ spec, isDark, accentHex, version }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<HoverInfo | null>(null)
  const [pinned, setPinned] = useState<HoverInfo | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 640
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 3.2, isMobile ? 10 : 8)

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 4
    controls.maxDistance = 16
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.target.set(0, 0.2, 0)

    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.9)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffffff, isDark ? 1.2 : 1.0)
    key.position.set(4, 6, 5)
    scene.add(key)

    // Resolved color for rim light
    const rimColor = accentHex.startsWith('#')
      ? new THREE.Color(accentHex)
      : new THREE.Color(isDark ? '#c084fc' : '#9333ea')

    const rim = new THREE.PointLight(rimColor, isDark ? 2.2 : 1.2, 20)
    rim.position.set(-4, 2, -3)
    scene.add(rim)

    const group = new THREE.Group()
    scene.add(group)

    const interactives: Interactive[] = []
    const baseColor = (hex: string) => {
      try {
        return new THREE.Color(hex.startsWith('#') ? hex : '#a855c9')
      } catch {
        return new THREE.Color('#a855c9')
      }
    }

    const inkColor = isDark ? '#f3e9fb' : '#1e1b4b'
    const cubeUnit = 0.86

    function addCube(x: number, z: number, colorHex: string, heightScale = 1, label?: string) {
      const geo = new THREE.BoxGeometry(cubeUnit, cubeUnit * heightScale, cubeUnit)
      const mat = new THREE.MeshStandardMaterial({
        color: baseColor(colorHex),
        roughness: 0.35,
        metalness: 0.15,
        emissive: baseColor(colorHex),
        emissiveIntensity: 0.15,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, (cubeUnit * heightScale) / 2, z)
      group.add(mesh)

      if (label) {
        const sprite = makeTextSprite(label, '#ffffff', 120)
        sprite.scale.set(0.62, 0.62, 1)
        sprite.position.set(x, (cubeUnit * heightScale) / 2, z + cubeUnit / 2 + 0.02)
        group.add(sprite)
      }
      return mesh
    }

    function addLabel(x: number, y: number, z: number, text: string, color: string, scale = 0.55) {
      const sprite = makeTextSprite(text, color, 100)
      sprite.scale.set(scale, scale, 1)
      sprite.position.set(x, y, z)
      group.add(sprite)
      return sprite
    }

    // ---- Build scene content per spec kind ----
    if (spec.kind === 'positional') {
      const n = spec.blocks.length
      const maxVal = Math.max(1, ...spec.blocks.map((b) => b.value))
      const spacing = 1.18
      const startX = -((n - 1) * spacing) / 2
      const resolvedColor = accentHex.startsWith('#') ? accentHex : '#c084fc'

      spec.blocks.forEach((b, i) => {
        const x = startX + i * spacing
        const heightScale = 0.55 + (b.value / maxVal) * 1.1
        const mesh = addCube(x, 0, resolvedColor, heightScale, b.digit)
        addLabel(x, cubeUnit * heightScale + 0.35, 0, b.power, inkColor, 0.42)
        addLabel(x, -0.38, 0, String(b.value), resolvedColor, 0.4)
        interactives.push({
          mesh,
          index: i,
          lines: [`Digit: ${b.digit}`, `Position: ${b.position}`, `Power: ${b.power}`, `Value: ${b.value}`],
        })
      })
    }

    if (spec.kind === 'division') {
      const n = spec.blocks.length
      const spacingY = 1.1
      const topY = ((n - 1) * spacingY) / 2
      const resolvedColor = accentHex.startsWith('#') ? accentHex : '#38bdf8'

      spec.blocks.forEach((b, i) => {
        const y = topY - i * spacingY
        const mesh = addCube(0, 0, resolvedColor, 0.75)
        mesh.position.y = y
        addLabel(-2.1, y + 0.38, 0, `${b.dividend}÷${b.divisor}=${b.quotient}`, inkColor, 0.32)
        addLabel(1.8, y + 0.38, 0, `rem ${b.remainder}`, resolvedColor, 0.4)
        interactives.push({
          mesh,
          index: i,
          lines: [
            `${b.dividend} ÷ ${b.divisor} = ${b.quotient} remainder ${b.remainder}`,
            b.isFirst ? 'First division → LSB' : b.isLast ? 'Last division → MSB' : '',
          ].filter(Boolean),
        })
      })
    }

    if (spec.kind === 'grouped') {
      const groupGap = 0.6
      const bitGap = 0.15
      const widths = spec.clusters.map((c) => c.bits.length * (cubeUnit + bitGap) - bitGap)
      const totalWidth = widths.reduce((a, w) => a + w, 0) + groupGap * (spec.clusters.length - 1)
      let cursorX = -totalWidth / 2
      const resolvedColor = accentHex.startsWith('#') ? accentHex : '#34d399'

      spec.clusters.forEach((cluster, ci) => {
        const clusterStartX = cursorX
        cluster.bits.split('').forEach((bit, bi) => {
          const x = clusterStartX + bi * (cubeUnit + bitGap)
          const color = bit === '1' ? resolvedColor : (isDark ? '#3a2a4a' : '#e7d7ee')
          const mesh = addCube(x, 0, color, 0.7, bit)
          interactives.push({
            mesh,
            index: ci * 1000 + bi,
            lines: [`Bit: ${bit}`, `Group ${ci + 1}`],
          })
        })
        const clusterCenter = clusterStartX + (widths[ci] - cubeUnit) / 2
        const labelColor = isDark ? '#c77dff' : '#9d4edd'
        if (cluster.arrowDown) {
          addLabel(clusterCenter, -0.55, 0, '↓', inkColor, 0.4)
          addLabel(clusterCenter, -1.15, 0, cluster.label, labelColor, 0.62)
        } else {
          addLabel(clusterCenter, 1.1, 0, cluster.label, labelColor, 0.62)
          addLabel(clusterCenter, 0.65, 0, '↓', inkColor, 0.4)
        }
        cursorX += widths[ci] + groupGap
      })
    }

    // gentle float-in reveal
    group.children.forEach((child, i) => {
      const originalY = child.position.y
      child.position.y = originalY - 1.2
      const delay = i * 25
      setTimeout(() => {
        const start = performance.now()
        const duration = 350
        function step(now: number) {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          child.position.y = originalY - 1.2 * (1 - eased)
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, delay)
    })

    // ---- Resize handling ----
    function resize() {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / Math.max(1, h)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    // ---- Pointer interaction ----
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hoveredMesh: THREE.Object3D | null = null

    function setPointerFromEvent(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    function handleMove(e: PointerEvent) {
      setPointerFromEvent(e)
      raycaster.setFromCamera(pointer, camera)
      const meshes = interactives.map((it) => it.mesh)
      const hits = raycaster.intersectObjects(meshes, false)
      if (hits.length > 0) {
        const hit = hits[0].object
        if (hoveredMesh !== hit) {
          if (hoveredMesh) ((hoveredMesh as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15
          hoveredMesh = hit
          ;((hit as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6
        }
        const found = interactives.find((it) => it.mesh === hit)
        if (found) setHover({ index: found.index, lines: found.lines })
      } else {
        if (hoveredMesh) {
          ((hoveredMesh as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15
          hoveredMesh = null
        }
        setHover(null)
      }
    }

    function handleClick(e: PointerEvent) {
      setPointerFromEvent(e)
      raycaster.setFromCamera(pointer, camera)
      const meshes = interactives.map((it) => it.mesh)
      const hits = raycaster.intersectObjects(meshes, false)
      if (hits.length > 0) {
        const found = interactives.find((it) => it.mesh === hits[0].object)
        if (found) setPinned({ index: found.index, lines: found.lines })
      } else {
        setPinned(null)
      }
    }

    renderer.domElement.addEventListener('pointermove', handleMove)
    renderer.domElement.addEventListener('pointerdown', handleClick)

    let raf = 0
    function animate() {
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointermove', handleMove)
      renderer.domElement.removeEventListener('pointerdown', handleClick)
      controls.dispose()
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose()
        const mat = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat?.dispose()
      })
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [spec, isDark, accentHex, version])

  const info = pinned ?? hover

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="h-72 w-full touch-none sm:h-96" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-medium text-[var(--ink-soft)]"
        style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))', background: 'rgb(var(--surface) / 0.7)' }}
      >
        Drag to rotate 3D · Tap a block for details
      </div>
      {info && (
        <div className="glass pointer-events-none absolute bottom-3 left-3 right-3 rounded-2xl p-3 text-xs sm:text-sm sm:left-3 sm:right-auto sm:min-w-[220px] shadow-lg border" style={{ borderColor: 'rgb(var(--border) / var(--border-alpha))' }}>
          {info.lines.map((line, i) => (
            <p key={i} className={i === 0 ? 'font-mono-num font-bold text-[var(--accent)]' : 'text-[var(--ink-soft)]'}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
