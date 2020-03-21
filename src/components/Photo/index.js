import React, { useRef, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { clamp } from 'ramda'
import { animated, useSpring } from 'react-spring'
import { BlurhashCanvas } from 'react-blurhash'

const Photo = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: calc(100vh - 1rem);

  > img {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    margin: 0;
    width: 100%;
    height: 100%;
    max-height: inherit;
    object-fit: contain;
    object-position: 50% 50%;
  }

  > div {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    margin: 0;
    width: 100%;
    height: 100%;
    max-height: inherit;

    > canvas {
      position: absolute;
      display: block;
      margin: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: 50% 50%;
    }
  }

  > :nth-child(2) {
    position: absolute;
  }
`

export default ({ srcSet, blurhash, aspectRatio, alt, ...restProps }) => {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    if (near) {
      return
    }
    const handleScroll = () => {
      const el = ref && ref.current
      if (!el) {
        return
      }
      const rect = el.getBoundingClientRect()
      const top = rect.top - window.innerHeight
      // const scale = clamp(-1, 1, rect.top / window.innerHeight)

      // el.style.transform = `perspective(${
      //   window.innerHeight
      // }px) rotate3d(1, 0, 0, ${scale * 5}deg)`
      // el.style.opacity = 1 - Math.abs(scale) + 0.25

      if (top < window.innerHeight / 4) {
        setNear(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [near, ref, loading])

  useLayoutEffect(() => {
    if (!near || !loading) {
      return
    }
    const img = new Image()
    img.srcset = srcSet
    img.onload = () => {
      setTimeout(() => {
        if (ref && ref.current) {
          setLoading(false)
        }
      }, 1000)
    }
  }, [near, loading, ref, srcSet])

  useLayoutEffect(
    () => () => {
      ref.current = null
    },
    []
  )

  const config = {
    tension: 100,
    clamp: true,
  }

  const blurhashSpring = useSpring({
    config,
    opacity: loading ? 10 : 0,
  })

  const photoSpring = useSpring({
    config,
    opacity: loading ? 0 : 1,
    transform: loading ? 'scale3d(0.98, 0.98, 1)' : 'scale3d(1, 1, 1)',
  })

  const blurWidth = Math.round(window.innerWidth)
  const blurHeight = Math.round(blurWidth / aspectRatio)

  return (
    <Photo ref={ref} {...restProps}>
      <animated.div style={blurhashSpring}>
        <BlurhashCanvas hash={blurhash} width={blurWidth} height={blurHeight} />
      </animated.div>
      {near && <animated.img style={photoSpring} srcSet={srcSet} alt={alt} />}
    </Photo>
  )
}
