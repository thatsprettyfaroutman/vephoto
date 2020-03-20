/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// const path = require(`path`)
// const R = require('ramda')

// exports.createPages = ({ graphql, actions }) => {
//   const { createPage } = actions
//   const component = path.resolve(`src/pages/index.js`)
//   // Query for markdown nodes to use in creating pages.
//   // You can query for whatever data you want to create pages for e.g.
//   // products, portfolio items, landing pages, etc.
//   // Variables can be added as the second function parameter
//   return graphql(
//     `
//       query Base64Photos {
//         allContentfulPost {
//           edges {
//             node {
//               photos {
//                 id
//                 localFile {
//                   id
//                   publicURL
//                   childImageSharp {
//                     fixed(base64Width: 120) {
//                       base64
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `,
//     { limit: 1000 }
//   ).then(res => {
//     if (res.errors) {
//       throw res.errors
//     }

//     console.log(R.path(['data', 'allContentfulPost', 'edges'], res))

//     // Create blog post pages.
//     // createPage({
//     //   // Path for this page — required
//     //   path: `index`,
//     //   component,
//     //   context: {
//     //     derp: 'omg',
//     //     // Add optional context data to be inserted
//     //     // as props into the page component..
//     //     //
//     //     // The context data can also be used as
//     //     // arguments to the page GraphQL query.
//     //     //
//     //     // The page "path" is always available as a GraphQL
//     //     // argument.
//     //   },
//     // })
//   })
// }
