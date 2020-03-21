import React, { Fragment, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { /*Link,*/ graphql } from 'gatsby'
import { format } from 'date-fns'
import { pathOr, path, pipe, filter, prop, map } from 'ramda'
import SEO from '../components/seo'
import Photo from '../components/Photo'

// import Layout from '../components/layout'

// Helpers
// ----------------------------------------------------------------------------

const getPosts = pipe(
  pathOr([], ['allContentfulPost', 'edges']),
  map(prop('node')),
  filter(Boolean)
)

const getPhotoFluid = path(['localFile', 'childImageSharp', 'fluid'])

const formatPostDate = pipe(path(['date']), date =>
  format(new Date(date), 'MM / yyyy')
)

// Styles
// ----------------------------------------------------------------------------

const GlobalStyle = createGlobalStyle`
  html, body {
    scroll-snap-type: y mandatory;
    background-color: #000;
    font-family: 'Montserrat', sans-serif;
    color: #fff;
    font-size: 16px;

    @media (max-width: 768px ) {
      scroll-snap-type: initial;
    }
  }
`

const Home = styled.div`
  display: grid;
  padding: 50vh 1rem;
  grid-gap: 50vh;
  justify-items: center;

  > * {
    scroll-snap-align: center;
  }

  > h1 {
    margin: 0;
    font-weight: 700;
    font-size: 2rem;
    letter-spacing: 2rem;
    padding-left: 2rem;
    word-break: break-all;
    text-align: center;
    text-transform: uppercase;
    transform: translateY(-50%);
  }
`

const TitleBlock = styled.div`
  text-align: center;

  > * {
    margin: 0;
    :not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  > h2 {
    font-size: 1.4rem;
    font-weight: 400;
  }
`

// Main
// ----------------------------------------------------------------------------

export default ({ data }) => {
  const posts = getPosts(data)

  useEffect(() => {
    const fontLinkElement = document.createElement('link')
    fontLinkElement.href =
      'https://fonts.googleapis.com/css?family=Montserrat:300,400,700'
    fontLinkElement.rel = 'stylesheet'
    document.head.appendChild(fontLinkElement)
  }, [])

  return (
    <>
      <GlobalStyle />
      <Home>
        <SEO title="V E P H O T O" />
        <h1>VEPHOTO</h1>
        {posts.map(post => (
          <Fragment key={post.id}>
            {console.log(post)}
            <TitleBlock>
              <h2>{post.title}</h2>
              <p>{formatPostDate(post)}</p>
            </TitleBlock>
            {post.photos.map(photo => {
              if (!photo) {
                return null
              }

              const photoProps = getPhotoFluid(photo)
              if (!photoProps) {
                return null
              }

              return (
                <Photo
                  {...photoProps}
                  key={photo.id}
                  alt={photo.title}
                  blurhash={photo.blurhash}
                />
              )
            })}
          </Fragment>
        ))}
      </Home>
    </>
  )
}

// GraphQL
// ----------------------------------------------------------------------------

export const pageQuery = graphql`
  query Posts {
    allContentfulPost(sort: { order: DESC, fields: date }) {
      edges {
        node {
          id
          title
          date
          photos {
            id
            title
            blurhash: description
            localFile {
              id
              publicURL
              childImageSharp {
                fluid(maxWidth: 4000, quality: 100, jpegProgressive: true) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          location {
            lon
            lat
          }
        }
      }
    }
  }
`
