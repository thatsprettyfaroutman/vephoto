import React, { useRef, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'

const Photo = styled.div`
  position: relative;
  width: 100%;

  > img {
    display: block;
    margin: 0;
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 1rem);
    object-fit: contain;
    object-position: 50% 50%;
  }

  > img:nth-child(2) {
    position: absolute;
    top: 0;
    left: 0;
  }
`

export default ({ srcSet, ...restProps }) => {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [loading, setLoading] = useState(true)

  console.log({ near, loading })

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
      if (top < 0) {
        setNear(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ref, loading])

  useLayoutEffect(() => {
    if (!near) {
      return
    }
    const img = new Image()
    img.srcset = srcSet
    img.onload = () => {
      setTimeout(() => {
        if (ref && ref.current) {
          setLoading(false)
        }
      }, 5000)
    }

    return () => {
      ref.current = null
    }
  }, [near, ref, srcSet])

  const thumbSpring = useSpring({
    opacity: loading ? 1 : 0,
  })

  const photoSpring = useSpring({
    opacity: loading ? 0 : 1,
  })

  return (
    <Photo ref={ref} {...restProps}>
      <animated.img
        style={thumbSpring}
        src={restProps.src}
        alt={restProps.alt}
      />
      {near && <img srcSet={srcSet} alt={restProps.alt} />}
    </Photo>
  )
}
