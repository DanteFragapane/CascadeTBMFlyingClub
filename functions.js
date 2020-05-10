const findPilotID = (connection, authorID, cb) => {
  connection.query(
    "SELECT pilotID FROM `pilots` WHERE discordID = ?",
    authorID,
    cb
  )
}

const findAirframe = (connection, nickname, cb) => {
  connection.query("SELECT id FROM airframes WHERE name = ?", nickname, cb)
}

const getAirframes = (connection, name, cb) => {
  connection.query("SELECT * FROM  ")
}
module.exports = { findPilotID, findAirframe }
