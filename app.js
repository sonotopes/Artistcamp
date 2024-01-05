// app.js - SETUP section
var express = require("express") // We are using the express library for the web server
var app = express() // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public")) // this is needed to allow for the form to use the ccs style sheet/javscript

PORT = 25060 // Set a port number at the top so it's easy to change in the future

var db = require("./database/db-connector")

const { engine } = require("express-handlebars")

var exphbs = require("express-handlebars") // Import express-handlebars
app.engine(".hbs", engine({ extname: ".hbs" })) // Create an instance of the handlebars engine to process templates
app.set("view engine", ".hbs") // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

app.get("/", function (req, res) {
  return res.render("index")
})

app.get("/index.html", function (req, res) {
  return res.render("index")
})

//
//  ARTISTS ROUTES & CONTROLLERS
//

app.get("/Artists", function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.artistSearch === undefined) {
    query1 = "SELECT * FROM Artists;"
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM Artists WHERE artistName LIKE '${req.query.artistSearch}%'`
  }

  // Query 2 is the same in both cases

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    // Save 
    let artists = rows
    return res.render("Artists", { data: artists })
  })
})

app.get("/artistNames", function (req, res) {
  query1 = "SELECT * FROM Artists;"
  db.pool.query(query1, function (error, rows, fields) {
    // Save 
    let artists = rows
    return res.json({ data: artists })
  })
})

app.post("/add-artist-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body
  let artistName = data.artistName
  let genre = data.genre
  let location = data.location
  let imageURL = data.imageURL
  let password = data.password

  // Create the query and run it on the database
  query1 = `INSERT INTO Artists (artistName, genre, location, imageURL, password) VALUES ('${artistName}', '${genre}', '${location}', '${imageURL}', '${password}')`

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      // If there was no error, perform a SELECT * 
      query2 = `SELECT * FROM Artists;`
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400)
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows)
        }
      })
    }
  })
})

app.put("/put-artist-ajax", function (req, res, next) {
  let data = req.body

  let artistID = parseInt(data.artistID)
  let genre = data.genre
  let location = data.location

  let queryUpdateGenre = `UPDATE Artists SET genre = ? WHERE Artists.artistID = ?`
  let queryUpdateLocation = `UPDATE Artists SET location = ? WHERE Artists.artistID = ?`
  let selectArtist = `SELECT * FROM Artists WHERE artistID = ?`

  // Run the 1st query
  db.pool.query(
    queryUpdateGenre,
    [genre, artistID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      }

      // If there was no error, we run our second query and return that data so we can use it to update the
      // table on the front-end
      else {
        // Run the second query
        db.pool.query(
          queryUpdateLocation,
          [location, artistID],
          function (error, rows, fields) {
            if (error) {
              console.log(error)
              res.sendStatus(400)
            } else {
              db.pool.query(
                selectArtist,
                [artistID],
                function (error, rows, fields) {
                  if (error) {
                    console.log(error)
                    res.sendStatus(400)
                  } else {
                    result = rows
                    res.send(result)
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

app.delete("/delete-artist-ajax/", function (req, res, next) {
  let data = req.body
  let artistID = parseInt(data.id)
  let deleteArtists_artist = `DELETE FROM Artists WHERE artistID = ?`
  //let deleteReleases_artist= `DELETE FROM Releases WHERE artistId = ?`;

  // Run the 1st query
  db.pool.query(
    deleteArtists_artist,
    [artistID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      } else {
        res.sendStatus(204)
      }
    }
  )
})

//
//  CUSTOMERS ROUTES & CONTROLLERS
//

app.get("/Customers", function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.customerSearch === undefined) {
    query1 = "SELECT * FROM Customers;"
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM Customers WHERE customerName LIKE '${req.query.customerSearch}%'`
  }

  // Query 2 is the same in both cases

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let customers = rows
    return res.render("Customers", { data: customers })
  })
})

