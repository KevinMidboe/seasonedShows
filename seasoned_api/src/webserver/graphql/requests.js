const graphql = require("graphql");
const establishedDatabase = require('src/database/database');


const TorrentType = new graphql.GraphQLObjectType({
  name: "Torrent",
  fields: {
    magnet: { type: graphql.GraphQLString },
    torrent_name: { type: graphql.GraphQLString},
    tmdb_id: { type: graphql.GraphQLString },
    date_added: { type: graphql.GraphQLString }
  }
});

const RequestType = new graphql.GraphQLObjectType({
  name: "Request",
  fields: {
    id: { type: graphql.GraphQLID },
    title: { type: graphql.GraphQLString },
    year: { type: graphql.GraphQLInt},
    poster_path: { type: graphql.GraphQLString },
    background_path: { type: graphql.GraphQLString },
    requested_by: { type: graphql.GraphQLString },
    ip: { type: graphql.GraphQLString },
    date: { type: graphql.GraphQLString },
    status: { type: graphql.GraphQLString },
    user_agent: { type: graphql.GraphQLString },
    type: { type: graphql.GraphQLString },
    Torrent: {
      required: true,
      type: TorrentType,
      resolve(parentValue, args) {
        return establishedDatabase.get('select * from requested_torrent where tmdb_id = (?);', [parentValue.id])
      }
    }
  }
});

// create a graphql query to select all and by id
var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        //first query to select all
        Requests: {
            type: graphql.GraphQLList(RequestType),
            resolve: (root, args, context, info) => {
                return establishedDatabase.all("SELECT * FROM requests;")
                  .catch(error => console.error("something went wrong fetching 'all' query. Error:", error))
            }
        },
        DownloadingRequests: {
          type: graphql.GraphQLList(RequestType),
          resolve: (root, args, context, info) => {
            return establishedDatabase.all("SELECT * FROM requests;")
              .then(data => data.filter(request => { if (request.id === '83666') { console.log('request', request, root);}; return request }))
              .catch(error => console.error("something went wrong fetching 'all' query. Error:", error))
          }
        },
        DownloadingRequestByName: {
          type: RequestType,
          args:{
            name:{
              type: new graphql.GraphQLNonNull(graphql.GraphQLString)
            }               
          },
          resolve: (root, { name }, context, info) => {
            return establishedDatabase.all("SELECT * FROM requests where requested_by = (?);", [name])
              .catch(error => console.error("something went wrong fetching 'all' query. Error:", error))
          }
        },
        //second query to select by id
        Request:{
            type: RequestType,
            args:{
                id:{
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                }               
            },
            resolve: (root, {id}, context, info) => {
              return establishedDatabase.get("SELECT * FROM requests WHERE id = (?);",[id])
                .catch(error => console.error(`something went wrong fetching by id: '${ id }'. Error: ${ error }`))
            }
        },
        Torrents: {
          type: graphql.GraphQLList(TorrentType),
          resolve: (root, {id}, context, info) => {
            console.log('parent', parent)
            return establishedDatabase.all("SELECT * FROM requested_torrent")
              .catch(error => console.error(`something went wrong fetching all torrents. Error: ${ error }`))
          }
        },
        Torrent: {
          type: TorrentType,
          args: {
            id: {
              type: new graphql.GraphQLNonNull(graphql.GraphQLID)
            }
          },
          resolve: (parent, {id}, context, info) => {
            console.log('searcing from parent', parent)
            return establishedDatabase.get("SELECT * FROM requested_torrent WHERE tmdb_id = (?);", [id])
          }
        }
    }
});
//mutation type is a type of object to modify data (INSERT,DELETE,UPDATE)
// var mutationType = new graphql.GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//       //mutation for creacte
//       createPost: {
//         //type of object to return after create in SQLite
//         type: PostType,
//         //argument of mutation creactePost to get from request
//         args: {
//           title: {
//             type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//           },
//           description:{
//               type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//           },
//           createDate:{
//               type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//           },
//           author:{
//               type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//           }
//         },
//         resolve: (root, {title, description, createDate, author}) => {
//             return new Promise((resolve, reject) => {
//                 //raw SQLite to insert a new post in post table
//                 database.run('INSERT INTO Posts (title, description, createDate, author) VALUES (?,?,?,?);', [title, description, createDate, author], (err) => {
//                     if(err) {
//                         reject(null);
//                     }
//                     database.get("SELECT last_insert_rowid() as id", (err, row) => {
                        
//                         resolve({
//                             id: row["id"],
//                             title: title,
//                             description: description,
//                             createDate:createDate,
//                             author: author
//                         });
//                     });
//                 });
//             })
//         }
//       },
//       //mutation for update
//       updatePost: {
//         //type of object to return afater update in SQLite
//         type: graphql.GraphQLString,
//         //argument of mutation creactePost to get from request
//         args:{
//             id:{
//                 type: new graphql.GraphQLNonNull(graphql.GraphQLID)
//             },
//             title: {
//                 type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//             },
//             description:{
//                   type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//             },
//             createDate:{
//                   type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//             },
//             author:{
//                   type: new graphql.GraphQLNonNull(graphql.GraphQLString)
//             }             
//         },
//         resolve: (root, {id, title, description, createDate, author}) => {
//             return new Promise((resolve, reject) => {
//                 //raw SQLite to update a post in post table
//                 database.run('UPDATE Posts SET title = (?), description = (?), createDate = (?), author = (?) WHERE id = (?);', [title, description, createDate, author, id], (err) => {
//                     if(err) {
//                         reject(err);
//                     }
//                     resolve(`Post #${id} updated`);
//                 });
//             })
//         }
//       },
//       //mutation for update
//       deletePost: {
//          //type of object resturn after delete in SQLite
//         type: graphql.GraphQLString,
//         args:{
//             id:{
//                 type: new graphql.GraphQLNonNull(graphql.GraphQLID)
//             }               
//         },
//         resolve: (root, {id}) => {
//             return new Promise((resolve, reject) => {
//                 //raw query to delete from post table by id
//                 database.run('DELETE from Posts WHERE id =(?);', [id], (err) => {
//                     if(err) {
//                         reject(err);
//                     }
//                     resolve(`Post #${id} deleted`);                    
//                 });
//             })
//         }
//       }
//     }
// });

//define schema with post object, queries, and mustation 
const schema = new graphql.GraphQLSchema({
    query: queryType,
    // mutation: mutationType 
});

//export schema to use on index.js
module.exports = {
    schema
}