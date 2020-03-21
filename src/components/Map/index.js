import React, { useRef, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from 'react-simple-maps'
import { sum } from 'ramda'
import { PatternLines } from '@vx/pattern'

//
//
//
//

const GEO_URL =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-50m.json'

//
//
//
//

const avg = nums => sum(nums) / nums.length

//
//
//
//

const Map = styled.div`
  overflow: hidden;
  /* width: 40rem; */
  height: 20rem;
  /* border-radius: 50%; */
  /* border: 1px solid #fff; */

  > svg {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
  }
`

//
//
//
//

const cachedGeographies = (
  <Geographies geography={GEO_URL}>
    {({ geographies }) =>
      geographies.map(geo => (
        <Geography
          key={geo.rsmKey}
          geography={geo}
          // fill="url('#lines')"
          stroke="#fff"
        />
      ))
    }
  </Geographies>
)

//
//
//
//

export default ({ locations = [], ...restProps }) => {
  const ref = useRef(null)
  const [mapWidth, setMapWidth] = useState(0)
  const coords = locations.map(x => x.coordinates)
  const averageLon = avg(coords.map(x => x[0]))
  const averageLat = avg(coords.map(x => x[1]))

  useLayoutEffect(() => {
    const handleResize = () => {
      const el = ref && ref.current
      if (!el) {
        return
      }
      const { width } = el.getBoundingClientRect()
      setMapWidth(width)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref])

  if (!mapWidth) {
    return <Map {...restProps} ref={ref} />
  }

  return (
    <Map {...restProps} ref={ref}>
      <ComposableMap
        width={mapWidth}
        height={20 * 16}
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-averageLon, -averageLat],
          scale: 10000,
        }}
      >
        <PatternLines
          id="lines"
          height={8}
          width={8}
          stroke="#fff"
          strokeWidth={1}
          background="transparent"
          orientation={['horizontal']}
        />

        {cachedGeographies}

        {locations.map((location, i) => (
          <Annotation
            key={i}
            subject={location.coordinates}
            dx={4 * 16}
            dy={-3 * 16}
            connectorProps={{
              stroke: '#FF5533',
              strokeWidth: 1,
              strokeLinecap: 'round',
            }}
          >
            <text
              x="8"
              textAnchor="start"
              alignmentBaseline="middle"
              stroke="#000000cc"
              strokeWidth={16}
            >
              {location.name}
            </text>
            <text
              x="8"
              textAnchor="start"
              alignmentBaseline="middle"
              fill="#FF5533"
            >
              {location.name}
            </text>
          </Annotation>
        ))}
      </ComposableMap>
    </Map>
  )
}