app.post("/add-customer-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body
  let customerName = data.customerName
  let email = data.email
  let password = data.password
  let imageURL = data.imageURL

  // Create the query and run it on the database
  query1 = `INSERT INTO Customers (email, customerName, password, imageURL) VALUES ('${email}', '${customerName}', '${password}', '${imageURL}')`

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      // If there was no error, perform a SELECT * 
      query2 = `SELECT * FROM Customers;`
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400)
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows)
        }
      })
    }
  })
})

app.put("/put-customer-ajax", function (req, res, next) {
  let data = req.body

  let customerID = parseInt(data.customerID)
  let email = data.email
  let password = data.password

  let queryUpdateEmail = `UPDATE Customers SET email = ? WHERE Customers.customerID = ?`
  let queryUpdatePassword = `UPDATE Customers SET password = ? WHERE Customers.customerID = ?`
  let selectCustomer = `SELECT * FROM Customers WHERE customerID = ?`

  // Run the 1st query
  db.pool.query(
    queryUpdateEmail,
    [email, customerID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      }

      // If there was no error, we run our second query and return that data so we can use it to update the
      // table on the front-end
      else {
        // Run the second query
        db.pool.query(
          queryUpdatePassword,
          [password, customerID],
          function (error, rows, fields) {
            if (error) {
              console.log(error)
              res.sendStatus(400)
            } else {
              db.pool.query(
                selectCustomer,
                [customerID],
                function (error, rows, fields) {
                  if (error) {
                    console.log(error)
                    res.sendStatus(400)
                  } else {
                    result = rows
                    res.send(result)
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

app.delete("/delete-customer-ajax/", function (req, res, next) {
  let data = req.body
  let customerID = parseInt(data.id)
  let deleteCustomers_customer = `DELETE FROM Customers WHERE customerID = ?`
  //let deleteReleases_artist= `DELETE FROM Releases WHERE artistId = ?`;

  // Run the 1st query
  db.pool.query(
    deleteCustomers_customer,
    [customerID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      } else {
        res.sendStatus(204)
      }
    }
  )
})

app.get("/customers-json", function (req, res) {
  query1 = "SELECT * FROM Customers;"
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let customers = rows
    return res.status(200).json({ data: customers })
  })
})

//
//  RELEASES ROUTES & CONTROLLERS
//

app.get("/releases", function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.releaseSearch === undefined) {
    query1 = "SELECT * FROM Releases;"
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM Releases WHERE title LIKE '${req.query.releaseSearch}%'`
  }

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    return res.render("releases", { data: rows })
  })
})

app.get("/releases-json", function (req, res) {
  query1 = "SELECT * FROM Releases;"
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let releases = rows
    return res.status(200).json({ data: releases })
  })
})

app.post("/add-release-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body
  console.log(data)
  let artistID = data.artistID
  let title = data.title
  let releaseDate = data.releaseDate
  let imageURL = data.imageURL
  let price = data.price
  let description = data.description

  // Create the query and run it on the database
  query1 = `INSERT INTO Releases (artistID, title, releaseDate, imageURL, price, description) VALUES ('${artistID}', '${title}', '${releaseDate}', '${imageURL}', '${price}', '${description}')`

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      // If there was no error, perform a SELECT * 
      query2 = `SELECT * FROM Releases;`
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400)
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows)
        }
      })
    }
  })
})

app.put("/put-release-ajax", function (req, res, next) {
  let data = req.body
  console.log(data)
  let releaseID = data.releaseID
  let artistID = data.artistID

  let title = data.title
  let releaseDate = data.releaseDate // so far query up to here
  let imageURL = data.imageURL
  let price = data.price
  let description = data.description

  let queryUpdateTitle = `UPDATE Releases SET title = ? WHERE Releases.releaseID = ?`
  let queryUpdateReleaseDate = `UPDATE Releases SET releaseDate = ? WHERE Releases.releaseID = ?`
  let queryUpdateImageURL = `UPDATE Releases SET imageURL = ? WHERE Releases.releaseID = ?`
  let queryUpdatePrice = `UPDATE Releases SET price = ? WHERE Releases.releaseID = ?`
  let queryUpdateDescription = `UPDATE Releases SET description = ? WHERE Releases.releaseID = ?`
  let selectRelease = `SELECT * FROM Releases WHERE releaseID = ?`

  db.pool.query(
    queryUpdateImageURL,
    [imageURL, releaseID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      } else {
        db.pool.query(
          queryUpdatePrice,
          [price, releaseID],
          function (error, rows, fields) {
            if (error) {
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error)
              res.sendStatus(400)
            } else {
              db.pool.query(
                queryUpdateDescription,
                [description, releaseID],
                function (error, rows, fields) {
                  if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                  } else {
                    // Run the 1st query
                    db.pool.query(
                      queryUpdateTitle,
                      [title, releaseID],
                      function (error, rows, fields) {
                        if (error) {
                          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                          console.log(error)
                          res.sendStatus(400)
                        }

                        // If there was no error, we run our second query and return that data so we can use it to update the
                        // table on the front-end
                        else {
                          // Run the second query
                          db.pool.query(
                            queryUpdateReleaseDate,
                            [releaseDate, releaseID],
                            function (error, rows, fields) {
                              if (error) {
                                console.log(error)
                                res.sendStatus(400)
                              } else {
                                db.pool.query(
                                  selectRelease,
                                  [releaseID],
                                  function (error, rows, fields) {
                                    if (error) {
                                      console.log(error)
                                      res.sendStatus(400)
                                    } else {
                                      result = rows
                                      res.send(result)
                                    }
                                  }
                                )
                              }
                            }
                          )
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

app.delete("/delete-release-ajax/", function (req, res, next) {
  let data = req.body
  console.log("delete data", data)
  let releaseID = parseInt(data.id)
  let deleteArtists_artist = `DELETE FROM Releases WHERE releaseID = ?`
  //let deleteReleases_artist= `DELETE FROM Releases WHERE artistId = ?`;

  // Run the 1st query
  db.pool.query(
    deleteArtists_artist,
    [releaseID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      } else {
        res.sendStatus(204)
      }
    }
  )
})

//
//    TRACKS ROUTES & CONTROLLERS
//

app.get("/tracks", function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.trackSearch === undefined) {
    query1 = "SELECT * FROM Tracks;"
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM Tracks WHERE title LIKE '${req.query.trackSearch}%'`
  }

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    return res.render("tracks", { data: rows })
  })
})

app.get("/tracks-json", function (req, res) {
  query1 = "SELECT * FROM Tracks;"
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let tracks = rows
    return res.status(200).json({ data: tracks })
  })
})

app.put("/put-track-ajax", function (req, res, next) {
  let data = req.body
  console.log("heres data!", data)
  let releaseID = data.releaseID
  let title = data.title
  let trackID = data.trackID

  let queryUpdateTitle = `UPDATE Tracks SET title = ? WHERE Tracks.trackID = ?`
  let queryUpdateReleaseID = `UPDATE Tracks SET releaseID = ? WHERE Tracks.trackID = ?`
  let selectTrack = `SELECT * FROM Tracks WHERE trackID = ?`

  db.pool.query(
    queryUpdateReleaseID,
    [releaseID, trackID],
    function (error, rows, fields) {
      console.log("first query")
      if (error) {
        console.log(error)
        res.sendStatus(400)
      } else {
        console.log("second query")
        db.pool.query(
          queryUpdateTitle,
          [title, trackID],
          function (error, rows, fields) {
            if (error) {
              console.log(error)
              res.sendStatus(400)
            } else {
              console.log("third query")
              db.pool.query(
                selectTrack,
                [trackID],
                function (error, rows, fields) {
                  if (error) {
                    console.log(error)
                    res.sendStatus(400)
                  } else {
                    result = rows
                    res.send(result)
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

app.post("/add-track-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body
  console.log(data)
  let trackID = data.trackID
  let title = data.title
  let releaseID = data.releaseID

  // Create the query and run it on the database
  query1 = `INSERT INTO Tracks (title, releaseID) VALUES ('${title}', '${releaseID}')`

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      // If there was no error, perform a SELECT * on bsg_people
      query2 = `SELECT * FROM Tracks;`
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400)
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows)
        }
      })
    }
  })
})

app.delete("/delete-track-ajax/", function (req, res, next) {
  let data = req.body
  console.log("delete data", data)
  let trackID = parseInt(data.id)
  let deleteTrack = `DELETE FROM Tracks WHERE trackID = ?`
  //let deleteReleases_artist= `DELETE FROM Releases WHERE artistId = ?`;

  // Run the 1st query
  db.pool.query(deleteTrack, [trackID], function (error, rows, fields) {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      res.sendStatus(204)
    }
  })
})

//
//  ORDERS ROUTES & CONTROLLERS
//

app.get("/orders", function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.orderSearch === undefined) {
    query1 = "SELECT * FROM Orders;"
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM Orders WHERE orderID LIKE '${req.query.orderSearch}%'`
  }

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    return res.render("orders", { data: rows })
  })
})

app.get("/orders-json", function (req, res) {
  query1 = "SELECT * FROM Orders;"
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let orders = rows
    return res.status(200).json({ data: orders })
  })
})

app.post("/add-order-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body
  console.log("data received for order add", data)
  let orderID = data.orderID
  let customerID = data.customerID
  let orderDate = data.orderDate
  let totalPrice = data.totalPrice
  let salesTax = data.salesTax

  // Create the query and run it on the database
  query1 = `INSERT INTO Orders (customerID, orderDate, totalPrice, salesTax) VALUES ('${customerID}', '${orderDate}', '${totalPrice}', '${salesTax}')`

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      // If there was no error, perform a SELECT * 
      query2 = `SELECT * FROM Orders;`
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400)
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows)
        }
      })
    }
  })
})

app.put("/put-order-ajax", function (req, res, next) {
  let data = req.body
  console.log("heres data!", data)
  let orderID = data.orderID
  let customerID = data.customerID
  let orderDate = data.dateUpdate
  let totalPrice = data.totalPrice
  let salesTax = data.salesTax

  console.log("here...")
  // customerID
  let queryUpdateCustomerID = `UPDATE Orders SET customerID = ? WHERE Orders.orderID = ?`
  // orderDate
  let queryUpdateOrderDate = `UPDATE Orders SET orderDate = ? WHERE Orders.orderID = ?`
  // totalPrice
  let queryUpdateTotalPrice = `UPDATE Orders SET totalPrice = ? WHERE Orders.orderID = ?`
  // salesTax
  let queryUpdateSalesTax = `UPDATE Orders SET salesTax = ? WHERE Orders.orderID = ?`
  // return query
  let selectOrder = `SELECT * FROM Orders WHERE orderID = ?`

  console.log("1 here...")

  db.pool.query(
    queryUpdateCustomerID,
    [customerID, orderID],
    function (error, rows, fields) {
      if (error) {
        console.log(error)
        res.sendStatus(400)
      } else {
        db.pool.query(
          queryUpdateOrderDate,
          [orderDate, orderID],
          function (error, rows, fields) {
            if (error) {
              console.log(error)
              res.sendStatus(400)
            } else {
              db.pool.query(
                queryUpdateTotalPrice,
                [totalPrice, orderID],
                function (error, rows, fields) {
                  if (error) {
                    console.log(error)
                    res.sendStatus(400)
                  } else {
                    db.pool.query(
                      queryUpdateSalesTax,
                      [salesTax, orderID],
                      function (error, rows, fields) {
                        if (error) {
                          console.log(error)
                          res.sendStatus(400)
                        } else {
                          db.pool.query(
                            selectOrder,
                            [orderID],
                            function (error, rows, fields) {
                              if (error) {
                                console.log(error)
                                res.sendStatus(400)
                              } else {
                                result = rows
                                res.send(result)
                              }
                            }
                          )
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

app.delete("/delete-order-ajax/", function (req, res, next) {
  let data = req.body
  console.log("delete data", data)
  let orderID = parseInt(data.id)
  let deleteOrder = `DELETE FROM Orders WHERE orderID = ?`
  //let deleteReleases_artist= `DELETE FROM Releases WHERE artistId = ?`;

  // Run the 1st query
  db.pool.query(deleteOrder, [orderID], function (error, rows, fields) {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      res.sendStatus(204)
    }
  })
})

//
// RELEASE ORDERS ROUTES & CONTROLLERS
//

app.get("/releaseorders", function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.releaseorderSearch === undefined) {
    query1 = "SELECT * FROM ReleaseOrders;"
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM ReleaseOrders WHERE releaseorderID LIKE '${req.query.releaseorderSearch}%'`
  }

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    return res.render("releaseorders", { data: rows })
  })
})

app.post("/add-release-order-ajax", function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body
  console.log("data received for releaseorder add", data)
  let releaseorderID = data.releaseorderID
  let releaseID = data.releaseID
  let orderID = data.orderID
  let purchasePrice = data.purchasePrice

  // Create the query and run it on the database
  query1 = `INSERT INTO ReleaseOrders (releaseID, orderID, purchasePrice) VALUES ('${releaseID}', '${orderID}', '${purchasePrice}')`

  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    } else {
      // If there was no error, perform a SELECT * 
      query2 = `SELECT * FROM ReleaseOrders;`
      db.pool.query(query2, function (error, rows, fields) {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400)
        }
        // If all went well, send the results of the query back.
        else {
          res.send(rows)
        }
      })
    }
  })
})

app.put("/put-release-order-ajax", function (req, res, next) {
  let data = req.body
  console.log("heres data!", data)
  let releaseorderID = data.releaseorderID
  let releaseID = data.releaseID
  let orderID = data.orderID
  let purchasePrice = data.purchasePrice

  console.log("here...")
  // customerID
  let queryUpdateReleaseID = `UPDATE ReleaseOrders SET releaseID = ? WHERE ReleaseOrders.releaseorderID = ?`
  // orderDate
  let queryUpdateOrderID = `UPDATE ReleaseOrders SET orderID = ? WHERE ReleaseOrders.releaseorderID = ?`
  // totalPrice
  let queryUpdatePurchasePrice = `UPDATE ReleaseOrders SET purchasePrice = ? WHERE ReleaseOrders.releaseorderID = ?`
  // salesTax
  let selectReleaseOrder = `SELECT * FROM ReleaseOrders WHERE ReleaseOrders.releaseorderID = ?`

  console.log("1 here...")

  db.pool.query(
    queryUpdateReleaseID,
    [releaseID, releaseorderID],
    function (error, rows, fields) {
      if (error) {
        console.log(error)
        res.sendStatus(400)
      } else {
        db.pool.query(
          queryUpdateOrderID,
          [orderID, releaseorderID],
          function (error, rows, fields) {
            if (error) {
              console.log(error)
              res.sendStatus(400)
            } else {
              db.pool.query(
                queryUpdatePurchasePrice,
                [purchasePrice, releaseorderID],
                function (error, rows, fields) {
                  if (error) {
                    console.log(error)
                    res.sendStatus(400)
                  } else {
                    db.pool.query(
                      selectReleaseOrder,
                      [releaseorderID],
                      function (error, rows, fields) {
                        if (error) {
                          console.log(error)
                          res.sendStatus(400)
                        } else {
                          result = rows
                          res.send(result)
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})

app.delete("/delete-release-order-ajax/", function (req, res, next) {
  let data = req.body
  console.log("delete data", data)
  let releaseorderID = parseInt(data.id)
  let deleteReleaseOrder = `DELETE FROM ReleaseOrders WHERE releaseorderID = ?`
  //let deleteReleases_artist= `DELETE FROM Releases WHERE artistId = ?`;

  // Run the 1st query
  db.pool.query(
    deleteReleaseOrder,
    [releaseorderID],
    function (error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
      } else {
        res.sendStatus(204)
      }
    }
  )
})

/*
  APP IS LIVE & LISTENING @@ 
*/
app.listen(PORT, function () {
  console.log(
    "Express started on http://localhost: OR flip" +
      PORT +
      "; press Ctrl-C to terminate."
  )
})
